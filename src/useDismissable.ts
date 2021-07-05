import { useContext, useCallback, useEffect, RefObject } from 'react';

import { DismissEventType } from './Subscriber';
import DismissableLayerContext from './DismissableLayerContext';
import { useCache, useEnableDisable } from './hooks';

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
]

const useDismissable = (
  defaultValue = false,
  {
    ref,
    onClose,
    dismissEvent = 'click',
    disableLayers = false,
    skipDefaultPrevented = true,
  }: Options = {}
): Api => {
  const dismissableLayer = useContext(DismissableLayerContext);

  const [isOpened, setOpen, setClosed] = useEnableDisable(defaultValue);
  const cache = useCache({ isOpened, onClose, skipDefaultPrevented });

  const handleOpen = useCallback(() => {
    if (cache.current.isOpened) return;

    cache.current.isOpened = true;
    dismissableLayer.dismiss();
    setOpen();
  }, [cache, setOpen, dismissableLayer]);

  const handleClose = useCallback(
    (event?: Event) => {
      if (!cache.current.isOpened) return;
      if (cache.current.skipDefaultPrevented && event?.defaultPrevented) return;
      if (event?.target && ref?.current?.contains?.(event.target as Element)) return;

      cache.current.isOpened = false;
      setClosed();
      cache.current.onClose?.();
    },
    [ref, cache, setClosed]
  );

  const forceClose = useCallback(() => handleClose(), [handleClose]);

  const onToggle = isOpened ? forceClose : handleOpen;

  useEffect(() => {
    if (isOpened) {
      if (!disableLayers) {
        dismissableLayer.addHandler(dismissEvent, handleClose);
      } else {
        dismissableLayer.rootNode.addEventListener(dismissEvent, handleClose);
      }

      return () => {
        if (!disableLayers) {
          dismissableLayer.removeHandler(dismissEvent);
        } else {
          dismissableLayer.rootNode.removeEventListener(dismissEvent, handleClose);
        }
      };
    }

    return undefined;
  }, [isOpened, dismissEvent, handleClose, dismissableLayer, disableLayers]);

  return [isOpened, onToggle, handleClose];
}

export default useDismissable
