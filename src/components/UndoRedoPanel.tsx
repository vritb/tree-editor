import React from 'react';
import { TreeNode } from '../types/nodes';

interface UndoRedoPanelProps {
  history: TreeNode[];
  redoStack: TreeNode[];
}

const UndoRedoPanel: React.FC<UndoRedoPanelProps> = ({ history, redoStack }) => {
  return (
    <div className="undo-redo-panel">
      <h2 className="font-semibold">Undo/Redo Stack</h2>
      <div className="mt-2">
        <h3 className="font-medium">Undo Stack</h3>
        <ul className="list-disc pl-4">
          {history.map((state, index) => (
            <li key={index}>
              {state.name || '(root)'}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <h3 className="font-medium">Redo Stack</h3>
        <ul className="list-disc pl-4">
          {redoStack.map((state, index) => (
            <li key={index}>
              {state.name || '(root)'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UndoRedoPanel;
