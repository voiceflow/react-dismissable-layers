import { RefObject, useCallback, useContext, useEffect } from 'react';

import DismissableLayerContext from './DismissableLayerContext.js';
import { useCache, useEnableDisable } from './hooks.js';
import type { DismissEventType } from './Subscriber.js';

interface Options {
  /**
   * ref for the popper content, to do not close on the content's [dismissEvent] action
   */
  ref?: RefObject<Element>;

  /**
   * callback which will be invoked when the popper is closed
   */
  onClose?: null | VoidFunction;

  /**
   * callback which will be invoked when the popper tries to close. If returns truthy, it prevents the close
   */
  preventClose?: null | ((event?: Event) => boolean);

  /**
   * event on which popper will be closed, default is `'click'`
   */
  dismissEvent?: DismissEventType;

  /**
   * the popper will be closed just by the [dismissEvent] action, without any layers logic, default is `false`
   */
  disableLayers?: boolean;

  /**
   * do not close on default prevented events, default is `true`
   */
  skipDefaultPrevented?: boolean;
}

type Api = readonly [
  isOpened: boolean,

  /**
   * function to toggle popper
   */
  toggle: VoidFunction,

  /**
   * function to force close popper
   */
  close: VoidFunction
];

const useDismissable = (
  defaultValue = false,
  { ref, onClose, dismissEvent = 'click', disableLayers = false, skipDefaultPrevented = true, preventClose }: Options = {}
  // eslint-disable-next-line sonarjs/cognitive-complexity
): Api => {
  const dismissableLayer = useContext(DismissableLayerContext);

  const [isOpened, setOpen, setClosed] = useEnableDisable(defaultValue);
  const cache = useCache({ isOpened, onClose, disableLayers, preventClose, skipDefaultPrevented });

  const handleOpen = useCallback(() => {
    if (cache.current.isOpened) return;

    if (!cache.current.disableLayers) {
      dismissableLayer.dismiss();
    }

    setOpen();
  }, [cache, setOpen, dismissableLayer]);

  const handleClose = useCallback(
    (event?: Event) => {
      const skipEvent =
        cache.current.preventClose?.(event) ||
        !cache.current.isOpened ||
        (cache.current.skipDefaultPrevented && event?.defaultPrevented) ||
        (event?.target && ref?.current?.contains?.(event.target as Element));

      if (skipEvent) {
        return;
      }

      setClosed();
      cache.current.onClose?.();
    },
    [ref, cache, setClosed]
  );

  const forceClose = useCallback(() => handleClose(), [handleClose]);

  const onToggle = isOpened ? forceClose : handleOpen;

  useEffect(() => {
    if (!isOpened) {
      return undefined;
    }

    const animationFrame = requestAnimationFrame(() => {
      if (!disableLayers) {
        dismissableLayer.addHandler(dismissEvent, handleClose);
      } else {
        dismissableLayer.rootNode.addEventListener(dismissEvent, handleClose);
      }
    });

    return () => {
      cancelAnimationFrame(animationFrame);

      requestAnimationFrame(() => {
        if (!disableLayers) {
          dismissableLayer.removeHandler(dismissEvent, handleClose);
        } else {
          dismissableLayer.rootNode.removeEventListener(dismissEvent, handleClose);
        }
      });
    };
  }, [isOpened, dismissEvent, handleClose, dismissableLayer, disableLayers]);

  return [isOpened, onToggle, forceClose];
};

export default useDismissable;
