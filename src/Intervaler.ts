type Interval = {
  start: number,
  end: number,
};

export default class Intervaler {
  private intervals: Interval[] = [];

  getIntervals(): Interval[] {
    return this.intervals;
  }

  shift(offset: number, step: number): void {
    this.intervals = this.intervals.map((interval) => {
      if (interval.end <= offset) {
        return interval;
      }
      return {
        start: interval.start < offset ? interval.start : interval.start + step,
        end: interval.end + step,
      };
    });
  }

  cut(offset: number, length?: number): Intervaler {
    const intervals: Interval[] = [];
    const intervaler = new Intervaler();
    this.intervals.forEach((interval) => {
      /**
       * 0123456789
       * ---[  ]-- offset: 3, length 4
       * [ ] 0-2
       */
      if (interval.end < offset) {
        intervals.push(interval);
        return;
      }
      /**
       * 0123456789
       * ---[  ]-- offset: 3, length 4
       * [  ] 0-3 → 0-2
       * [    ] 0-5 → 0-2
       * [     ] 0-6 → 0-2
       * [        ] 0-9 → 0-5
       * 012789
       */
      if (interval.start < offset) {
        intervals.push({
          start: interval.start,
          end: length ? Math.max(offset - 1, interval.end - length) : offset - 1,
        });
        intervaler.addInterval(0, interval.end - offset);
        return;
      }
      /**
       * 0123456789
       * ---[  ]-- offset: 3, length 4
       *    H 3-3 → ×
       *    [ ] 3-5 → ×
       *    [  ] 3-6 → ×
       *    [   ] 3-7 → 3-3
       *     [    ] 4-9 → 3-5
       *        [ ] 7-9 → 3-5
       *         [] 8-9 → 4-5
       * 012789
       */
      if (length
        && interval.start >= offset
        && interval.end >= offset + length) {
        intervals.push({
          start: Math.max(offset, interval.start - length),
          end: interval.end - length,
        });
      }
      if (interval.start >= offset) {
        if (!length) {
          intervaler.addInterval(interval.start - offset, interval.end - offset);
        } else if (interval.start < offset + length) {
          intervaler.addInterval(interval.start - offset, Math.min(length, interval.end - offset));
        }
      }
    });
    this.intervals = intervals;
    return intervaler;
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
}
