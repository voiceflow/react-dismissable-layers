import React from 'react';
import { Manager, Modifier, Popper as ReactPopper, PopperProps as ReactPopperProps, Reference } from 'react-popper';

import { DismissableLayerProvider, useDismissable } from '../../../src/index.js';
import Portal, { portalRootNode } from '../Portal/index.js';
import { Body, Container, Content, Footer } from './components/index.js';

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
  offset?: number;
  onClose?: VoidFunction;
  children: (props: ChildrenProps) => React.ReactNode;
  modifiers?: ReactPopperProps<M>['modifiers'];
  placement?: ReactPopperProps<M>['placement'];
  portalNode?: HTMLElement;
  preventClose?: null | ((event?: Event) => boolean);
  renderFooter?: (props: RendererProps) => React.ReactNode;
  renderContent: (props: RendererProps) => React.ReactNode;
  preventOverflowPadding?: number;
}

const Popper = <M,>({
  width,
  height,
  offset = 5,
  opened,
  onClose,
  children,
  modifiers,
  placement = 'right',
  portalNode = portalRootNode,
  preventClose,
  renderFooter,
  renderContent,
  preventOverflowPadding = 8,
}: PopperProps<M>): React.ReactElement => {
  const initializedRef = React.useRef(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const [isOpened, onToggle, onForceClose] = useDismissable(opened, { ref: containerRef, onClose, preventClose });

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
                  { name: 'offset', options: { offset: [offset, offset] } },
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

export default Object.assign(Popper, { Content, Footer });
