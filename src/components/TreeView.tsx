import React, { useState, useEffect } from 'react'
import { DataNode, TreeNode } from '../types/nodes'

interface Props {
  node: TreeNode
  selected?: string
  onSelect: (n: TreeNode) => void
  onUpdate: (n: TreeNode) => void
  highlightedNode?: string | null;
  onMoveNode: (draggedNode: TreeNode, targetNode: TreeNode, action: string) => void;
}

export default function TreeView({
  node,
  selected,
  onSelect,
  onUpdate,
  highlightedNode,
  onMoveNode,
}: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [draggedNode, setDraggedNode] = useState<TreeNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null)
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState<{ x: number, y: number } | null>(null)

  const toggleCollapse = (id: string) => {
    setCollapsed((c) => {
      const n = new Set(c)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const handleDragStart = (e: React.DragEvent, node: TreeNode) => {
    setDraggedNode(node)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, node: TreeNode) => {
    e.preventDefault()
    setHoveredNode(node)
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, node: TreeNode) => {
    e.preventDefault()
    if (draggedNode && hoveredNode) {
      setPopupVisible(true)
      setPopupPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handlePopupAction = (action: string) => {
    if (draggedNode && hoveredNode) {
      onMoveNode(draggedNode, hoveredNode, action)
      setPopupVisible(false)
      setDraggedNode(null)
      setHoveredNode(null)
    }
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
        <div
          style={{ paddingLeft: depth * 16 }}
          draggable
          onDragStart={(e) => handleDragStart(e, n)}
          onDragOver={(e) => handleDragOver(e, n)}
          onDrop={(e) => handleDrop(e, n)}
        >
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

  return (
    <div>
      {renderNode(node, 0)}
      {popupVisible && popupPosition && (
        <div
          className="absolute bg-white border p-2 rounded shadow"
          style={{ top: popupPosition.y, left: popupPosition.x }}
        >
          <button onClick={() => handlePopupAction('insertBefore')}>Insert Before</button>
          <button onClick={() => handlePopupAction('insertAfter')}>Insert After</button>
          <button onClick={() => handlePopupAction('adopt')}>Adopt</button>
        </div>
      )}
    </div>
  )
}
