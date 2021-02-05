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
      if (interval.end < offset) {
        return interval;
      }
      return {
        start: interval.start < offset ? interval.start : interval.start + step,
        end: interval.end + step,
      };
    });
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
