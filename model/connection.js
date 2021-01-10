let arr = [];
const indexMap = {};
const app = {};

app.add = (device) => {
  indexMap[device.name] = arr.length;
  arr.push(device);
};

app.findAll = () => {
  return [...arr];
}

app.isExists = (device) => {
  return indexMap[device.name] && true;
}

app.find = (deviceName) => {
  return arr[indexMap[deviceName]];
}


module.exports = app;