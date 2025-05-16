import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DraggableTreeNode from '../../src/components/DraggableTreeNode';
import { TreeNode } from '../../src/types/nodes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

describe('DraggableTreeNode Component', () => {
  const mockOnMoveNode = jest.fn();
  const mockOnSelect = jest.fn();

  const mockTreeNode: TreeNode = {
    id: '1',
    type: 'data',
    name: 'Data Node',
    value: 'Value 1',
  };

  const mockTargetNode: TreeNode = {
    id: '2',
    type: 'data',
    name: 'Target Node',
    value: 'Value 2',
  };

  const renderWithDndProvider = (ui: React.ReactElement) => {
    return render(<DndProvider backend={HTML5Backend}>{ui}</DndProvider>);
  };

  it('renders the draggable tree node correctly', () => {
    const { getByText } = renderWithDndProvider(
      <DraggableTreeNode
        node={mockTreeNode}
        onMoveNode={mockOnMoveNode}
        onSelect={mockOnSelect}
      >
        {mockTreeNode.name}
      </DraggableTreeNode>
    );

    expect(getByText('Data Node')).toBeInTheDocument();
  });

  it('calls onSelect when the node is clicked', () => {
    const { getByText } = renderWithDndProvider(
      <DraggableTreeNode
        node={mockTreeNode}
        onMoveNode={mockOnMoveNode}
        onSelect={mockOnSelect}
      >
        {mockTreeNode.name}
      </DraggableTreeNode>
    );

    fireEvent.click(getByText('Data Node'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockTreeNode);
  });

  it('handles edge case: dragging a node to itself', () => {
    const { getByText } = renderWithDndProvider(
      <DraggableTreeNode
        node={mockTreeNode}
        onMoveNode={mockOnMoveNode}
        onSelect={mockOnSelect}
      >
        {mockTreeNode.name}
      </DraggableTreeNode>
    );

    fireEvent.dragStart(getByText('Data Node'));
    fireEvent.drop(getByText('Data Node'));
    expect(mockOnMoveNode).not.toHaveBeenCalled();
  });

  it('handles edge case: dragging a node to a non-droppable area', () => {
    const { getByText } = renderWithDndProvider(
      <DraggableTreeNode
        node={mockTreeNode}
        onMoveNode={mockOnMoveNode}
        onSelect={mockOnSelect}
      >
        {mockTreeNode.name}
      </DraggableTreeNode>
    );

    fireEvent.dragStart(getByText('Data Node'));
    fireEvent.drop(document.body);
    expect(mockOnMoveNode).not.toHaveBeenCalled();
  });

  it('calls onMoveNode when a node is dropped on another node', () => {
    const { getByText } = renderWithDndProvider(
      <>
        <DraggableTreeNode
          node={mockTreeNode}
          onMoveNode={mockOnMoveNode}
          onSelect={mockOnSelect}
        >
          {mockTreeNode.name}
        </DraggableTreeNode>
        <DraggableTreeNode
          node={mockTargetNode}
          onMoveNode={mockOnMoveNode}
          onSelect={mockOnSelect}
        >
          {mockTargetNode.name}
        </DraggableTreeNode>
      </>
    );

    fireEvent.dragStart(getByText('Data Node'));
    fireEvent.drop(getByText('Target Node'));
    expect(mockOnMoveNode).toHaveBeenCalledWith(mockTreeNode, mockTargetNode);
  });
});
