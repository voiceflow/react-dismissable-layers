import { createPortal } from 'react-dom';

export const portalRootNode = (document.querySelector('#root') || document.body) as HTMLElement; // for tests

export type PortalProps = {
  portalNode?: HTMLElement;
};

const Portal: React.FC<PortalProps> = ({ children, portalNode = portalRootNode }) => createPortal(children, portalNode);

export default Portal;
