import { parseJsonToTree } from '../../src/utils/parser';
import { RootNode, TreeNode } from '../../src/types/nodes';

describe('parseJsonToTree', () => {
  it('should parse a valid JSON object into a tree structure', () => {
    const input = { name: 'root', children: [{ name: 'child1' }, { name: 'child2' }] };
    const tree = parseJsonToTree(input);
    expect(tree).toBeDefined();
    expect(tree.type).toBe('root');
    expect(tree.children.length).toBe(2);
  });

  it('should handle empty JSON input', () => {
    const input = {};
    const tree = parseJsonToTree(input);
    expect(tree).toBeDefined();
    expect(tree.type).toBe('root');
    expect(tree.children.length).toBe(0);
  });

  it('should handle invalid JSON input', () => {
    const input = 'invalid';
    expect(() => parseJsonToTree(input)).toThrow('Input is not a valid JSON object');
  });

  it('should handle circular references in JSON input', () => {
    const input: any = { name: 'root' };
    input.self = input;
    expect(() => parseJsonToTree(input)).toThrow();
  });

  it('should handle large JSON input', () => {
    const input = { name: 'root', children: Array.from({ length: 1000 }, (_, i) => ({ name: `child${i}` })) };
    const tree = parseJsonToTree(input);
    expect(tree).toBeDefined();
    expect(tree.type).toBe('root');
    expect(tree.children.length).toBe(1000);
  });
});
