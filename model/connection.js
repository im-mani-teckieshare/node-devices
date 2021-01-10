const deviceDB = require('./device');
let connMap = {};
const app = {};

app.add = (source, target) => {
  if (connMap[source]) {
    connMap[source].push(...target);
  } else {
    connMap[source] = [...target];
  }
};

app.validate = (source, target) => {
  const err = { err: false, msg: '' }

  if (!deviceDB.isExists({ name: source })) {
    err.err = true;
    err.msg = `Node '${source}' not found`
    return err;
  }

  if (target.findIndex(e => e === source) !== -1) {
    err.err = true;
    err.msg = "Cannot connect device to itself"
    return err;
  }

  for (device of target) {
    if (!deviceDB.isExists({ name: device })) {
      err.err = true;
      err.msg = `Node '${device}' not found`
      return err;
    }
    if (connMap[source]) {
      if (connMap[source].findIndex(e => e === device) !== -1) {
        err.err = true;
        err.msg = "Devices are already connected"
        return err;
      }
    }
  }
  return err;
}
app.find = () => {
  return connMap;
}


module.exports = app;