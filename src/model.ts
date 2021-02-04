const a = {
  type: 'root',
  level: 'pLevel',
  children: [
    {
      type: 'header',
      tag: 'h2',
      children: [
        {
          type: 'text',
          value: 'Простой визуальный редактор',
        }
      ],
    },
    {
      type: 'paragraph',
      tag: 'p',
      children: [
        {
          type: 'text',
          value: 'Textarena адаптирована для быстрой работы. Все функции доступны с помощью горячих клавиш.',
        }
      ],
      formating: {
        strong: {
          intervals: [
            {
              start: 0,
              end: 9,
            }
          ]
        },
        em: [
          {
            start: 10,
            end: 22,
          }
        ]
      },
    }
  ]
};

const levels = {
  sectionLevel: {
    parents: [
      'root',
    ],
    children: [
      'p',
    ],
  },
  pLevel: {
    parents: [
      'section',
    ],
    children: [
      'text',
    ],
  },
  textLevel: {
    parents: [
      'p',
      'h2',
    ],
    children: [
    ],
  },
  ulLevel: {
    parents: [
     'section',
    ],
    children: [
      'li',
    ],
  },
  liLevel: {
    parents: [
      'ul',
    ],
    children: [
      'text',
    ],
  },
};

const tags1 = {
  paragraph: {
    allowedTag: [
      'p',
    ],
    preferedTag: 'p',
    level: 'pLevel',
    allowFormating: true,
  },
  header: {
    allowedTag: [
      'h2',
      'h3',
      'h4',
      'h5',
    ],
    preferedTag: 'd',
    level: 'pLevel',
    allowFormating: false,
  },
  formating: {
    allowedTag: {
      b: [],
      strong: [],
      em: [],
      i: [],
      span: ['style="font-weigh:bold"'],
    },
    isFormating: true,
  }
};

const formatings = {
  strong: {
    allowedTag: [
      'strong',
      'b',
    ],
    preferedTag: 'strong',
    level: 'text',
  }
};

const arenas = [
  {
    name: 'paragraph',
    tag: 'P',
    attributes: [],
  },
  {
    name: 'paragraph',
    tag: 'P',
    attributes: [],
  },
];

const tags = {
  P: [
    {
      arena: 'pargraph',
      attributes: [],
    },
  ],
  H2: [
    {
      arena: 'pargraph',
      attributes: [],
    },
  ],
};