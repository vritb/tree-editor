import React, { useState, useEffect } from 'react'
import { DataNode, TreeNode } from '../types/nodes'

interface Props {
  node: TreeNode
  selected?: string
  onSelect: (n: TreeNode) => void
  onUpdate: (n: TreeNode) => void
  highlightedNode?: string | null;
}

export default function TreeView({
  node,
  selected,
  onSelect,
  onUpdate,
  highlightedNode,
}: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const toggleCollapse = (id: string) => {
    setCollapsed((c) => {
      const n = new Set(c)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const renderNode = (n: TreeNode, depth: number) => {
    const hasChildren = 'children' in n && n.children.length > 0
    const isCollapsed = collapsed.has(n.id)
    
    // Helper: pretty‑print a primitive value and truncate long strings
    const formatValue = (v: unknown) => {
      const str = JSON.stringify(v)
      return str.length > 30 ? str.slice(0, 27) + '…' : str
    }

    return (
      <div key={n.id}>
        <div style={{ paddingLeft: depth * 16 }}>
          <div
            className={`cursor-pointer p-1 rounded ${
              selected === n.id ? 'bg-blue-200' : ''
            } ${highlightedNode === n.id ? 'bg-yellow-200' : ''}`}
            onClick={() => onSelect(n)}
          >
            {hasChildren && (
              <button
                className="mr-1"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleCollapse(n.id)
                }}
              >
                {isCollapsed ? '+' : '-'}
              </button>
            )}
            <span>
              {n.name || '(root)'}
              {/* Show primitive value inline for DataNodes */}
              {n.type === 'data' && (
                <>
                  :{' '}
                  <span className="text-green-700">
                    {formatValue((n as DataNode).value)}
                  </span>
                </>
              )}
            </span>          
            <span className="text-xs ml-1 text-gray-500">[{n.type}]</span>
          </div>
          {hasChildren && !isCollapsed && n.children.map((c) => renderNode(c, depth + 1))}
        </div>
      </div>
    )
  }

  return <div>{renderNode(node, 0)}</div>
}
