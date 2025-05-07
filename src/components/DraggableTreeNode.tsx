import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TreeNode } from '../types/nodes';

interface DraggableTreeNodeProps {
  node: TreeNode;
  onMoveNode: (draggedNode: TreeNode, targetNode: TreeNode) => void;
  onSelect: (node: TreeNode) => void;
  selected?: string;
  children?: React.ReactNode;
}

const DraggableTreeNode: React.FC<DraggableTreeNodeProps> = ({
  node,
  onMoveNode,
  onSelect,
  selected,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TREE_NODE',
    item: { node },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: 'TREE_NODE',
    drop: (item: { node: TreeNode }) => {
      onMoveNode(item.node, node);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div
      ref={(instance) => drag(drop(instance))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`cursor-pointer p-1 rounded ${selected === node.id ? 'bg-blue-200' : ''} ${isOver ? 'border border-blue-500' : ''} ${isOverCurrent ? 'bg-green-200' : ''}`}
      onClick={() => onSelect(node)}
    >
      {children}
    </div>
  );
};

export default DraggableTreeNode;
