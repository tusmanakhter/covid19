const si = [
  { value: 1, symbol: "" },
  { value: 1E3, symbol: "k" },
  { value: 1E6, symbol: "M" },
  { value: 1E9, symbol: "B" },
];

const nFormatter = (num, digits) => {
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }

  return parseFloat((num / si[i].value).toFixed(digits)).toLocaleString() + si[i].symbol;
}

export { nFormatter }
