import Textarena from '../Textarena';
import { ArenaBrowser } from './ArenaBrowser';
import { ArenaCommandManager } from './ArenaCommandManager';
import { ArenaHistory } from './ArenaHistory';
import { ArenaLogger } from './ArenaLogger';
import { ArenaMiddlewareManager } from './ArenaMiddlewareManager';
import { ArenaModel } from './ArenaModel';
import { ArenaParser } from './ArenaParser';
import { ArenaView } from './ArenaView';
import { CreatorBar } from './CreatorBar';
import { EventManager } from './EventManager';
import { SymbolCounter } from './SymbolCounter';
import { Toolbar } from './Toolbar';

export class ArenaServiceManager {
  public logger: ArenaLogger;

  public eventManager: EventManager;

  public browser: ArenaBrowser;

  public view: ArenaView;

  public commandManager: ArenaCommandManager;

  public parser: ArenaParser;

  public model: ArenaModel;

  public toolbar: Toolbar;

  public creatorBar: CreatorBar;

  public history: ArenaHistory;

  public counter: SymbolCounter;

  public middlewares: ArenaMiddlewareManager;

  constructor(public textarena: Textarena) {
    this.eventManager = new EventManager(this);
    this.logger = new ArenaLogger();
    this.parser = new ArenaParser(this);
    this.model = new ArenaModel(this);
    this.browser = new ArenaBrowser(this);
    this.view = new ArenaView(this);
    this.commandManager = new ArenaCommandManager(this);
    this.toolbar = new Toolbar(this);
    this.creatorBar = new CreatorBar(this);
    this.history = new ArenaHistory(this);
    this.counter = new SymbolCounter(this);
    this.middlewares = new ArenaMiddlewareManager(this);
  }
}
