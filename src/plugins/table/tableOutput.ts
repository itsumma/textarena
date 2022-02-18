import { AnyArenaNode, ArenaFormatings } from '../../interfaces';

export function tableOutput(
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
): string {
  if (['html', 'amp', 'rss'].includes(type)) {
    return `
      <table>
        ${node.hasChildren ? node.children.map((child) => child.getOutput(type, frms)).join('\n') : null}
      </table>
    `;
  }
  return '';
}

export function trOutput(
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
): string {
  if (['html', 'amp', 'rss'].includes(type)) {
    return `
      <tr>
        ${node.hasChildren ? node.children.map((child) => child.getOutput(type, frms)).join('\n') : null}
      </tr>
    `;
  }
  return '';
}

export function tdOutput(
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
): string {
  if (['html', 'amp', 'rss'].includes(type)) {
    return `
      <td>
        ${node.hasChildren ? node.children.map((child) => child.getOutput(type, frms)).join('\n') : null}
      </td>
    `;
  }
  return '';
}
