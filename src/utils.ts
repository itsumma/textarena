export function getFocusElement(): HTMLElement | undefined {
  const s = window.getSelection();
  if (!s) {
    return undefined;
  }
  const { focusNode } = s;
  if (focusNode) {
    return (focusNode.nodeType === 1 ? focusNode : focusNode.parentElement) as HTMLElement;
  }
  return undefined;
}

export function
isDescendant(parent: HTMLElement | Node, child: HTMLElement | Node): boolean {
  let node = child.parentNode;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
