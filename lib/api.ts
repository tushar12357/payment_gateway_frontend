const API_BASE_URL ='https://payment-gateway-7a7f.onrender.com';
// const API_BASE_URL ='http://localhost:3000';
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(
  endpoint: string,
  body?: any,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  return this.request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
}


  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export const authApi = {
  sendOtp: (phone: string) =>
    apiClient.post("/api/auth/send-otp", { phone }),

  verifyOtp: (phone: string, otp: string) =>
    apiClient.post<{ token: string; user: any }>(
      "/api/auth/verify-otp",
      { phone, otp }
    ),

  sendEmailOtp: (email: string) =>
    apiClient.post("/api/auth/send-email-otp", { email }),

  verifyEmailOtp: (email: string, otp: string) =>
    apiClient.post<{ token: string; user: any }>(
      "/api/auth/verify-email-otp",
      { email, otp }
    ),
    register: async (email: string, password: string) => {
  const res = await apiClient.post("/api/auth/register", { email, password });
  return res.data;
},
    login: async (email: string, password: string) => {
  const res = await apiClient.post("/api/auth/login", { email, password });
  return res.data;
},

};


export const walletApi = {
  getBalance: () =>
    apiClient.get<{ balance: number }>('/api/wallet/balance'),
   getTransactions: (params?: any) =>
    apiClient.get('/api/wallet/transactions', { params }),

  topup: (amount: number) =>
    apiClient.post<{ orderId: string; amount: number }>('/api/wallet/topup', { amount }),

  transfer: (toPhone: string, amount: number, note?: string) =>
    apiClient.post('/api/wallet/transfer', { toPhone, amount, note }),
};

export const merchantApi = {
  create: (data: { name: string; email: string; website?: string }) =>
    apiClient.post('/api/merchants', data),
  getAll: () => apiClient.get("/api/merchants/"),
};
export const pgApi = {
  createOrder: (
    data: {
      orderId: string;
      amount: number;
    },
    config: {
      headers: {
        'x-api-key': string;
        'x-signature': string;
        'idempotency-key': string;
      };
    }
  ) => {
    return apiClient.post('/api/pg/orders', data, config);
  },
};
