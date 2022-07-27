import React, { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

export const portalRootNode = (document.querySelector('#root') || document.body) as HTMLElement; // for tests

export interface PortalProps extends PropsWithChildren {
  portalNode?: HTMLElement;
}

const Portal: React.FC<PortalProps> = ({ children, portalNode = portalRootNode }) => createPortal(children, portalNode);

export default Portal;
