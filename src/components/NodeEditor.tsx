import React, { useState } from 'react'
import { DataNode, ListNode, ObjectNode, TreeNode } from '../types/nodes'
import { v4 as uuid } from 'uuid'

interface Props {
  node: TreeNode
  onUpdate: (n: TreeNode) => void
}

const inputClass =
  'border p-1 rounded w-full text-sm focus:outline-none focus:ring'

export default function NodeEditor({ node, onUpdate }: Props) {
  const [working, setWorking] = useState<TreeNode>(JSON.parse(JSON.stringify(node)))

  const commit = () => onUpdate(working)

  const updateField = (field: string, value: any) =>
    setWorking((n) => ({ ...n, [field]: value } as TreeNode))

  const addChild = () => {
    if (working.type === 'data') return
    const newNode: DataNode = {
      id: uuid(),
      type: 'data',
      name: 'new',
      value: ''
    }
    updateField('children', [...(working as any).children, newNode])
  }

  const removeChild = (id: string) => {
    if (working.type === 'data') return
    updateField(
      'children',
      (working as any).children.filter((c: TreeNode) => c.id !== id)
    )
  }

  return (
    <div className="space-y-2">
      <h2 className="font-semibold">{working.name || '(root)'}</h2>
      <label className="block text-sm">
        Name
        <input
          value={working.name || ''}
          className={inputClass}
          onChange={(e) => updateField('name', e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Type
        <input value={working.type} className={inputClass} disabled />
      </label>
      {working.type === 'data' && (
        <label className="block text-sm">
          Value
          <input
            value={String((working as DataNode).value ?? '')}
            className={inputClass}
            onChange={(e) =>
              updateField('value', e.target.value)
            }
          />
        </label>
      )}
      {(working.type === 'object' || working.type === 'list' || working.type === 'root') && (
        <>
          <div className="flex justify-between items-center">
            <span className="font-medium">Children</span>
            <button className="btn btn-sm" onClick={addChild}>
              + Add
            </button>
          </div>
          <ul className="list-disc pl-4">
            {(working as any).children.map((c: TreeNode) => (
              <li key={c.id} className="flex justify-between">
                <span>{c.name || '(unnamed)'} [{c.type}]</span>
                <button
                  className="text-red-600 text-xs"
                  onClick={() => removeChild(c.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <button className="btn btn-primary w-full" onClick={commit}>
        Save Changes
      </button>
    </div>
  )
}
