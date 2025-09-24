import { apiClient } from '../apiClient';
import { ConfigurationStatus, ConfigurationFormData } from '../types';

export class ConfigurationService {
  static async checkConfiguration(): Promise<ConfigurationStatus> {
    try {
      const response = await apiClient.get<ConfigurationStatus>('/configs');
      return response.data;
    } catch (error) {
      console.error('Error checking configuration:', error);
      return { hasConfiguration: false };
    }
  }

  static async getConfiguration() {
    try {
      const response = await apiClient.get('/configuration');
      return response.data;
    } catch (error) {
      console.error('Error fetching configuration:', error);
      throw error;
    }
  }

  static async saveConfiguration(configData: ConfigurationFormData) {
    try {
      const response = await apiClient.post('/configs', configData);
      return response.data;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }
}