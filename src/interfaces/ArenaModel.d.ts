type ArenaLevel = string[];

interface ArenaNode<T extends Array<string>> {
  allowedLevels: keyof T,
  children: ArenaNode,
  howToRaise: {[key in keyof T]: boolean},
}

type ArenaModel<T> = {
  level: 0,
  allowedLevels: [],
  canRaise: false,
  children: []
};

export default ArenaModel;
