import { TreeNode } from '../types/nodes'

export function treeToJson(node: TreeNode): any {
  switch (node.type) {
    case 'root':
    case 'object':
      return node.children.reduce(
        (acc, c) => {
          if (c.name === '') {
            throw new Error('Node name cannot be an empty string');
          }
          return { ...acc, [c.name ?? '']: treeToJson(c) };
        },
        {}
      );
    case 'list':
      return node.children.map(treeToJson);
    case 'data':
      return node.value;
  }
}
