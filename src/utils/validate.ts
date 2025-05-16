export function validateJson(json: any): { ok: boolean; error?: string } {
  try {
    JSON.stringify(json)
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export function validateJsonInput(input: any): { ok: boolean; error?: string } {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: 'Input is not a valid JSON object' };
  }
  return { ok: true };
}
