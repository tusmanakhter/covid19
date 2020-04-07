const getKey = (value) => {
  return value.replace(/-|–| |'|’/g, '').toLowerCase();
}

const getRegionKey = (value) => {
  value = value.replace(/-|–| |'|’/g, '').toLowerCase();
  value = value.replace(/saint/g, 'st');
  if (value === 'centreduquébec' || value === 'mauricie') {
    value = 'mauricieetcentreduquébec';
  }
  return value;
}

export default getKey;
export { getRegionKey };
