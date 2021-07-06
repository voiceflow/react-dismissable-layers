import React, { createContext, FC, useCallback, useRef } from 'react';

import { useContextApi } from './hooks';

interface GlobalLayer {
  readonly dismiss: VoidFunction;

  readonly hasHandler: () => boolean;
}

interface GlobalLayersContextValue {
  readonly register: (globalLayer: GlobalLayer) => void;

  readonly dismissAll: VoidFunction;

  readonly unregister: (globalLayer: GlobalLayer) => void;

  readonly hasHandlers: () => boolean;
}

const GlobalLayersContext = createContext<GlobalLayersContextValue>({
  register: () => undefined,

  unregister: () => undefined,

  dismissAll: () => undefined,

  hasHandlers: () => false,
});

export const GlobalLayersProvider: FC = ({ children }) => {
  // we really don't want to use state here to escape unnecessary rerenders
  const layersRefs = useRef<GlobalLayer[]>([]);

  const dismissAll = useCallback(() => {
    // to close deepest ones first
    Array.from(layersRefs.current)
      .reverse()
      .forEach((globalLayer) => globalLayer.dismiss());
  }, []);

  const hasHandlers = useCallback(() => {
    return layersRefs.current.some((globalLayer) => globalLayer.hasHandler());
  }, []);

  const register = useCallback((globalLayer: GlobalLayer) => {
    layersRefs.current.push(globalLayer);
  }, []);

  const unregister = useCallback((globalLayer: GlobalLayer) => {
    layersRefs.current = layersRefs.current.filter((layer) => layer !== globalLayer);
  }, []);

  const api = useContextApi({
    register,
    unregister,
    dismissAll,
    hasHandlers,
  });

  return <GlobalLayersContext.Provider value={api}>{children}</GlobalLayersContext.Provider>;
};

export default GlobalLayersContext;
