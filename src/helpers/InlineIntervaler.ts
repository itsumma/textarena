import { ArenaNodeInline } from '../interfaces/ArenaNode';

type Interval = {
  node: ArenaNodeInline,
  start: number,
  end: number,
};

export default class InlineIntervaler {
  private intervals: Interval[] = [];

  constructor(intervals?: Interval[]) {
    this.intervals = intervals || [];
  }

  getIntervals(): Interval[] {
    return this.intervals;
  }

  shift(offset: number, step: number, keep = false): void {
    this.intervals = this.intervals.map((interval) => {
      if (keep ? interval.end < offset : interval.end <= offset) {
        return interval;
      }
      return {
        node: interval.node,
        start: (keep ? interval.start <= offset : interval.start < offset)
          ? interval.start : interval.start + step,
        end: interval.end + step,
      };
    });
  }

  cut(start: number, end?: number): InlineIntervaler {
    const intervaler = new InlineIntervaler();
    if (end && end <= start) {
      return intervaler;
    }
    const intervals: Interval[] = [];
    this.intervals.forEach((interval) => {
      /**
       * 0123456789
       * ---[  ]-- start: 3, end 6
       *    H 3-3 → ×, cut: ×
       * [ ] 0-2 → 0-2, cut: ×
       * [  ] 0-3 → 0-3, cut: ×
       */
      if (interval.end <= start) {
        if (interval.start < start) {
          intervals.push(interval);
        }
        return;
      }
      /**
       * 0123456789
       * ---[  ]-- start: 3, end 6
       * [   ] 0-4 → 0-3, cut: 0-1
       *   [   ] 2-6 → 2-3, cut: 0-3
       * [      ] 0-7 → 0-4, cut: 0-3
       * [        ] 0-9 → 0-6, cut: 0-3
       *   [      ] 2-9 → 2-6, cut: 0-3
       * 012789
       */
      if (interval.start < start) {
        intervals.push({
          node: interval.node,
          start: interval.start,
          end: end ? start + Math.max(0, interval.end - end) : start,
        });
        if (start < interval.end) {
          intervaler.addInterval(
            0,
            end ? Math.min(end - start, interval.end - start) : interval.end - start,
            interval.node.clone(),
          );
        }
        return;
      }
      /**
       * 0123456789
       * ---[  ]-- start: 3, end 6
       *    [ ] 3-5 → ×, cut: 0-2
       *    [  ] 3-6 → ×, cut: 0-3
       *     [] 4-5 → ×, cut: 1-2
       *    [   ] 3-7 → 3-4, cut: 0-3
       *     [    ] 4-9 → 3-6, cut: 1-3
       *       [  ] 6-9 → 3-6, cut: ×
       *         [] 8-9 → 5-6, cut: ×
       * 012789
       */
      if (end
        && interval.end > end) {
        intervals.push({
          node: interval.node,
          start: Math.max(start, interval.start - (end - start)),
          end: interval.end - (end - start),
        });
      }
      if (!end) {
        intervaler.addInterval(
          interval.start - start,
          interval.end - start,
          interval.node.clone(),
        );
      } else if (interval.start < end && interval.end > start) {
        intervaler.addInterval(
          interval.start - start,
          Math.min(end - start, interval.end - start),
          interval.node.clone(),
        );
      }
    });
    this.intervals = this.checkIntersection(intervals);
    return intervaler;
  }

  protected checkIntersection(intervals: Interval[]): Interval[] {
    const result: Interval[] = [];
    let lastInterval: Interval | undefined;
    intervals.forEach((interval) => {
      lastInterval = result.length ? result[result.length - 1] : undefined;
      if (lastInterval && lastInterval.end >= interval.start) {
        result[result.length - 1] = {
          node: lastInterval.node,
          start: lastInterval.start,
          end: interval.end,
        };
      } else {
        result.push(interval);
      }
    });
    return result;
  }

  merge(intervaler: InlineIntervaler, offset: number): void {
    intervaler.intervals.forEach((interval) => {
      this.addInterval(interval.start + offset, interval.end + offset, interval.node);
    });
  }

  addInterval(start: number, end: number, node: ArenaNodeInline): void {
    const newInterval: Interval = {
      start,
      end,
      node,
    };
    const newIntervals: Interval[] = [];
    let skipOther = false;
    this.intervals.forEach((interval) => {
      if (skipOther) {
        newIntervals.push(interval);
        return;
      }
      /**
       * -----[   ]-----
       * [  ]
       */
      if (newInterval.end <= interval.start) {
        skipOther = true;
        newIntervals.push(newInterval);
        newIntervals.push(interval);
        return;
      }
      /**
       * -----[   ]-----
       *            [  ]
       */
      if (newInterval.start >= interval.end) {
        newIntervals.push(interval);
        return;
      }
      skipOther = true;
      newIntervals.push(interval);
    });
    if (!skipOther) {
      newIntervals.push(newInterval);
    }
    this.intervals = newIntervals;
  }

  public getNode(start: number, end: number): ArenaNodeInline | undefined {
    for (let i = 0; i < this.intervals.length; i += 1) {
      const interval = this.intervals[i];
      if (interval.end >= start && interval.start <= end) {
        return interval.node;
      }
      if (interval.start > start) {
        return undefined;
      }
    }
    return undefined;
  }

  public removeNode(node: ArenaNodeInline): void {
    for (let i = 0; i < this.intervals.length; i += 1) {
      if (this.intervals[i].node === node) {
        this.intervals.splice(i, 1);
        return;
      }
    }
  }

  public updateNode(node: ArenaNodeInline, start: number, end: number): void {
    const newIntervals: Interval[] = [];
    let skipOther = false;
    this.intervals.forEach((interval) => {
      if (skipOther) {
        newIntervals.push(interval);
        return;
      }
      if (interval.node === node) {
        newIntervals.push({
          node: interval.node,
          start,
          end,
        });
        return;
      }
      if (interval.end <= start) {
        newIntervals.push(interval);
        return;
      }
      if (interval.start >= end) {
        skipOther = true;
        newIntervals.push(interval);
        return;
      }
      if (interval.start < start) {
        newIntervals.push({
          node: interval.node,
          start: interval.start,
          end: Math.min(interval.end, start),
        });
        return;
      }
      if (interval.end > end) {
        newIntervals.push({
          node: interval.node,
          start: Math.max(interval.start, end),
          end: interval.end,
        });
      }
    });
    this.intervals = newIntervals;
  }

  hasInterval(start: number, end: number): boolean {
    for (let i = 0; i < this.intervals.length; i += 1) {
      const interval = this.intervals[i];
      if (interval.start <= start && interval.end >= end) {
        return true;
      }
      if (interval.start > start) {
        return false;
      }
    }
    return false;
  }

  clone(): InlineIntervaler {
    return new InlineIntervaler(
      this.intervals.map((interval) => ({ ...interval })),
    );
  }
}
