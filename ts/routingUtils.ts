import { AuthService } from './services/authService';
import { ConfigurationService } from './services/configurationService';

export enum RouteDestination {
  LOGIN = '/login',
  DASHBOARD = '/dashboard',
  CONFIGURATION = '/configuration'
}

export interface RoutingDecision {
  destination: RouteDestination;
  reason: string;
}

export class RoutingUtils {
  /**
   * Determina dove reindirizzare l'utente basandosi sullo stato di autenticazione e configurazione
   */
  static async determineRoute(): Promise<RoutingDecision> {
    try {
      // Controlla autenticazione
      const isLoggedIn = AuthService.isAuthenticated();
      
      // Controlla configurazione
      const configStatus = await ConfigurationService.checkConfiguration();
      const hasConfiguration = configStatus.hasConfiguration;

      // Logica di routing
      if (hasConfiguration) {
        if (isLoggedIn) {
          return {
            destination: RouteDestination.DASHBOARD,
            reason: 'User is logged in and configuration exists'
          };
        } else {
          return {
            destination: RouteDestination.LOGIN,
            reason: 'Configuration exists but user is not logged in'
          };
        }
      } else {
        if (isLoggedIn) {
          return {
            destination: RouteDestination.CONFIGURATION,
            reason: 'User is logged in but no configuration exists'
          };
        } else {
          return {
            destination: RouteDestination.LOGIN,
            reason: 'No configuration exists and user is not logged in'
          };
        }
      }
    } catch (error) {
      console.error('Error determining route:', error);
      return {
        destination: RouteDestination.LOGIN,
        reason: 'Error occurred during route determination, fallback to login'
      };
    }
  }

  static requiresAuth(path: string): boolean {
    const publicPaths = ['/login', '/forgot-password', '/reset-password', '/'];
    return !publicPaths.includes(path);
  }

  static requiresConfiguration(path: string): boolean {
    const configurationPaths = ['/dashboard', '/notifications'];
    return configurationPaths.includes(path);
  }
}