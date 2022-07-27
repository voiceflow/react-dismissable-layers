import { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';

export const useEnableDisable = (defaultValue = false): [boolean, VoidFunction, VoidFunction] => {
  const [value, toggleValue] = useState(defaultValue);

  const onEnable = useCallback(() => toggleValue(true), []);
  const onDisable = useCallback(() => toggleValue(false), []);

  return [value, onEnable, onDisable];
};

export const useCache = <T extends object>(defaultData: T, dataToUpdate: Partial<T> = defaultData): MutableRefObject<T> => {
  const cache = useRef(defaultData);

  Object.assign(cache.current, dataToUpdate);

  return cache;
};

export const useContextApi = <T extends object>(api: T): T => useMemo(() => api, Object.values(api));
