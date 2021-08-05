const transpose = (arr) =>
  arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));

function formatDate(datetime) {
  return moment(datetime).format("DD/MM/yyyy, hh:mm:ss");
}
