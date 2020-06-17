export function getLastSegment(dataPath) {
  const index = dataPath.lastIndexOf('/');
  if (index !== -1) {
    return dataPath.slice(index + 1);
  }

  return null;
}

const QUOTES = /['"]/g;
const NOT = /NOT/g;
const FIRST_LETTER = /^[a-z]/;

export function cleanAjvMessage(word) {
  return word.replace(QUOTES, '`').replace(NOT, 'not');
}

export function toUpperCase(word) {
  return word.toUpperCase();
}

export function capitalize(word) {
  return word.replace(FIRST_LETTER, toUpperCase);
}
