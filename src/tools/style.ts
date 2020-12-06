export default function style(context: any, config: any, value?: any): void {
  document.execCommand(config.style, false, value);
}
