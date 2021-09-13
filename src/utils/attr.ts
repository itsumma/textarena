import ArenaAttribute from '../interfaces/ArenaAttribute';
import ArenaAttributes from '../interfaces/ArenaAttributes';

export function getStringFromAttribute(name: string, value: ArenaAttribute): string {
  if (typeof value === 'boolean') {
    if (value) {
      return name;
    }
  } else if (typeof value === 'number') {
    return `${name}="${value.toString()}"`;
  } else if (typeof value === 'string') {
    const escapedValue = value.toString()
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&apos;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `${name}="${escapedValue}"`;
  }
  return '';
}

export function getStringsFromAttributes(attributes: ArenaAttributes): string[] {
  const result: string[] = [];
  Object.entries(attributes).forEach(([name, value]) => {
    const str = getStringFromAttribute(name, value);
    if (str) {
      result.push(str);
    }
  });
  return result;
}
