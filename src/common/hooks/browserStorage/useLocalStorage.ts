//done
import { isNil } from "lodash";
import { useCallback, useEffect, useState } from "react";

import {
  ApiLatencies,
  ApiSettings,
  Cache,
  Exchanges,
  LatencyPreferences,
  Notification,
  Settings,
} from "../../types";

type Value =
  | string
  | string[]
  | number
  | boolean
  | JSON
  | Exchanges
  | Settings
  | Cache
  | undefined
  | Notification[]
  | ApiSettings
  | ApiLatencies
  | LatencyPreferences
  | null;

type Result = [Value, (value?: Value) => void];

export const useLocalStorage = (key: string): Result => {
  const localStorageItem =
    typeof window !== "undefined" ? localStorage.getItem(key) : "";
  const [value, setValue] = useState<Value>(
    localStorageItem && JSON.parse(localStorageItem)
  );

  const setUserItem = useCallback((key: string, value: Value) => {
    if (key.includes("_")) {
      if (!key.split("_").includes("")) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, []);

  useEffect(() => {
    if (!isNil(value) && value !== null && value !== "") {
      setUserItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }, [value, key]);

  return [value, setValue];
};
