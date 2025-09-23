import { apiClient } from '../apiClient';
import { ConfigurationStatus, ConfigurationFormData } from '../types';

export class ConfigurationService {
  /**
   * Controlla se esiste una configurazione nel sistema
   */
  static async checkConfiguration(): Promise<ConfigurationStatus> {
    try {
      const response = await apiClient.get<ConfigurationStatus>('/configuration/check');
      return response.data;
    } catch (error) {
      console.error('Error checking configuration:', error);
      // In caso di errore, assumiamo che non ci sia configurazione
      return { hasConfiguration: false };
    }
  }

  /**
   * Ottiene la configurazione completa (richiede autenticazione)
   */
  static async getConfiguration() {
    try {
      const response = await apiClient.get('/configuration');
      return response.data;
    } catch (error) {
      console.error('Error fetching configuration:', error);
      throw error;
    }
  }

  /**
   * Salva una nuova configurazione (richiede autenticazione)
   */
  static async saveConfiguration(configData: ConfigurationFormData) {
    try {
      const response = await apiClient.post('/configuration', configData);
      return response.data;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }
}