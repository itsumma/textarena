/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class ArenaLogger {
  private debug = false;

  setDebug(debug: boolean): ArenaLogger {
    this.debug = debug;
    return this;
  }

  log(message?: string, ...optionalParams: any[]): void {
    if (this.debug) {
      console.groupCollapsed(message);
      console.log(message, ...optionalParams);
      console.trace();
      console.groupEnd();
    }
  }

  info(message?: string, ...optionalParams: any[]): void {
    if (this.debug) {
      console.info(message, ...optionalParams);
    }
  }

  error(message?: string, ...optionalParams: any[]): void {
    if (this.debug) {
      console.error(message, ...optionalParams);
    }
  }

  warn(message?: string, ...optionalParams: any[]): void {
    if (this.debug) {
      console.warn(message, ...optionalParams);
    }
  }
}
