import EventManager from 'EventManager';

export default interface CreatorContext {
  focusElement: HTMLElement | undefined;
  eventManager: EventManager | undefined;
}
