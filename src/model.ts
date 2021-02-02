const a = {
  type: 'root',
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

const tags = {
  paragraph: {
    allowedTag: [
      'p'
    ],
    preferedTag: 'p',
    level: 'p',
  },
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