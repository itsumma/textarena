type Interval = {
  start: number,
  end: number,
};

export default class Intervaler {
  private intervals: Interval[];

  constructor(intervals?: Interval[]) {
    this.intervals = intervals || [];
  }

  getIntervals(): Interval[] {
    return this.intervals;
  }

  shiftOld(offset: number, step: number, keep = false): void {
    this.intervals = this.intervals.map((interval) => {
      if (keep ? interval.end < offset : interval.end <= offset) {
        return interval;
      }
      return {
        start: (keep ? interval.start <= offset : interval.start < offset)
          ? interval.start : interval.start + step,
        end: interval.end + step,
      };
    });
  }

  shift(offset: number, step: number): void {
    const intervals: Interval[] = [];
    this.intervals.forEach((interval) => {
      if (interval.end <= offset) {
        intervals.push(interval);
        return;
      }
      if (interval.start >= offset) {
        intervals.push({
          start: interval.start + step,
          end: interval.end + step,
        });
        return;
      }
      intervals.push({
        start: interval.start,
        end: offset,
      });
      intervals.push({
        start: offset + step,
        end: interval.end + step,
      });
    });
    this.intervals = this.checkIntersection(intervals);
  }

  cut(start: number, end?: number): Intervaler {
    const intervaler = new Intervaler();
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
          start: interval.start,
          end: end ? start + Math.max(0, interval.end - end) : start,
        });
        if (start < interval.end) {
          intervaler.addInterval(
            0,
            end ? Math.min(end - start, interval.end - start) : interval.end - start,
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
          start: Math.max(start, interval.start - (end - start)),
          end: interval.end - (end - start),
        });
      }
      if (!end) {
        intervaler.addInterval(
          interval.start - start,
          interval.end - start,
        );
      } else if (interval.start < end && interval.end > start) {
        intervaler.addInterval(
          interval.start - start,
          Math.min(end - start, interval.end - start),
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
          start: lastInterval.start,
          end: interval.end,
        };
      } else {
        result.push(interval);
      }
    });
    return result;
  }

  merge(intervaler: Intervaler, offset: number): void {
    intervaler.intervals.forEach((interval) => {
      this.addInterval(interval.start + offset, interval.end + offset);
    });
  }

  addInterval(start: number, end: number): void {
    let newInterval = {
      start,
      end,
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
      if (newInterval.end < interval.start) {
        skipOther = true;
        newIntervals.push(newInterval);
        newIntervals.push(interval);
        return;
      }
      /**
       * -----[   ]-----
       *            [  ]
       */
      if (newInterval.start > interval.end) {
        newIntervals.push(interval);
        return;
      }
      /**
       * -----[   ]-----
       *   [  ]
       *   [    ]
       *   [      ]
       *       [ ]
       *       [  ]
       */
      if (newInterval.end <= interval.end) {
        skipOther = true;
        newIntervals.push({
          start: Math.min(newInterval.start, interval.start),
          end: interval.end,
        });
        return;
      }
      /**
       * -----[   ]-----
       *        [   ]
       *          [  ]
       */
      if (newInterval.end > interval.end) {
        newInterval = {
          start: Math.min(newInterval.start, interval.start),
          end: newInterval.end,
        };
      }
    });
    if (!skipOther) {
      newIntervals.push(newInterval);
    }
    this.intervals = newIntervals;
  }

  removeInterval(start: number, end: number): void {
    const intervals: Interval[] = [];
    this.intervals.forEach((interval) => {
      // I - current interval
      // C - current cut
      // C includes I && C > I
      if (interval.start > start && interval.end < end) {
        return;
      }
      // I doesn't includes C
      if (interval.start > end) {
        intervals.push({ start: interval.start, end: interval.end });
        return;
      }
      // I doesn't includes C
      if (interval.end < start) {
        intervals.push({ start: interval.start, end: interval.end });
        return;
      }
      // I includes C && I === C
      if (interval.start === start && interval.end === end) {
        return;
      }
      // I includes C
      if (interval.start < start && interval.end > end) {
        intervals.push({ start: interval.start, end: start });
        intervals.push({ start: end, end: interval.end });
        return;
      }
      // I includes C (left)
      if (interval.start >= start && interval.start <= end) {
        intervals.push({ start: end, end: interval.end });
        return;
      }
      // I includes C (right)
      if (interval.end >= start && interval.end <= end) {
        intervals.push({ start: interval.start, end: start });
      }
    });
    this.intervals = intervals;
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

  clone(): Intervaler {
    return new Intervaler(
      this.intervals.map((interval) => ({ ...interval })),
    );
  }
}
