import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TreeView from '../../src/components/TreeView';
import { TreeNode } from '../../src/types/nodes';

describe('TreeView Component', () => {
  const mockTree: TreeNode = {
    id: 'root',
    type: 'root',
    children: [
      {
        id: '1',
        type: 'object',
        name: 'Object 1',
        children: [
          {
            id: '1-1',
            type: 'data',
            name: 'Data 1-1',
            value: 'Value 1-1',
          },
        ],
      },
      {
        id: '2',
        type: 'list',
        name: 'List 2',
        children: [
          {
            id: '2-1',
            type: 'data',
            name: 'Data 2-1',
            value: 'Value 2-1',
          },
        ],
      },
    ],
  };

  const mockOnSelect = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnMoveNode = jest.fn();

  it('renders the tree structure correctly', () => {
    const { getByText } = render(
      <TreeView
        node={mockTree}
        onSelect={mockOnSelect}
        onUpdate={mockOnUpdate}
        onMoveNode={mockOnMoveNode}
      />
    );

    expect(getByText('Object 1')).toBeInTheDocument();
    expect(getByText('Data 1-1')).toBeInTheDocument();
    expect(getByText('List 2')).toBeInTheDocument();
    expect(getByText('Data 2-1')).toBeInTheDocument();
  });

  it('calls onSelect when a node is clicked', () => {
    const { getByText } = render(
      <TreeView
        node={mockTree}
        onSelect={mockOnSelect}
        onUpdate={mockOnUpdate}
        onMoveNode={mockOnMoveNode}
      />
    );

    fireEvent.click(getByText('Object 1'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockTree.children[0]);
  });

  it('toggles collapse/expand when the button is clicked', () => {
    const { getByText, queryByText } = render(
      <TreeView
        node={mockTree}
        onSelect={mockOnSelect}
        onUpdate={mockOnUpdate}
        onMoveNode={mockOnMoveNode}
      />
    );

    fireEvent.click(getByText('-'));
    expect(queryByText('Data 1-1')).not.toBeInTheDocument();

    fireEvent.click(getByText('+'));
    expect(getByText('Data 1-1')).toBeInTheDocument();
  });

  it('handles edge case: empty tree', () => {
    const emptyTree: TreeNode = {
      id: 'root',
      type: 'root',
      children: [],
    };

    const { queryByText } = render(
      <TreeView
        node={emptyTree}
        onSelect={mockOnSelect}
        onUpdate={mockOnUpdate}
        onMoveNode={mockOnMoveNode}
      />
    );

    expect(queryByText('Object 1')).not.toBeInTheDocument();
    expect(queryByText('List 2')).not.toBeInTheDocument();
  });

  it('handles edge case: deeply nested nodes', () => {
    const deeplyNestedTree: TreeNode = {
      id: 'root',
      type: 'root',
      children: [
        {
          id: '1',
          type: 'object',
          name: 'Object 1',
          children: [
            {
              id: '1-1',
              type: 'object',
              name: 'Object 1-1',
              children: [
                {
                  id: '1-1-1',
                  type: 'data',
                  name: 'Data 1-1-1',
                  value: 'Value 1-1-1',
                },
              ],
            },
          ],
        },
      ],
    };

    const { getByText } = render(
      <TreeView
        node={deeplyNestedTree}
        onSelect={mockOnSelect}
        onUpdate={mockOnUpdate}
        onMoveNode={mockOnMoveNode}
      />
    );

    expect(getByText('Object 1')).toBeInTheDocument();
    expect(getByText('Object 1-1')).toBeInTheDocument();
    expect(getByText('Data 1-1-1')).toBeInTheDocument();
  });

  it('handles edge case: tree with missing node names', () => {
    const treeWithMissingNodeNames: TreeNode = {
      id: 'root',
      type: 'root',
      children: [
        {
          id: '1',
          type: 'object',
          name: '',
          children: [
            {
              id: '1-1',
              type: 'data',
              name: '',
              value: 'Value 1-1',
            },
          ],
        },
      ],
    };

    const { getByText } = render(
      <TreeView
        node={treeWithMissingNodeNames}
        onSelect={mockOnSelect}
        onUpdate={mockOnUpdate}
        onMoveNode={mockOnMoveNode}
      />
    );

    expect(getByText('(root)')).toBeInTheDocument();
    expect(getByText('(unnamed)')).toBeInTheDocument();
  });

  it('handles edge case: tree with duplicate node names', () => {
    const treeWithDuplicateNodeNames: TreeNode = {
      id: 'root',
      type: 'root',
      children: [
        {
          id: '1',
          type: 'object',
          name: 'Duplicate',
          children: [
            {
              id: '1-1',
              type: 'data',
              name: 'Duplicate',
              value: 'Value 1-1',
            },
          ],
        },
        {
          id: '2',
          type: 'object',
          name: 'Duplicate',
          children: [
            {
              id: '2-1',
              type: 'data',
              name: 'Duplicate',
              value: 'Value 2-1',
            },
          ],
        },
      ],
    };

    const { getAllByText } = render(
      <TreeView
        node={treeWithDuplicateNodeNames}
        onSelect={mockOnSelect}
        onUpdate={mockOnUpdate}
        onMoveNode={mockOnMoveNode}
      />
    );

    expect(getAllByText('Duplicate')).toHaveLength(4);
  });

  it('highlights the dragged node and the hover node', () => {
    const { getByText } = render(
      <TreeView
        node={mockTree}
        onSelect={mockOnSelect}
        onUpdate={mockOnUpdate}
        onMoveNode={mockOnMoveNode}
      />
    );

    const object1 = getByText('Object 1');
    const data11 = getByText('Data 1-1');

    fireEvent.dragStart(object1);
    expect(object1).toHaveClass('bg-yellow-200');

    fireEvent.dragOver(data11);
    expect(data11).toHaveClass('bg-yellow-200');
  });

  it('displays popup with action buttons during drag & drop', () => {
    const { getByText, getByRole } = render(
      <TreeView
        node={mockTree}
        onSelect={mockOnSelect}
        onUpdate={mockOnUpdate}
        onMoveNode={mockOnMoveNode}
      />
    );

    const object1 = getByText('Object 1');
    const data11 = getByText('Data 1-1');

    fireEvent.dragStart(object1);
    fireEvent.dragOver(data11);
    fireEvent.drop(data11);

    expect(getByRole('button', { name: 'Insert Before' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Insert After' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Adopt' })).toBeInTheDocument();
  });
});
