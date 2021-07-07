export type DismissEventHandler = (event?: Event) => void;

export type DismissEventType = 'click' | 'mousedown' | 'mouseup';

class Subscriber {
  private rootNode: HTMLElement | Document;

  private originalHandler: DismissEventHandler | null = null;

  private nestedSubscriber: Subscriber | null = null;

  private eventType: DismissEventType | null = null;

  constructor(rootNode: HTMLElement | Document) {
    this.rootNode = rootNode;
  }

  private handler: DismissEventHandler = (event): void => {
    if (!this.nestedSubscriber?.hasRootOrNestedHandler()) {
      this.originalHandler?.(event);
    }
  };

  protected hasRootOrNestedHandler(): boolean {
    return this.hasHandler() || !!this.nestedSubscriber?.hasRootOrNestedHandler();
  }

  hasHandler(): boolean {
    return !!this.originalHandler;
  }

  subscribe(eventType: DismissEventType, handler: DismissEventHandler): void {
    if (this.eventType) {
      this.forceHandle(); // to force close currently opened
      this.unsubscribe(this.eventType);
    }

    this.eventType = eventType;
    this.originalHandler = handler;

    this.rootNode.addEventListener(eventType, this.handler);
  }

  unsubscribe(eventType: DismissEventType, handler?: DismissEventHandler): void {
    if (!this.eventType || !this.originalHandler || this.eventType !== eventType || (handler && this.originalHandler !== handler)) {
      return;
    }

    this.eventType = null;
    this.originalHandler = null;
    this.rootNode.removeEventListener(eventType, this.handler);
  }

  forceHandle(): void {
    this.originalHandler?.();
    this.nestedSubscriber?.forceHandle();
  }

  registerNestedSubscriber(subscriber: Subscriber): void {
    this.nestedSubscriber = subscriber;
  }

  unregisterNestedSubscriber(): void {
    this.nestedSubscriber = null;
  }
}

export default Subscriber;
