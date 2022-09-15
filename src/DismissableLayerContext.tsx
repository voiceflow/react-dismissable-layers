import React, { createContext, PropsWithChildren, ReactElement, useCallback, useContext, useEffect, useMemo } from 'react';

import GlobalLayersContext from './GlobalLayersContext.js';
import { useContextApi } from './hooks.js';
import Subscriber, { DismissEventHandler } from './Subscriber.js';
import type { DismissEventType } from './Subscriber.js';

interface DismissableLayerValue<T extends HTMLElement | Document = Document> {
  /**
   * for internal usage only
   */
  readonly _subscriber: Subscriber;

  /**
   * root node of the dismiss layer
   */
  readonly rootNode: T;

  /**
   * dismiss currently opened in the current layer
   */
  readonly dismiss: VoidFunction;

  /**
   * has handler on the current layer
   */
  readonly hasHandler: () => boolean;

  /**
   * add close handler to the current layer
   */
  readonly addHandler: (eventType: DismissEventType, handler: DismissEventHandler) => void;

  /**
   * remove close handler from the current layer
   */
  readonly removeHandler: (eventType: DismissEventType, handler: DismissEventHandler) => void;

  /**
   * dismiss all on all layers
   */
  readonly dismissAllGlobally: VoidFunction;

  /**
   * has subscriber on any layer
   */
  readonly hasHandlersGlobally: () => boolean;
}

const DismissableLayerContext = createContext<DismissableLayerValue<HTMLElement | Document>>({
  _subscriber: new Subscriber(globalThis.document),

  rootNode: globalThis.document,

  dismiss: () => undefined,

  hasHandler: () => false,

  addHandler: () => undefined,

  removeHandler: () => undefined,

  dismissAllGlobally: () => undefined,

  hasHandlersGlobally: () => false,
});

export const { Consumer: DismissableLayerConsumer } = DismissableLayerContext;

export const DismissableLayerProvider = <T extends HTMLElement | Document = Document>({
  children,
  rootNode,
}: PropsWithChildren<{ rootNode?: T }>): ReactElement => {
  const parentLayer = useContext(DismissableLayerContext);
  const globalLayers = useContext(GlobalLayersContext);

  const localRootNode = rootNode ?? parentLayer.rootNode;

  const subscriber = useMemo(() => new Subscriber(localRootNode), [localRootNode]);

  const dismiss = useCallback(() => {
    subscriber.forceHandle();
  }, [subscriber]);

  const hasHandler = useCallback(() => {
    return subscriber.hasHandler();
  }, [subscriber]);

  const addHandler = useCallback(
    (eventType: DismissEventType, handler: DismissEventHandler) => {
      subscriber.subscribe(eventType, handler);
    },
    [subscriber]
  );

  const removeHandler = useCallback(
    (eventType: DismissEventType, handler: DismissEventHandler) => {
      subscriber.unsubscribe(eventType, handler);
    },
    [subscriber]
  );

  useEffect(() => {
    const globalLayer = { dismiss, hasHandler };

    globalLayers.register(globalLayer);

    return () => {
      globalLayers.unregister(globalLayer);
    };
  }, [dismiss, hasHandler, globalLayers]);

  useEffect(() => {
    parentLayer?._subscriber.registerNestedSubscriber(subscriber);

    return () => {
      parentLayer?._subscriber.unregisterNestedSubscriber();
    };
  }, [subscriber, parentLayer]);

  const value = useContextApi<DismissableLayerValue<T>>({
    _subscriber: subscriber,
    rootNode: localRootNode as T,
    dismiss,
    hasHandler,
    addHandler,
    removeHandler,
    dismissAllGlobally: globalLayers.dismissAll,
    hasHandlersGlobally: globalLayers.hasHandlers,
  });

  return <DismissableLayerContext.Provider value={value}>{children}</DismissableLayerContext.Provider>;
};

export default DismissableLayerContext;
