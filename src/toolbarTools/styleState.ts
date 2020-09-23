export default function styleState(context: any, config: any) {
  return document.queryCommandState(config.style);
}