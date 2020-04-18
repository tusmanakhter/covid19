const getKey = (province: string, country: string) => {
  let key: string;
  if (province === "") {
    key = country;
  } else {
    key = `${province}, ${country}`
  }
  return key;
}

export { getKey };
