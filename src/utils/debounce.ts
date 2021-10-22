export default function debounce<T extends Array<unknown>>(
  func: (...args: T) => void,
  wait: number,
  immediate = false,
): () => void {
  let timeout: number | undefined;
  return (...args: T) => {
    const later = () => {
      timeout = undefined;
      if (!immediate) {
        func(...args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait) as unknown as number;
    if (callNow) {
      func(...args);
    }
  };
}
