const getKey = (value) => {
  return value.replace(/-|–| |'|’/g, '').toLowerCase();
}

export default getKey;
