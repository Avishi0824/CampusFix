import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  CURRENT_USER: '@campusfix_current_user',
  COMPLAINTS_DATA: '@campusfix_complaints_data',
  STAFF_DATA: '@campusfix_staff_data',
  INITIALIZED: '@campusfix_initialized_v1',
};

export const Storage = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        return JSON.parse(data) as T;
      }
      return defaultValue;
    } catch (e) {
      console.warn(`[Storage] Error reading key ${key}:`, e);
      return defaultValue;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[Storage] Error writing key ${key}:`, e);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[Storage] Error removing key ${key}:`, e);
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (e) {
      console.warn('[Storage] Error clearing storage:', e);
      return false;
    }
  },
};
