import { LoginCredentials } from 'src/models/login-credentials';

export type SimpleStorageKey = 'token';
export type ObjectStorageKey = {
  'login-credentials': LoginCredentials;
};

export class LocalStorage {
  static setValue(key: SimpleStorageKey, value: string) {
    window.localStorage.setItem(key, value);
  }

  static getValue(key: SimpleStorageKey): string | null {
    return window.localStorage.getItem(key);
  }

  static setObjectValue<TKey extends keyof ObjectStorageKey>(
    key: TKey,
    value: ObjectStorageKey[TKey]
  ) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  static getObjectValue<TKey extends keyof ObjectStorageKey>(
    key: keyof ObjectStorageKey
  ): ObjectStorageKey[TKey] | null {
    const data = window.localStorage.getItem(key);
    if (data !== null) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  static clearValue(key: SimpleStorageKey | keyof ObjectStorageKey) {
    window.localStorage.removeItem(key)
  }
}
