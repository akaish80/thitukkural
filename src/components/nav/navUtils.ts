
// Add icons to menu items
export const getIcon = (text: string) => {
  const lower = text.toLowerCase();
  if (lower === 'home') {
    return '🏠';
  } else if (lower === 'thirukurral') {
    return '📖';
  } else if (lower === 'practice') {
    return '✍️';
  } else {
    return '📄';
  }
};