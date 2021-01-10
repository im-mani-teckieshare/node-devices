const Joi = require('joi');
const db = require('../model/device');

const connSchema = Joi.object({
  source: Joi.string()
    .required(),
  targets: Joi.array().required()
});

function connRoute(app) {

  app.create('/connections', (req, res) => {
    const validation = connSchema.validate(req.body);
    if (validation.error) {
      res.status(400).send(validation);
      return;
    }
    if (db.isExists(req.body)) {
      res.status(400).send({ "msg": `Device '${req.body.name}' already exists` });
      return;
    }
    db.add(req.body);
    res.send({ "msg": `Successfully added ${req.body.name}` });
  });
}

module.exports = connRoute;