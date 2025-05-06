import React, { useRef, useState } from 'react';
import { useAsync } from 'react-use'; 
import { TreeNode, RootNode } from './types/nodes'
import { parseJsonToTree } from './utils/parser'
import { treeToJson } from './utils/exporter'
import TreeView from './components/TreeView'
import NodeEditor from './components/NodeEditor'
import StatsPanel from './components/StatsPanel'
import { calculateStats } from './utils/stats'
import { validateJson } from './utils/validate'

const initial: RootNode = parseJsonToTree({})

export default function App() {
  const [tree, setTree] = useState<RootNode>(initial)
  const [selected, setSelected] = useState<TreeNode | null>(null)

  const handleUpdateNode = (updated: TreeNode) => {
    // replace the node in tree
    const replace = (node: TreeNode): TreeNode =>
      node.id === updated.id
        ? updated
        : 'children' in node
        ? { ...node, children: node.children.map(replace) as any }
        : node
    setTree((t) => replace(t) as RootNode)
  }
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleImportClick = () => hiddenFileInput.current?.click();
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target?.result as string);
        const parsed = parseJsonToTree(obj);
        setTree(parsed);
        setSelected(null);
      } catch (err: any) {
        alert('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
  };


  
  const handleExport = () => {
    const json = treeToJson(tree)
    const valid = validateJson(json)
    if (!valid.ok) {
      alert('Export failed: ' + valid.error)
      return
    }
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tree.json'
    a.click()
  }

  const stats = calculateStats(tree)

  return (
    <div className="flex h-full">
      <div className="w-1/3 overflow-auto border-r">
        <div className="flex justify-between items-center p-2">
  <h1 className="font-bold">Tree</h1>
  <div className="space-x-2">
    <button className="btn btn-sm" onClick={handleImportClick}>
      Import JSON
    </button>
    <button className="btn btn-sm" onClick={handleExport}>
      Export JSON
    </button>
  </div>
  <input
    type="file"
    accept=".json,application/json"
    ref={hiddenFileInput}
    onChange={handleImport}
    className="hidden"
  />
</div>
        <TreeView
          node={tree}
          selected={selected?.id}
          onSelect={(n) => setSelected(n)}
          onUpdate={handleUpdateNode}
        />
      </div>
      <div className="w-1/3 p-2 overflow-auto">
        {selected ? (
          <NodeEditor node={selected} onUpdate={handleUpdateNode} />
        ) : (
          <p className="text-gray-500">Select a node to edit</p>
        )}
      </div>
      <div className="w-1/3 p-2 overflow-auto border-l">
        <StatsPanel stats={stats} />
      </div>
    </div>
  )
}
