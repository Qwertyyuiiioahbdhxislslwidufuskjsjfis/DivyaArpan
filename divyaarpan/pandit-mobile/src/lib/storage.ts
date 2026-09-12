import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export async function storageGetItem(
  key: string
): Promise<string | null> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

export async function storageSetItem(
  key: string,
  value: string
): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

export async function storageDeleteItem(
  key: string
): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}
