export function getLastSegment(instancePath) {
  const index = instancePath.lastIndexOf('/');
  if (index !== -1) {
    return instancePath.slice(index + 1);
  }

  return null;
}

const QUOTES = /['"]/g;
const NOT = /NOT/g;
const FIRST_LETTER = /^[a-z]/;

export function cleanAjvMessage(word) {
  return word.replace(QUOTES, '"').replace(NOT, 'not');
}

export function toUpperCase(word) {
  return word.toUpperCase();
}

export function capitalize(word) {
  return word.replace(FIRST_LETTER, toUpperCase);
}
