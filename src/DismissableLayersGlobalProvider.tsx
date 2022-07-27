import React, { FC, PropsWithChildren } from 'react';

import { DismissableLayerProvider } from './DismissableLayerContext.js';
import { GlobalLayersProvider } from './GlobalLayersContext.js';

interface DismissableLayersGlobalProviderProps extends PropsWithChildren {
  /**
   * optional prop, the HTML-node to listen close events, default is `document`
   */
  rootNode?: HTMLElement | Document;
}

const DismissableLayersGlobalProvider: FC<DismissableLayersGlobalProviderProps> = ({ rootNode = globalThis.document, children }) => (
  <GlobalLayersProvider>
    <DismissableLayerProvider rootNode={rootNode}>{children}</DismissableLayerProvider>
  </GlobalLayersProvider>
);

export default DismissableLayersGlobalProvider;
