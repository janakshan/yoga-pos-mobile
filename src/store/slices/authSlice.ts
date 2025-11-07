import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {User, LoginRequest, PinLoginRequest} from '@types/api.types';
import {authService} from '@api/services/authService';
import {TokenService} from '@services/TokenService';

/**
 * Authentication Store
 * Manages authentication state and actions
 */

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithPin: (credentials: PinLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  immer((set, get) => ({
    // Initial state
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

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

        set(state => {
          state.user = response.user;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
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

        set(state => {
          state.user = response.user;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'PIN login failed';
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

          if (user) {
            set(state => {
              state.user = user;
              state.isAuthenticated = true;
            });
          } else {
            // If no user data, fetch from API
            try {
              const currentUser = await authService.getCurrentUser();
              await TokenService.saveUser(currentUser);

              set(state => {
                state.user = currentUser;
                state.isAuthenticated = true;
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
