
// Add icons to menu items
export const getIcon = (text: string) => {
  const lower = text.toLowerCase();
  if (lower === 'home') {
    return '🏠';
  } else if (lower === 'thirukkural') {
    return '📖';
  } else if (lower === 'thirukurral' || lower === 'kurral') {
    return '📖';
  } else if (lower === 'explore kurral') {
    return '🔍';
  } else if (lower === 'practice writing tamil') {
    return '✍️';
  } else if (lower === 'draw tamil letters') {
    return '🎨';
  } else if (lower === 'tamil letter') {
    return '✍️';
  } else if (lower === 'learn tamil') {
    return '🧠';
  } else if (lower === 'image & letter recognition' || lower === 'image recognition') {
    return '🖼️';
  } else if (lower === 'printable picture chart') {
    return '🖨️';
  } else if (lower === 'excercise kurral') {
    return '🎯';
  } else if (lower === 'aathichudi') {
    return '🪔';
  } else if (lower === 'about') {
    return 'ℹ️';
  } else if (lower === 'contact') {
    return '✉️';
  } else if (lower === 'tamil numbers') {
    return '🔢';
  } else if (lower === 'learning path') {
    return '🛤️';
  } else if (lower === 'planner') {
    return '🗓️';
  } else if (lower === 'tamil evaluation') {
    return '🧪';
  } else if (lower === 'tamil letters') {
    return '✍️';
  } else if (lower === 'exercise kurral') {
    return '🎯';
  } else {
    return '📄';
  }
};