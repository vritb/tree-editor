import { validateJson, validateJsonInput } from '../../src/utils/validate';

describe('validateJson', () => {
  it('should return ok for valid JSON', () => {
    const json = { key: 'value' };
    const result = validateJson(json);
    expect(result.ok).toBe(true);
  });

  it('should return error for circular reference', () => {
    const json: any = {};
    json.self = json;
    const result = validateJson(json);
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should return error for invalid JSON structure', () => {
    const json = { key: undefined };
    const result = validateJson(json);
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('validateJsonInput', () => {
  it('should return ok for valid JSON object', () => {
    const input = { key: 'value' };
    const result = validateJsonInput(input);
    expect(result.ok).toBe(true);
  });

  it('should return error for non-object input', () => {
    const input = 'string';
    const result = validateJsonInput(input);
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Input is not a valid JSON object');
  });

  it('should return error for null input', () => {
    const input = null;
    const result = validateJsonInput(input);
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Input is not a valid JSON object');
  });

  it('should return ok for empty object input', () => {
    const input = {};
    const result = validateJsonInput(input);
    expect(result.ok).toBe(true);
  });

  it('should return ok for array input', () => {
    const input = [];
    const result = validateJsonInput(input);
    expect(result.ok).toBe(true);
  });
});
