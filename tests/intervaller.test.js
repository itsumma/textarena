import Intervaler from '../src/Intervaler';

test('simple add', () => {
  const i = new Intervaler();
  i.addInterval(0, 9);
  expect(i.getIntervals()).toEqual([{ start: 0, end: 9 }]);
});

test('{0, 9} + {11, 15}', () => {
  const i = new Intervaler();
  i.addInterval(0, 9);
  i.addInterval(11, 15);
  expect(i.getIntervals()).toEqual([{ start: 0, end: 9 }, { start: 11, end: 15 }]);
});

test('{11, 11}', () => {
  const i = new Intervaler();
  i.addInterval(11, 11);
  expect(i.getIntervals()).toEqual([{ start: 11, end: 11 }]);
});

test('{0, 3} + {5, 9}', () => {
  const i = new Intervaler();
  i.addInterval(0, 3);
  i.addInterval(5, 9);
  expect(i.getIntervals()).toEqual([{ start: 0, end: 3 }, { start: 5, end: 9 }]);
});

test('{5, 8} + {3, 5} + {3, 9} + {7, 8} + {7, 9}', () => {
  const i = new Intervaler();
  i.addInterval(5, 8);
  i.addInterval(3, 5);
  i.addInterval(3, 9);
  i.addInterval(7, 8);
  i.addInterval(7, 9);
  expect(i.getIntervals()).toEqual([{ start: 3, end: 9 }]);
});

test('{6, 9} + {8, 11} + {10, 12}', () => {
  const i = new Intervaler();
  i.addInterval(6, 9);
  i.addInterval(8, 11);
  i.addInterval(10, 12);
  expect(i.getIntervals()).toEqual([{ start: 6, end: 12 }]);
});

test('simple cut', () => {
  const i = new Intervaler();
  i.addInterval(1, 9);
  i.cut(3, 6);
  expect(i.getIntervals()).toEqual([{ start: 1, end: 3 }, { start: 6, end: 9 }]);
});

test('cut from empty interval', () => {
    const i = new Intervaler();
    i.cut(11, 11);
    expect(i.getIntervals()).toEqual([]);
});

test('{1, 3} - {5, 6}', () => {
  const i = new Intervaler();
  i.addInterval(1, 3);
  i.cut(5, 6);
  expect(i.getIntervals()).toEqual([{ start: 1, end: 3 }]);
});

test('{2, 5} - {1, 4}', () => {
  const i = new Intervaler();
  i.addInterval(2, 5);
  i.cut(1, 4);
  expect(i.getIntervals()).toEqual([{ start: 4, end: 5 }]);
});

test('{2, 5} - {4, 7}', () => {
  const i = new Intervaler();
  i.addInterval(2, 5);
  i.cut(4, 7);
  expect(i.getIntervals()).toEqual([{ start: 2, end: 4 }]);
});

test('{2, 5} - {4, 7} - {1, 3}', () => {
  const i = new Intervaler();
  i.addInterval(2, 5);
  i.cut(4, 7);
  i.cut(1, 3);
  expect(i.getIntervals()).toEqual([{ start: 3, end: 4 }]);
});
test('{2, 5} - {2, 5}', () => {
  const i = new Intervaler();
  i.addInterval(2, 5);
  i.cut(2, 5);
  expect(i.getIntervals()).toEqual([]);
});
test('{2, 5} - {2, 4}', () => {
  const i = new Intervaler();
  i.addInterval(2, 5);
  i.cut(2, 4);
  expect(i.getIntervals()).toEqual([{ start: 4, end: 5 }]);
});
test('simple shift', () => {
  const i = new Intervaler();
  i.addInterval(2, 5);
  i.shift(3, 1);
  expect(i.getIntervals()).toEqual([{ start: 2, end: 6 }]);
});
test('simple merge', () => {
  const i = new Intervaler();
  i.addInterval(2, 5);
  i.addInterval(7, 10);
  i.merge(i, 5);
  expect(i.getIntervals()).toEqual([
    { start: 2, end: 5 },
    { start: 7, end: 10 },
    { start: 12, end: 15 },
  ]);
});

test('hasInterval check', () => {
  const i = new Intervaler();
  i.addInterval(2, 5);
  expect(i.hasInterval(3, 1)).toBe(true);
  expect(i.hasInterval(10, 11)).toBe(false);
  expect(i.hasInterval(5, 10)).toBe(false);
});
