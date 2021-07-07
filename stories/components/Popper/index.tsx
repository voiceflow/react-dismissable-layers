import React from 'react';
import { Manager, Modifier, Popper as ReactPopper, PopperProps as ReactPopperProps, Reference } from 'react-popper';

import { DismissableLayerProvider, useDismissable } from '../../../src';
import Portal, { portalRootNode } from '../Portal';
import { Body, Container } from './components';

export { Content as PopperContent, Footer as PopperFooter } from './components';

interface RendererProps {
  onClose: () => void;
  isOpened: boolean;
  onToggle: () => void;
}

interface ChildrenProps extends RendererProps {
  ref: React.Ref<any>;
}

export interface PopperProps<M> {
  width?: string;
  height?: string;
  opened?: boolean;
  onClose?: () => void;
  children: (props: ChildrenProps) => React.ReactNode;
  modifiers?: ReactPopperProps<M>['modifiers'];
  placement?: ReactPopperProps<M>['placement'];
  portalNode?: HTMLElement;
  renderFooter?: (props: RendererProps) => React.ReactNode;
  renderContent: (props: RendererProps) => React.ReactNode;
  preventOverflowPadding?: number;
}

const Popper = <M,>({
  width,
  height,
  opened,
  onClose,
  children,
  modifiers,
  placement = 'bottom',
  portalNode = portalRootNode,
  renderFooter,
  renderContent,
  preventOverflowPadding = 8,
}: PopperProps<M>): React.ReactElement => {
  const initializedRef = React.useRef(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const [isOpened, onToggle, onForceClose] = useDismissable(opened, { ref: containerRef, onClose });

  React.useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;

      return;
    }

    if ((opened && !isOpened) || (!opened && isOpened)) {
      onToggle();
    }
  }, [opened]);

  const rendererProps = { onClose: onForceClose, isOpened, onToggle };

  return (
    <Manager>
      <Reference>{({ ref }) => children({ ...rendererProps, ref })}</Reference>

      {isOpened && (
        <DismissableLayerProvider>
          <Portal portalNode={portalNode}>
            <ReactPopper
              innerRef={containerRef}
              strategy="fixed"
              placement={placement}
              modifiers={
                [
                  { name: 'offset', options: { offset: [0, 5] } },
                  { name: 'preventOverflow', options: { boundary: portalNode, padding: preventOverflowPadding } },
                  ...(modifiers || []),
                ] as Modifier<M>[]
              }
            >
              {({ ref, style }) => (
                <div ref={ref} style={{ ...style, zIndex: 1000 }}>
                  <Container style={{ width, height }}>
                    <Body>
                      {renderContent(rendererProps)}

                      {renderFooter?.(rendererProps)}
                    </Body>
                  </Container>
                </div>
              )}
            </ReactPopper>
          </Portal>
        </DismissableLayerProvider>
      )}
    </Manager>
  );
};

export default Popper;
