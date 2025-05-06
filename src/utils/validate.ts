export function validateJson(json: any): { ok: boolean; error?: string } {
  try {
    JSON.stringify(json)
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
