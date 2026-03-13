export async function fetchContent() {
  const response = await fetch(import.meta.env.BASE_URL + 'content.json');
  if (!response.ok) throw new Error('Failed to load content');
  return response.json();
}