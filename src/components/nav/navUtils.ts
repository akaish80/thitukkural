
// Add icons to menu items
export const getIcon = (text: string) => {
  const lower = text.toLowerCase();
  if (lower === 'home') {
    return '🏠';
  } else if (lower === 'thirukurral' || lower === 'kurral') {
    return '📖';
  } else if (lower === 'explore kurral') {
    return '🔍';
  } else if (lower === 'practice' || lower === 'practice writing tamil') {
    return '✍️';
  } else if (lower === 'excercise kurral') {
    return '🎯';
  } else if (lower === 'aathichudi') {
    return '🪔';
  } else {
    return '📄';
  }
};