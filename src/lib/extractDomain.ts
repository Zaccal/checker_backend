export function extractDomain(input: string): string {
  try {
    const url = new URL(input);
    return url.hostname;
  } catch {
    return input;
  }
}
