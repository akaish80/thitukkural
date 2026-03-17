export function searchLocalData(query: string) {
  const normalizedQuery = query.toLowerCase().trim();
  return { query: normalizedQuery, results: [] };
}