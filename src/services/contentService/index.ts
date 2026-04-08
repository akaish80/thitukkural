import fetchWrapper from '../../utils/fetchWrapper';

export async function fetchContent() {
  return fetchWrapper(import.meta.env.BASE_URL + 'content.json');
}

// Fetches thirukkural_complete_nested.json from Common
export async function fetchThirukkuralNested() {
  return fetchWrapper(import.meta.env.BASE_URL + 'Common/thirukkural_complete_nested.json');
}