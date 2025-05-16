import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NodeEditor from '../../src/components/NodeEditor';
import { TreeNode, DataNode, ObjectNode, ListNode } from '../../src/types/nodes';

describe('NodeEditor Component', () => {
  const mockOnUpdate = jest.fn();

  const mockDataNode: DataNode = {
    id: '1',
    type: 'data',
    name: 'Data Node',
    value: 'Value 1',
  };

  const mockObjectNode: ObjectNode = {
    id: '2',
    type: 'object',
    name: 'Object Node',
    children: [],
  };

  const mockListNode: ListNode = {
    id: '3',
    type: 'list',
    name: 'List Node',
    children: [],
  };

  it('renders the node editor correctly for DataNode', () => {
    const { getByLabelText } = render(
      <NodeEditor node={mockDataNode} onUpdate={mockOnUpdate} />
    );

    expect(getByLabelText('Name')).toHaveValue('Data Node');
    expect(getByLabelText('Type')).toHaveValue('data');
    expect(getByLabelText('Value')).toHaveValue('Value 1');
  });

  it('renders the node editor correctly for ObjectNode', () => {
    const { getByLabelText, getByText } = render(
      <NodeEditor node={mockObjectNode} onUpdate={mockOnUpdate} />
    );

    expect(getByLabelText('Name')).toHaveValue('Object Node');
    expect(getByLabelText('Type')).toHaveValue('object');
    expect(getByText('+ Add')).toBeInTheDocument();
  });

  it('renders the node editor correctly for ListNode', () => {
    const { getByLabelText, getByText } = render(
      <NodeEditor node={mockListNode} onUpdate={mockOnUpdate} />
    );

    expect(getByLabelText('Name')).toHaveValue('List Node');
    expect(getByLabelText('Type')).toHaveValue('list');
    expect(getByText('+ Add')).toBeInTheDocument();
  });

  it('calls onUpdate when Save Changes button is clicked', () => {
    const { getByText } = render(
      <NodeEditor node={mockDataNode} onUpdate={mockOnUpdate} />
    );

    fireEvent.click(getByText('Save Changes'));
    expect(mockOnUpdate).toHaveBeenCalledWith(mockDataNode);
  });

  it('handles edge case: editing a node to have an empty name', () => {
    const { getByLabelText, getByText } = render(
      <NodeEditor node={mockDataNode} onUpdate={mockOnUpdate} />
    );

    fireEvent.change(getByLabelText('Name'), { target: { value: '' } });
    fireEvent.click(getByText('Save Changes'));
    expect(mockOnUpdate).toHaveBeenCalledWith({ ...mockDataNode, name: '' });
  });

  it('handles edge case: adding a child to a data node', () => {
    const { getByText } = render(
      <NodeEditor node={mockDataNode} onUpdate={mockOnUpdate} />
    );

    fireEvent.click(getByText('+ Add'));
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('handles edge case: removing a child from an object node', () => {
    const mockObjectNodeWithChild: ObjectNode = {
      ...mockObjectNode,
      children: [mockDataNode],
    };

    const { getByText } = render(
      <NodeEditor node={mockObjectNodeWithChild} onUpdate={mockOnUpdate} />
    );

    fireEvent.click(getByText('Remove'));
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockObjectNodeWithChild,
      children: [],
    });
  });

  it('handles edge case: removing a child from a list node', () => {
    const mockListNodeWithChild: ListNode = {
      ...mockListNode,
      children: [mockDataNode],
    };

    const { getByText } = render(
      <NodeEditor node={mockListNodeWithChild} onUpdate={mockOnUpdate} />
    );

    fireEvent.click(getByText('Remove'));
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockListNodeWithChild,
      children: [],
    });
  });
});
