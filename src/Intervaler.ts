type Interval = {
  start: number,
  end: number,
};

export default class Intervaler {
  private intervals: Interval[] = [];

  getIntervals(): Interval[] {
    return this.intervals;
  }

  shift(offset: number, step: number, keep = false): void {
    this.intervals = this.intervals.map((interval) => {
      if (keep ? interval.end < offset : interval.end <= offset) {
        return interval;
      }
      return {
        start: interval.start < offset ? interval.start : interval.start + step,
        end: interval.end + step,
      };
    });
  }

  cut(offset: number, length?: number): Intervaler {
    const intervaler = new Intervaler();
    if (!length) length = offset;
    this.intervals.forEach((interval) => {
      // I - current interval
      // C - current cut
      // C includes I && C > I
      if (interval.start > offset && interval.end < length) {
        return;
      }
      // I doesn't includes C
      if (interval.start > length) {
        intervaler.addInterval(interval.start, interval.end);
        return;
      }
      // I doesn't includes C
      if (interval.end < offset) {
        intervaler.addInterval(interval.start, interval.end);
        return;
      }
      // I includes C && I === C
      if (interval.start === offset && interval.end === length) {
        return;
      }
      // I includes C
      if (interval.start < offset && interval.end > length) {
        intervaler.addInterval(interval.start, offset);
        intervaler.addInterval(length, interval.end);
        return;
      }
      // I includes C (left)
      if (interval.start >= offset && interval.start <= length) {
        intervaler.addInterval(length, interval.end);
        return;
      }
      // I includes C (right)
      if (interval.end >= offset && interval.end <= length) {
        intervaler.addInterval(interval.start, offset);
      }
    });
    this.intervals = intervaler.getIntervals();
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
}
