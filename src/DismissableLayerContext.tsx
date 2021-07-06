import React, { createContext, PropsWithChildren, ReactElement, useCallback, useContext, useEffect, useMemo } from 'react';

import GlobalLayersContext from './GlobalLayersContext';
import { useContextApi } from './hooks';
import Subscriber, { DismissEventHandler, DismissEventType } from './Subscriber';

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
  readonly removeHandler: (eventType: DismissEventType) => void;

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
  _subscriber: new Subscriber(document),

  rootNode: document,

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
  rootNode = document as T,
}: PropsWithChildren<{ rootNode?: T }>): ReactElement => {
  const parentLayer = useContext(DismissableLayerContext);
  const globalLayers = useContext(GlobalLayersContext);

  const subscriber = useMemo(() => new Subscriber(rootNode), [rootNode]);

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
    (eventType: DismissEventType) => {
      subscriber.unsubscribe(eventType);
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
    // eslint-disable-next-line no-underscore-dangle
    parentLayer?._subscriber.registerNestedSubscriber(subscriber);

    return () => {
      // eslint-disable-next-line no-underscore-dangle
      parentLayer?._subscriber.unregisterNestedSubscriber();
    };
  }, [subscriber, parentLayer]);

  const value = useContextApi<DismissableLayerValue<T>>({
    rootNode,
    _subscriber: subscriber,
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
