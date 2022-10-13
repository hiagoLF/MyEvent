import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setOnStorage(key: string, value: string) {
  console.log('Colocando no async storage >>> ', value);
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    return false;
  }
}

export async function getFromStorage(key: string) {
  return await AsyncStorage.getItem(key);
}

export async function getTokenFromStorage() {
  return await getFromStorage('@MyEventToken');
}
