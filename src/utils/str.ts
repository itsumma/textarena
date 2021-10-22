import { charmap } from './charmap';

export function transliterate(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i += 1) {
    // Get current character, taking surrogates in consideration
    const char = /[\uD800-\uDBFF]/.test(str[i]) && /[\uDC00-\uDFFF]/.test(str[i + 1])
      ? str[i] + str[i + 1]
      : str[i];
    const s = charmap[char] || '';
    result += s;
    // If it's UTF-32 then skip next character
    i += char.length - 1;
  }
  return result;
}

export function prepareForAttribute(str: string): string {
  return transliterate(str)
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f]/g, '')
    .replace(/\s/g, '-')
    .replace(/</g, '')
    .replace(/>/g, '')
    .replace(/"/g, '')
    .replace(/'/g, '')
    .replace(/=/g, '-')
    .replace(/\u00A0/, '-');
}
