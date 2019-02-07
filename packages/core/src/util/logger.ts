export class Logger {

  public static getLogger(className: string): Logger {
    return new Logger(className)
  }

  constructor(private className: string) {}

  public warning(msg: string) {
    console.warn(msg);
  }

}
