const formations = {
  b: [
    {
      start: 0,
      end: 3,
    },
    {
      start: 6,
      end: 8,
    },
  ],
  i: [
    {
      start: 2,
      end: 6,
    },
    {
      start: 7,
      end: 9,
    },
  ],
};

const rootNodes = [{
  name: '',
  start: 0,
  end: 9,
  children: [],
}];

// nodes = [{b,1,10},{b,12,18}]
const insertInNodes = (
  nodes,
  name,
  interval,
) => {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.start >= interval.end) {
      break;
    }
    if (interval.start < node.end && interval.end > node.start) {
      if (node.name === '') {
        const newNodes = [];
        if (node.start < interval.start) {
          newNodes.push({
            name: '',
            start: node.start,
            end: interval.start,
            children: [],
          });
        }
        newNodes.push({
          name,
          start: Math.max(node.start, interval.start),
          end: Math.min(node.end, interval.end),
          children: [{
            name: '',
            start: Math.max(node.start, interval.start),
            end: Math.min(node.end, interval.end),
            children: [],
          }],
        });
        if (node.end > interval.end) {
          newNodes.push({
            name: '',
            start: interval.end,
            end: node.end,
            children: [],
          });
        }
        nodes.splice(i, 1, ...newNodes);
        i += newNodes - 1;
      } else {
        insertInNodes(node.children, name, interval);
      }
    }
  }
};

Object.entries(formations).forEach(([name, intervals]) => {
  intervals.forEach((interval) => {
    insertInNodes(
      rootNodes,
      name,
      interval,
    );
  });
});

console.log(JSON.stringify(rootNodes));

const getHtml = (nodes) => {
  let text = '';
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.name === '') {
      text += node.start + '-' + node.end;
    } else {
      text += '<' + node.name + '>' + getHtml(node.children) + '</' + node.name + '>';
    }
  }
  return text;
}

const html = getHtml(rootNodes);

console.log(html);
