<div align="center">
  <h1>
    <br/>
    @voiceflow/react-dismissable-layers
    <br />
    <br />
  </h1>

  <sup>
    <a href="https://www.npmjs.com/package/@voiceflow/react-dismissable-layers">
       <img src="https://img.shields.io/npm/v/@voiceflow/react-dismissable-layers.svg" alt="npm package" />
    </a>
    <a href="https://circleci.com/gh/voiceflow/react-dismissable-layers">
      <img src="https://img.shields.io/circleci/project/github/voiceflow/react-dismissable-layers/master.svg" alt="CircleCI master" />
    </a>
    <a href="https://www.npmjs.com/package/@voiceflow/react-dismissable-layers">
      <img src="https://img.shields.io/npm/dm/@voiceflow/react-dismissable-layers.svg" alt="npm downloads" />
    </a>
    <a href="http://voiceflow.github.io/react-dismissable-layers">
      <img src="https://img.shields.io/badge/demos-🚀-lightblue.svg" alt="demos" />
    </a>
  </sup>

  <br />
  <br />

> Context and hook to add support of nested and auto-dismissable layers. Nested layers are closing first, parent layer won't be closed until nested is opened. Best to use with [react-popper](https://github.com/popperjs/react-popper).

  <br />

  <pre>npm i <a href="https://www.npmjs.com/package/@voiceflow/react-dismissable-layers">@voiceflow/react-dismissable-layers</a></pre>
</div>
<br />

## API

- `DismissableLayersProvider` - global provider for Dismissable Layers, wrap the whole app to make the `useDismissable` hook works with layers.

  ```typescript
    interface DismissableLayersProviderProps {
      /**
       * optional prop, the HTML-node to listen close events, default is `document`
      */
      rootNode?: HTMLElement | Document;
    }

    const DismissableLayersProvider = React.FC<DismissableLayersProviderProps>
  ```

<br/>

- `useDismissable` - a hook to toggle and dismiss poppers.

  ```typescript
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

    const useDismissable = (defaultValue = false, options: Options = {}) => Api;
  ```

<br />

- `DismissableLayerContext` - a context to read dissmissable layer, in most cases shouldn't be used in app layer.

  ```typescript
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

    const DismissableLayersProvider = React.FC<DismissableLayersProviderProps>
  ```

<br />

- `DismissableLayerProvider` - provider for Dismissable Layer, wrap the popper content to make the nested poppers works as a nested ones.

  ```typescript
    interface DismissableLayerProviderProps {
      /**
       * optional prop, the HTML-node to listen close events, default is `document`
      */
      rootNode?: HTMLElement | Document;
    }

    const DismissableLayerProvider = React.FC<DismissableLayerProviderProps>
  ```

<br/>
