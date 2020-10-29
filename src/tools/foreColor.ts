export type ForeColorConfig = {
  color: string;
};

export default function foreColor(context: any, config: Partial<ForeColorConfig>): void {
  document.execCommand('foreColor', false, config.color);
}
