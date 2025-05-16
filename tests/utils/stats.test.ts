import { calculateStats } from '../../src/utils/stats';
import { TreeNode, RootNode } from '../../src/types/nodes';

describe('calculateStats', () => {
  it('should calculate statistics for a tree structure', () => {
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
    const stats = calculateStats(tree);
    expect(stats.total).toBe(3);
    expect(stats.maxDepth).toBe(3);
    expect(stats.counts.root).toBe(1);
    expect(stats.counts.object).toBe(1);
    expect(stats.counts.data).toBe(1);
  });

  it('should handle empty tree structure', () => {
    const tree: RootNode = {
      id: '1',
      type: 'root',
      children: [],
    };
    const stats = calculateStats(tree);
    expect(stats.total).toBe(1);
    expect(stats.maxDepth).toBe(1);
    expect(stats.counts.root).toBe(1);
    expect(stats.counts.object).toBe(0);
    expect(stats.counts.data).toBe(0);
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
    const stats = calculateStats(tree);
    expect(stats.total).toBe(4);
    expect(stats.maxDepth).toBe(4);
    expect(stats.counts.root).toBe(1);
    expect(stats.counts.object).toBe(2);
    expect(stats.counts.data).toBe(1);
  });

  it('should handle tree structure with missing node names', () => {
    const tree: RootNode = {
      id: '1',
      type: 'root',
      children: [
        {
          id: '2',
          type: 'object',
          name: '',
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
    const stats = calculateStats(tree);
    expect(stats.total).toBe(3);
    expect(stats.maxDepth).toBe(3);
    expect(stats.counts.root).toBe(1);
    expect(stats.counts.object).toBe(1);
    expect(stats.counts.data).toBe(1);
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
    const stats = calculateStats(tree);
    expect(stats.total).toBe(4);
    expect(stats.maxDepth).toBe(3);
    expect(stats.counts.root).toBe(1);
    expect(stats.counts.object).toBe(1);
    expect(stats.counts.data).toBe(2);
  });
});
