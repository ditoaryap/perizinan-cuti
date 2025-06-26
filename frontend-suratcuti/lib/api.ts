import Cookies from 'js-cookie';

export class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5004/api"

  private getHeaders() {
    // We no longer need to manually set the Authorization header
    // as the browser will send the auth cookie automatically.
    return {
      "Content-Type": "application/json",
    }
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      credentials: 'include', // Important: tells fetch to send cookies
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.message);
    }

    return response.json()
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      credentials: 'include', // Important: tells fetch to send cookies
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.message);
    }

    return response.json()
  }

  async put(endpoint: string, data?: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      credentials: 'include', // Important: tells fetch to send cookies
      headers: this.getHeaders(),
      ...(data && { body: JSON.stringify(data) }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.message);
    }

    return response.json()
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      credentials: 'include', // Important: tells fetch to send cookies
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.message);
    }

    return response.json()
  }

  async downloadPdf(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      credentials: 'include', // Important: tells fetch to send cookies
      headers: {
        // No longer need Authorization header here either
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.blob()
  }
}

export const api = new ApiClient()
