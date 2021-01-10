const Joi = require('joi');
const db = require('../model/device');

const deviceSchema = Joi.object({
  type: Joi.string()
    .valid('COMPUTER', 'REPEATER')
    .uppercase()
    .required(),
  name: Joi.string().min(1).required()
});

const strengthSchema = Joi.object(
  {
    value: Joi.number().min(0).required()
  }
)

function deviceRoute(app) {

  app.create('/devices', (req, res) => {
    const { type, name } = req.body;
    if (!(type && name)) {
      res.status(400).send({ msg: "Invalid command syntax" });
      return;
    }
    const validation = deviceSchema.validate(req.body);
    if (validation.error) {
      res.status(400).send({ msg: validation.error.details[0].message });
      return;
    }
    if (db.isExists(req.body)) {
      res.status(400).send({ "msg": `Device '${req.body.name}' already exists` });
      return;
    }
    db.add(req.body);
    res.send({ "msg": `Successfully added ${req.body.name}` });
  });

  app.fetch('/devices', (req, res) => {
    res.send(db.findAll());
  });

  app.modify('/devices/:name/strength', (req, res) => {
    const name = req.params.name;
    let target = db.find(name);
    if (!target) {
      res.status(404).send({ "msg": "Device Not Found" });
      return;
    }
    const validation = strengthSchema.validate(req.body);
    if (validation.error) {
      res.status(400).send({ msg: validation.error.details[0].message });
      return;
    }
    if (target.type === 'REPEATER') {
      res.status(400).send({ "msg": "Device Not Supported" });
      return;
    }
    res.send({ "msg": "Successfully defined strength" });
  });
}

module.exports = deviceRoute;