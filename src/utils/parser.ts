import { v4 as uuid } from 'uuid'
import { RootNode, TreeNode } from '../types/nodes'

export function parseJsonToTree(input: any): RootNode {
  const build = (value: any, name?: string): TreeNode => {
    if (Array.isArray(value)) {
      return {
        id: uuid(),
        type: 'list',
        name,
        children: value.map((v, i) => build(v, String(i))),
      }
    } else if (value !== null && typeof value === 'object') {
      return {
        id: uuid(),
        type: name ? 'object' : 'root',
        name,
        children: Object.keys(value).map((k) => build(value[k], k)),
      } as any
    } else {
      return {
        id: uuid(),
        type: 'data',
        name,
        value,
      }
    }
  }
  return build(input) as RootNode
}
