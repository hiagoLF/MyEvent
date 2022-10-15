import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setOnStorage(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    return false;
  }
}

export async function getFromStorage(key: string) {
  return await AsyncStorage.getItem(key);
}

export async function deleteOnStorage(key: string) {
  return await AsyncStorage.removeItem(key);
}

export async function getTokenFromStorage() {
  return await getFromStorage('@MyEventToken');
}
