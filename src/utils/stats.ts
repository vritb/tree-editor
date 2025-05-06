import { TreeNode } from '../types/nodes'

export interface TreeStats {
  total: number
  maxDepth: number
  counts: { [k: string]: number }
}

export function calculateStats(root: TreeNode): TreeStats {
  const counts: Record<string, number> = {
    root: 0,
    object: 0,
    list: 0,
    data: 0,
  }
  let maxDepth = 0
  const walk = (n: TreeNode, depth: number) => {
    counts[n.type]++
    maxDepth = Math.max(maxDepth, depth)
    if ('children' in n) n.children.forEach((c) => walk(c, depth + 1))
  }
  walk(root, 1)
  return {
    total: Object.values(counts).reduce((a, b) => a + b, 0),
    maxDepth,
    counts,
  }
}
