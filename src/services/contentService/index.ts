export async function fetchContent() {
  const response = await fetch(import.meta.env.BASE_URL + 'content.json');
  if (!response.ok) throw new Error('Failed to load content');
  return response.json();
}

// Fetches thirukkural_complete_nested.json from Common
export async function fetchThirukkuralNested() {
  const response = await fetch(import.meta.env.BASE_URL + 'Common/thirukkural_complete_nested.json');
  if (!response.ok) throw new Error('Failed to load thirukkural_complete_nested.json');
  return response.json();
}