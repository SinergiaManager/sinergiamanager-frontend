import { apiClient } from '../apiClient';
import { User } from '../types';

export class AuthService {
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      return !this.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      /* const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return new Date(decodedToken.exp * 1000) < new Date(); */
      return false; // Temporaneamente disabilitato il controllo di scadenza
    } catch {
      return true;
    }
  }

  static getCurrentUser(): User | null {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch {
      return null;
    }
  }

  static getCurrentToken(): string | null {
    try {
      const token = localStorage.getItem('token');
      return token ? JSON.parse(token) : null;
    } catch {
      return null;
    }
  }

  static async login(email: string, password: string): Promise<User> {
    try {
      const response = await apiClient.post<{user: User, token: string}>('/auth/login', {
        email,
        password
      });
      
      const { user, token } = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  static hasRole(requiredRoles?: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    
    const user = this.getCurrentUser();
    if (!user) return false;
    
    return requiredRoles.includes(user.role);
  }
}