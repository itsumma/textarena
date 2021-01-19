import ArenaParser from 'ArenaParser';
import EventManager from 'EventManager';

export default interface CreatorContext {
  focusElement: Element | undefined;
  eventManager: EventManager | undefined;
  parser: ArenaParser;
}
