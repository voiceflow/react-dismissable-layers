import React, { FC } from 'react';

import { DismissableLayerProvider } from './DismissableLayerContext';
import { GlobalLayersProvider } from './GlobalLayersContext';

interface DismissableLayersGlobalProviderProps {
  /**
   * optional prop, the HTML-node to listen close events, default is `document`
   */
  rootNode?: HTMLElement | Document;
}

const DismissableLayersGlobalProvider: FC<DismissableLayersGlobalProviderProps> = ({ rootNode = window.document, children }) => (
  <GlobalLayersProvider>
    <DismissableLayerProvider rootNode={rootNode}>{children}</DismissableLayerProvider>
  </GlobalLayersProvider>
);

export default DismissableLayersGlobalProvider;
