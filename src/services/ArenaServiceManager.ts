import Textarena from 'Textarena';
import ArenaBrowser from 'services/ArenaBrowser';
import ArenaCommandManager from 'services/ArenaCommandManager';
import ArenaLogger from 'services/ArenaLogger';
import ArenaModel from 'services/ArenaModel';
import ArenaParser from 'services/ArenaParser';
import ArenaView from 'services/ArenaView';
import CreatorBar from 'services/CreatorBar';
import EventManager from 'services/EventManager';
import Toolbar from 'services/Toolbar';

export default class ArenaServiceManager {
  public logger: ArenaLogger;

  public eventManager: EventManager;

  public browser: ArenaBrowser;

  public view: ArenaView;

  public commandManager: ArenaCommandManager;

  public parser: ArenaParser;

  public model: ArenaModel;

  public toolbar: Toolbar;

  public creatorBar: CreatorBar;

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
  }
}
