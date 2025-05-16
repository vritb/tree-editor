import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useAsync } from 'react-use'; 
import { TreeNode, RootNode } from './types/nodes'
import { parseJsonToTree } from './utils/parser'
import { treeToJson } from './utils/exporter'
import TreeView from './components/TreeView'
import NodeEditor from './components/NodeEditor'
import StatsPanel from './components/StatsPanel'
import { calculateStats } from './utils/stats'
import { validateJson } from './utils/validate'
import SettingsPanel from './components/SettingsPanel';
import { getUndoRedoDepthLimit } from './config/te-config';
import UndoRedoPanel from './components/UndoRedoPanel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from 'lodash';

const initial: RootNode = parseJsonToTree({})

export default function App() {
  const [tree, setTree] = useState<RootNode>(initial)
  const [selected, setSelected] = useState<TreeNode | null>(null)
  const [history, setHistory] = useState<RootNode[]>([]);
  const [redoStack, setRedoStack] = useState<RootNode[]>([]);
  const [undoRedoDepthLimit, setUndoRedoDepthLimit] = useState<number>(getUndoRedoDepthLimit());
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const handleUpdateNode = (updated: TreeNode) => {
    // replace the node in tree
    const replace = (node: TreeNode): TreeNode =>
      node.id === updated.id
        ? updated
        : 'children' in node
        ? { ...node, children: node.children.map(replace) as any }
        : node
    setTree((t) => {
      const newTree = replace(t) as RootNode;
      addToHistory(newTree);
      return newTree;
    });
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
        addToHistory(parsed);
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

  const addToHistory = useCallback(debounce((newTree: RootNode) => {
    setHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, newTree];
      if (updatedHistory.length > undoRedoDepthLimit) {
        updatedHistory.shift();
      }
      return updatedHistory;
    });
    setRedoStack([]);
  }, 300), [undoRedoDepthLimit]);

  const handleUndo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const newHistory = [...prevHistory];
      const lastState = newHistory.pop()!;
      setRedoStack((prevRedoStack) => [tree, ...prevRedoStack]);
      setTree(lastState);
      return newHistory;
    });
  };

  const handleRedo = () => {
    setRedoStack((prevRedoStack) => {
      if (prevRedoStack.length === 0) return prevRedoStack;
      const newRedoStack = [...prevRedoStack];
      const nextState = newRedoStack.shift()!;
      setHistory((prevHistory) => [...prevHistory, tree]);
      setTree(nextState);
      return newRedoStack;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        handleUndo();
      } else if (event.ctrlKey && event.key === 'y') {
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo]);

  const handleMoveNode = (draggedNode: TreeNode, targetNode: TreeNode, action: string) => {
    // Implement the logic to move the node based on the action
    // For example, you can update the tree state and add to history
    // This is a placeholder implementation
    console.log(`Move ${draggedNode.name} to ${targetNode.name} with action ${action}`);
    addToHistory(tree);
  };

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
            <button className="btn btn-sm" onClick={handleUndo} disabled={history.length === 0}>
              Undo
            </button>
            <button className="btn btn-sm" onClick={handleRedo} disabled={redoStack.length === 0}>
              Redo
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
          highlightedNode={highlightedNode}
          onMoveNode={handleMoveNode}
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
        <SettingsPanel
          undoRedoDepthLimit={undoRedoDepthLimit}
          setUndoRedoDepthLimit={setUndoRedoDepthLimit}
        />
        <UndoRedoPanel history={history} redoStack={redoStack} />
      </div>
    </div>
  )
}
