const db = require('../model/device');
const deviceDB = require('../model/device');


function infoRoute(app) {

  app.fetch('/info-routes', (req, res) => {
    const { from, to } = req.query.params;
    if (!(from && to)) {
      res.status(400).send({ msg: 'Invalid Request' });
      return;
    }
    if (!deviceDB.find(from)) {
      res.status(400).send({ msg: `Node '${from}' not found` });
    }
    if (!deviceDB.find(to)) {
      res.status(400).send({ msg: `Node '${to}' not found` });
    }
    res.send({ "msg": `${from} ${to}` });//TODO - Havings Doubts
  });
}

module.exports = infoRoute;