export default function styleState(context: any, config: any): boolean {
  return document.queryCommandState(config.style);
}
