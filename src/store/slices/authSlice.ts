import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {
  User,
  LoginRequest,
  PinLoginRequest,
  Session,
  Permission,
  UserRole,
} from '@types/api.types';
import {authService} from '@api/services/authService';
import {TokenService} from '@services/TokenService';
import {JWTUtility} from '@utils/jwt.utils';
import {BiometricUtility} from '@utils/biometric.utils';
import {RBACUtility} from '@utils/rbac.utils';

/**
 * Authentication Store
 * Manages authentication state and actions with RBAC support
 */

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  session: Session | null;
  biometricEnabled: boolean;
  biometricAvailable: boolean;
  pinEnabled: boolean;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithPin: (credentials: PinLoginRequest) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
  updateSession: () => Promise<void>;
  checkBiometricAvailability: () => Promise<void>;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<boolean>;
  setPin: (pin: string) => Promise<void>;
  disablePin: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  immer((set, get) => ({
    // Initial state
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    session: null,
    biometricEnabled: false,
    biometricAvailable: false,
    pinEnabled: false,

    // Actions
    login: async (credentials: LoginRequest) => {
      try {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        const response = await authService.login(credentials);

        // Save tokens and user data
        await TokenService.saveTokens(response.token, response.refreshToken);
        await TokenService.saveUser(response.user);

        // Create session
        const expiresAt = JWTUtility.getTokenExpirationTime(response.token);
        const session: Session = {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresAt: expiresAt || new Date(Date.now() + response.expiresIn * 1000),
          lastActivity: new Date(),
          rememberMe: credentials.rememberMe || false,
        };

        set(state => {
          state.user = response.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.session = session;
          state.pinEnabled = response.user.pinEnabled || false;
          state.biometricEnabled = response.user.biometricEnabled || false;
        });

        // Check biometric availability
        await get().checkBiometricAvailability();
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Login failed';
          state.isLoading = false;
        });
        throw error;
      }
    },

    loginWithPin: async (credentials: PinLoginRequest) => {
      try {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        const response = await authService.loginWithPin(credentials);

        // Save tokens and user data
        await TokenService.saveTokens(response.token, response.refreshToken);
        await TokenService.saveUser(response.user);

        // Create session
        const expiresAt = JWTUtility.getTokenExpirationTime(response.token);
        const session: Session = {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresAt: expiresAt || new Date(Date.now() + response.expiresIn * 1000),
          lastActivity: new Date(),
          rememberMe: credentials.rememberMe || false,
        };

        set(state => {
          state.user = response.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.session = session;
          state.pinEnabled = response.user.pinEnabled || false;
          state.biometricEnabled = response.user.biometricEnabled || false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'PIN login failed';
          state.isLoading = false;
        });
        throw error;
      }
    },

    loginWithBiometric: async () => {
      try {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        // Authenticate with biometrics
        const result = await BiometricUtility.authenticate('Sign in to Yoga POS');

        if (!result.success) {
          throw new Error(result.error || 'Biometric authentication failed');
        }

        // Get stored credentials for biometric login
        const user = await TokenService.getUser();
        if (!user) {
          throw new Error('No stored user found');
        }

        // Perform PIN login with stored username
        const response = await authService.loginWithPin({
          username: user.username,
          pin: '', // PIN not needed for biometric auth
          rememberMe: true,
        });

        // Save tokens and user data
        await TokenService.saveTokens(response.token, response.refreshToken);
        await TokenService.saveUser(response.user);

        // Create session
        const expiresAt = JWTUtility.getTokenExpirationTime(response.token);
        const session: Session = {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresAt: expiresAt || new Date(Date.now() + response.expiresIn * 1000),
          lastActivity: new Date(),
          rememberMe: true,
        };

        set(state => {
          state.user = response.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.session = session;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Biometric login failed';
          state.isLoading = false;
        });
        throw error;
      }
    },

    logout: async () => {
      try {
        set(state => {
          state.isLoading = true;
        });

        // Call logout API
        await authService.logout();
      } catch (error) {
        // Continue with logout even if API call fails
        console.error('Logout API error:', error);
      } finally {
        // Clear tokens and user data
        await TokenService.clearTokens();

        set(state => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
          state.session = null;
        });
      }
    },

    loadUser: async () => {
      try {
        set(state => {
          state.isLoading = true;
        });

        const isAuthenticated = await TokenService.isAuthenticated();

        if (isAuthenticated) {
          // Load user from secure storage
          const user = await TokenService.getUser();
          const accessToken = await TokenService.getAccessToken();

          if (user && accessToken) {
            // Validate token
            const isValid = JWTUtility.validateToken(accessToken);

            if (isValid) {
              // Get token expiration
              const expiresAt = JWTUtility.getTokenExpirationTime(accessToken);
              const refreshToken = await TokenService.getRefreshToken();

              const session: Session = {
                user,
                token: accessToken,
                refreshToken: refreshToken || '',
                expiresAt: expiresAt || new Date(),
                lastActivity: new Date(),
                rememberMe: true,
              };

              set(state => {
                state.user = user;
                state.isAuthenticated = true;
                state.session = session;
                state.pinEnabled = user.pinEnabled || false;
                state.biometricEnabled = user.biometricEnabled || false;
              });

              // Check biometric availability
              await get().checkBiometricAvailability();
            } else {
              // Token invalid, clear everything
              await TokenService.clearTokens();
              set(state => {
                state.user = null;
                state.isAuthenticated = false;
              });
            }
          } else {
            // If no user data, fetch from API
            try {
              const currentUser = await authService.getCurrentUser();
              await TokenService.saveUser(currentUser);

              set(state => {
                state.user = currentUser;
                state.isAuthenticated = true;
                state.pinEnabled = currentUser.pinEnabled || false;
                state.biometricEnabled = currentUser.biometricEnabled || false;
              });
            } catch (error) {
              // If fetch fails, clear everything
              await TokenService.clearTokens();
              set(state => {
                state.user = null;
                state.isAuthenticated = false;
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        set(state => {
          state.user = null;
          state.isAuthenticated = false;
        });
      } finally {
        set(state => {
          state.isLoading = false;
        });
      }
    },

    updateSession: async () => {
      const {session} = get();
      if (session) {
        set(state => {
          if (state.session) {
            state.session.lastActivity = new Date();
          }
        });
      }
    },

    checkBiometricAvailability: async () => {
      const {available} = await BiometricUtility.isBiometricAvailable();
      set(state => {
        state.biometricAvailable = available;
      });
    },

    enableBiometric: async () => {
      try {
        const {available} = await BiometricUtility.isBiometricAvailable();
        if (!available) {
          throw new Error('Biometric authentication is not available');
        }

        // Test biometric authentication
        const result = await BiometricUtility.authenticate(
          'Enable biometric authentication',
        );

        if (result.success) {
          set(state => {
            state.biometricEnabled = true;
            if (state.user) {
              state.user.biometricEnabled = true;
            }
          });

          // Save updated user
          const user = get().user;
          if (user) {
            await TokenService.saveUser(user);
          }

          return true;
        }

        return false;
      } catch (error) {
        console.error('Error enabling biometric:', error);
        return false;
      }
    },

    disableBiometric: async () => {
      try {
        set(state => {
          state.biometricEnabled = false;
          if (state.user) {
            state.user.biometricEnabled = false;
          }
        });

        // Save updated user
        const user = get().user;
        if (user) {
          await TokenService.saveUser(user);
        }

        // Clear biometric keys
        await BiometricUtility.deleteKeys();

        return true;
      } catch (error) {
        console.error('Error disabling biometric:', error);
        return false;
      }
    },

    setPin: async (pin: string) => {
      try {
        const {user} = get();
        if (!user) {
          throw new Error('User not authenticated');
        }

        await authService.setPin(user.id, pin);

        set(state => {
          state.pinEnabled = true;
          if (state.user) {
            state.user.pinEnabled = true;
          }
        });

        // Save updated user
        const updatedUser = get().user;
        if (updatedUser) {
          await TokenService.saveUser(updatedUser);
        }
      } catch (error: any) {
        console.error('Error setting PIN:', error);
        throw error;
      }
    },

    disablePin: async () => {
      try {
        const {user} = get();
        if (!user) {
          throw new Error('User not authenticated');
        }

        await authService.disablePin(user.id);

        set(state => {
          state.pinEnabled = false;
          if (state.user) {
            state.user.pinEnabled = false;
          }
        });

        // Save updated user
        const updatedUser = get().user;
        if (updatedUser) {
          await TokenService.saveUser(updatedUser);
        }
      } catch (error: any) {
        console.error('Error disabling PIN:', error);
        throw error;
      }
    },

    hasPermission: (permission: Permission) => {
      const {user} = get();
      return RBACUtility.hasPermission(user, permission);
    },

    hasRole: (role: UserRole) => {
      const {user} = get();
      return RBACUtility.hasRole(user, role);
    },

    clearError: () => {
      set(state => {
        state.error = null;
      });
    },

    setUser: (user: User) => {
      set(state => {
        state.user = user;
      });
    },
  })),
);
