export type NodeType = 'root' | 'object' | 'list' | 'data'

export interface BaseNode {
  id: string
  name?: string
}

export interface RootNode extends BaseNode {
  type: 'root'
  children: TreeNode[]
}

export interface ObjectNode extends BaseNode {
  type: 'object'
  children: TreeNode[]
}

export interface ListNode extends BaseNode {
  type: 'list'
  children: TreeNode[]
}

export interface DataNode extends BaseNode {
  type: 'data'
  value: string | number | boolean | null
}

export type TreeNode = RootNode | ObjectNode | ListNode | DataNode
