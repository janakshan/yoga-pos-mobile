import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {ENV} from '@config/env';
import {TokenService} from '@services/TokenService';
import {ApiError, ApiResponse} from '@types/api.types';

/**
 * API Client
 * Configured Axios instance with interceptors for authentication and error handling
 */

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: ENV.API_BASE_URL,
      timeout: ENV.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await TokenService.getAccessToken();

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Exclude login and refresh endpoints from retry
          const isAuthEndpoint =
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/refresh');

          if (isAuthEndpoint) {
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({resolve, reject});
            })
              .then(() => {
                return this.client(originalRequest);
              })
              .catch(err => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await TokenService.getRefreshToken();

            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Call refresh token endpoint
            const response = await this.client.post('/auth/refresh', {
              refreshToken,
            });

            const {token, refreshToken: newRefreshToken} = response.data;

            // Save new tokens
            await TokenService.saveTokens(token, newRefreshToken);

            // Process queued requests
            this.failedQueue.forEach(({resolve}) => {
              resolve();
            });
            this.failedQueue = [];

            // Retry original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.failedQueue.forEach(({reject}) => {
              reject(refreshError);
            });
            this.failedQueue = [];

            await TokenService.clearTokens();

            // Note: Navigation to login screen should be handled by the app
            // You can emit an event or use a callback here

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.handleError(error));
      },
    );
  }

  private handleError(error: AxiosError<ApiError>): ApiError {
    if (error.response) {
      // Server responded with error
      return {
        success: false,
        message: error.response.data?.message || 'An error occurred',
        code: error.response.data?.code || 'SERVER_ERROR',
        details: error.response.data?.details,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  // HTTP Methods
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Get raw axios instance for special cases
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
