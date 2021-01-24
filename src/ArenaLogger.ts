export default class ArenaLogger {
  private debug = false;

  setDebug(debug: boolean): ArenaLogger {
    this.debug = debug;
    return this;
  }

  log(message?: string, ...optionalParams: (Record<string, unknown> | string)[]): void {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.log(message, ...optionalParams);
    }
  }

  info(message?: string, ...optionalParams: (Record<string, unknown> | string)[]): void {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.info(message, ...optionalParams);
    }
  }

  error(message?: string, ...optionalParams: (Record<string, unknown> | string)[]): void {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.error(message, ...optionalParams);
    }
  }

  warn(message?: string, ...optionalParams: (Record<string, unknown> | string)[]): void {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.warn(message, ...optionalParams);
    }
  }
}
