import { treeToJson } from '../../src/utils/exporter';
import { TreeNode, RootNode } from '../../src/types/nodes';

describe('treeToJson', () => {
  it('should convert a tree structure to JSON', () => {
    const tree: RootNode = {
      id: '1',
      type: 'root',
      children: [
        {
          id: '2',
          type: 'object',
          name: 'child1',
          children: [
            {
              id: '3',
              type: 'data',
              name: 'grandchild1',
              value: 'value1',
            },
          ],
        },
      ],
    };
    const json = treeToJson(tree);
    expect(json).toEqual({
      child1: {
        grandchild1: 'value1',
      },
    });
  });

  it('should handle empty tree structure', () => {
    const tree: RootNode = {
      id: '1',
      type: 'root',
      children: [],
    };
    const json = treeToJson(tree);
    expect(json).toEqual({});
  });

  it('should handle tree structure with missing node names', () => {
    const tree: RootNode = {
      id: '1',
      type: 'root',
      children: [
        {
          id: '2',
          type: 'object',
          children: [
            {
              id: '3',
              type: 'data',
              value: 'value1',
            },
          ],
        },
      ],
    };
    expect(() => treeToJson(tree)).toThrow('Node name cannot be an empty string');
  });

  it('should handle tree structure with duplicate node names', () => {
    const tree: RootNode = {
      id: '1',
      type: 'root',
      children: [
        {
          id: '2',
          type: 'object',
          name: 'child1',
          children: [
            {
              id: '3',
              type: 'data',
              name: 'grandchild1',
              value: 'value1',
            },
            {
              id: '4',
              type: 'data',
              name: 'grandchild1',
              value: 'value2',
            },
          ],
        },
      ],
    };
    const json = treeToJson(tree);
    expect(json).toEqual({
      child1: {
        grandchild1: 'value2',
      },
    });
  });

  it('should handle tree structure with deeply nested nodes', () => {
    const tree: RootNode = {
      id: '1',
      type: 'root',
      children: [
        {
          id: '2',
          type: 'object',
          name: 'child1',
          children: [
            {
              id: '3',
              type: 'object',
              name: 'grandchild1',
              children: [
                {
                  id: '4',
                  type: 'data',
                  name: 'greatGrandchild1',
                  value: 'value1',
                },
              ],
            },
          ],
        },
      ],
    };
    const json = treeToJson(tree);
    expect(json).toEqual({
      child1: {
        grandchild1: {
          greatGrandchild1: 'value1',
        },
      },
    });
  });
});
