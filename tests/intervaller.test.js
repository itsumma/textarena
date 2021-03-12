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

test('{5, 9} + {1, 6}', () => {
  const i = new Intervaler();
  i.addInterval(5, 9);
  i.addInterval(1, 6);
  expect(i.getIntervals()).toEqual([{ start: 1, end: 9 }]);
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

test('cut from empty interval', () => {
  const i = new Intervaler();
  const result = i.cut(11, 11);
  expect(result.getIntervals()).toEqual([]);
  expect(i.getIntervals()).toEqual([]);
});

test('[1-4] cut [2-3]', () => {
  const i = new Intervaler();
  i.addInterval(1, 4);
  const result = i.cut(2, 3);
  expect(result.getIntervals()).toEqual([{ start: 0, end: 1 }]);
  expect(i.getIntervals()).toEqual([{ start: 1, end: 3 }]);
});

test('[0-2] cut [1-1]', () => {
  const i = new Intervaler();
  i.addInterval(0, 2);
  const result = i.cut(1, 1);
  expect(result.getIntervals()).toEqual([]);
  expect(i.getIntervals()).toEqual([{ start: 0, end: 2 }]);
});

test('[0-2] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(0, 2);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([]);
  expect(i.getIntervals()).toEqual([{ start: 0, end: 2 }]);
});

test('[0-3] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(0, 3);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([]);
  expect(i.getIntervals()).toEqual([{ start: 0, end: 3 }]);
});

test('[0-4] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(0, 4);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([{ start: 0, end: 1 }]);
  expect(i.getIntervals()).toEqual([{ start: 0, end: 3 }]);
});

test('[2-6] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(2, 6);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([{ start: 0, end: 3 }]);
  expect(i.getIntervals()).toEqual([{ start: 2, end: 3 }]);
});

test('[0-7] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(0, 7);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([{ start: 0, end: 3 }]);
  expect(i.getIntervals()).toEqual([{ start: 0, end: 4 }]);
});

test('[2-9] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(2, 9);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([{ start: 0, end: 3 }]);
  expect(i.getIntervals()).toEqual([{ start: 2, end: 6 }]);
});

test('[3-3] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(3, 3);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([]);
  expect(i.getIntervals()).toEqual([]);
});

test('[3-5] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(3, 5);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([{ start: 0, end: 2 }]);
  expect(i.getIntervals()).toEqual([]);
});

test('[3-6] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(3, 6);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([{ start: 0, end: 3 }]);
  expect(i.getIntervals()).toEqual([]);
});

test('[4-5] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(4, 5);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([{ start: 1, end: 2 }]);
  expect(i.getIntervals()).toEqual([]);
});

test('[3-7] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(3, 7);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([{ start: 0, end: 3 }]);
  expect(i.getIntervals()).toEqual([{ start: 3, end: 4 }]);
});

test('[4-9] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(4, 9);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([{ start: 1, end: 3 }]);
  expect(i.getIntervals()).toEqual([{ start: 3, end: 6 }]);
});

test('[6-9] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(6, 9);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([]);
  expect(i.getIntervals()).toEqual([{ start: 3, end: 6 }]);
});

test('[8-9] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(8, 9);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([]);
  expect(i.getIntervals()).toEqual([{ start: 5, end: 6 }]);
});

test('[1-3][6,9] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(1, 3);
  i.addInterval(6, 9);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([]);
  expect(i.getIntervals()).toEqual([{ start: 1, end: 6 }]);
});

test('[1-4][5,9] cut [3-6]', () => {
  const i = new Intervaler();
  i.addInterval(1, 4);
  i.addInterval(5, 9);
  const result = i.cut(3, 6);
  expect(result.getIntervals()).toEqual([{ start: 0, end: 1 }, { start: 2, end: 3 }]);
  expect(i.getIntervals()).toEqual([{ start: 1, end: 6 }]);
});

test('[1,8][10,15] cut [2,4]', () => {
  const i = new Intervaler();
  i.addInterval(1, 8);
  i.addInterval(10, 15);
  const result = i.cut(2, 4);
  expect(result.getIntervals()).toEqual([{ start: 0, end: 2 }]);
  expect(i.getIntervals()).toEqual([{ start: 1, end: 6 }, { start: 8, end: 13 }]);
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

test('[1,8][10,15] remove [2,4]', () => {
  const i = new Intervaler();
  i.addInterval(1, 8);
  i.addInterval(10, 15);
  i.removeInterval(2, 4);
  expect(i.getIntervals()).toEqual([
    { start: 1, end: 2 },
    { start: 4, end: 8 },
    { start: 10, end: 15 },
  ]);
});

test('[5,15] remove [2,10]', () => {
  const i = new Intervaler();
  i.addInterval(5, 15);
  i.removeInterval(2, 10);
  expect(i.getIntervals()).toEqual([
    { start: 10, end: 15 },
  ]);
});

test('[5,15] remove [10,20]', () => {
  const i = new Intervaler();
  i.addInterval(5, 15);
  i.removeInterval(10, 20);
  expect(i.getIntervals()).toEqual([
    { start: 5, end: 10 },
  ]);
});

test('[5,15] remove [5,15]', () => {
  const i = new Intervaler();
  i.addInterval(5, 15);
  i.removeInterval(5, 15);
  expect(i.getIntervals()).toEqual([]);
});

test('[5,15] remove [1,20]', () => {
  const i = new Intervaler();
  i.addInterval(5, 15);
  i.removeInterval(1, 20);
  expect(i.getIntervals()).toEqual([]);
});

test('[5,15] remove [10,10]', () => {
  const i = new Intervaler();
  i.addInterval(5, 15);
  i.removeInterval(10, 10);
  expect(i.getIntervals()).toEqual([{ start: 5, end: 10 }, { start: 10, end: 15 }]);
});
