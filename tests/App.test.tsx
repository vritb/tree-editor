import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../src/App';
import { parseJsonToTree } from '../src/utils/parser';
import { treeToJson } from '../src/utils/exporter';
import { validateJson } from '../src/utils/validate';
import { calculateStats } from '../src/utils/stats';
import fs from 'fs';
import path from 'path';

describe('App Component', () => {
  test('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('Tree')).toBeInTheDocument();
  });

  test('imports JSON and updates tree', async () => {
    const { getByText, getByLabelText } = render(<App />);
    const importButton = getByText('Import JSON');
    const file = new File([JSON.stringify({ name: 'root', children: [] })], 'tree.json', { type: 'application/json' });

    Object.defineProperty(importButton, 'files', {
      value: [file],
    });

    fireEvent.change(importButton);

    await waitFor(() => {
      expect(getByText('root')).toBeInTheDocument();
    });
  });

  test('exports JSON and validates', () => {
    const { getByText } = render(<App />);
    const exportButton = getByText('Export JSON');

    fireEvent.click(exportButton);

    const json = treeToJson(parseJsonToTree({ name: 'root', children: [] }));
    const valid = validateJson(json);

    expect(valid.ok).toBe(true);
  });

  test('handles undo and redo actions', () => {
    const { getByText } = render(<App />);
    const undoButton = getByText('Undo');
    const redoButton = getByText('Redo');

    fireEvent.click(undoButton);
    fireEvent.click(redoButton);

    expect(getByText('Undo action performed')).toBeInTheDocument();
    expect(getByText('Redo action performed')).toBeInTheDocument();
  });

  test('calculates tree statistics', () => {
    const { getByText } = render(<App />);
    const stats = calculateStats(parseJsonToTree({ name: 'root', children: [] }));

    expect(getByText(`Total nodes: ${stats.total}`)).toBeInTheDocument();
    expect(getByText(`Depth: ${stats.maxDepth}`)).toBeInTheDocument();
  });

  test('handles keyboard shortcuts for undo and redo', () => {
    const { getByText } = render(<App />);

    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });

    expect(getByText('Undo action performed')).toBeInTheDocument();
    expect(getByText('Redo action performed')).toBeInTheDocument();
  });

  test('handles empty JSON input for parseJsonToTree', () => {
    expect(() => parseJsonToTree({})).not.toThrow();
  });

  test('handles invalid JSON input for parseJsonToTree', () => {
    expect(() => parseJsonToTree(null)).toThrow('Input is not a valid JSON object');
  });

  test('handles circular references in JSON input for parseJsonToTree', () => {
    const circularObj: any = {};
    circularObj.self = circularObj;
    expect(() => parseJsonToTree(circularObj)).toThrow();
  });

  test('handles large JSON input for parseJsonToTree', () => {
    const largeJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'test-data/large-tree.json'), 'utf-8'));
    expect(() => parseJsonToTree(largeJson)).not.toThrow();
  });

  test('handles empty tree structure for treeToJson', () => {
    const emptyTree = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'test-data/empty-tree.json'), 'utf-8'));
    expect(() => treeToJson(emptyTree)).not.toThrow();
  });

  test('handles tree structure with missing node names for treeToJson', () => {
    const invalidTree = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'test-data/invalid-tree.json'), 'utf-8'));
    expect(() => treeToJson(invalidTree)).toThrow('Node name cannot be an empty string');
  });

  test('handles tree structure with deeply nested nodes for treeToJson', () => {
    const deeplyNestedTree = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'test-data/deeply-nested-tree.json'), 'utf-8'));
    expect(() => treeToJson(deeplyNestedTree)).not.toThrow();
  });

  test('handles importing a JSON file with invalid format', async () => {
    const { getByText, getByLabelText } = render(<App />);
    const importButton = getByText('Import JSON');
    const file = new File(['invalid json'], 'tree.json', { type: 'application/json' });

    Object.defineProperty(importButton, 'files', {
      value: [file],
    });

    fireEvent.change(importButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Import failed: Unexpected token i in JSON at position 0');
    });
  });

  test('handles exporting a tree with invalid structure', () => {
    const { getByText } = render(<App />);
    const exportButton = getByText('Export JSON');

    fireEvent.click(exportButton);

    const invalidTree = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'test-data/invalid-tree.json'), 'utf-8'));
    const valid = validateJson(invalidTree);

    expect(valid.ok).toBe(false);
  });

  test('handles asynchronous operations', async () => {
    const { getByText } = render(<App />);
    const importButton = getByText('Import JSON');
    const file = new File([JSON.stringify({ name: 'root', children: [] })], 'tree.json', { type: 'application/json' });

    Object.defineProperty(importButton, 'files', {
      value: [file],
    });

    fireEvent.change(importButton);

    await waitFor(() => {
      expect(getByText('root')).toBeInTheDocument();
    });
  });
});
