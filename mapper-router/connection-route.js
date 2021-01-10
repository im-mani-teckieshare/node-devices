const Joi = require('joi');
const db = require('../model/connection');

const connSchema = Joi.object({
  source: Joi.string()
    .required(),
  targets: Joi.array().required()
});

function connRoute(app) {

  app.create('/connections', (req, res) => {
    let { source, targets } = req.body;
    const validation = connSchema.validate(req.body);
    if (!(source && targets)) {
      res.status(400).send({ msg: "Invalid command syntax" });
      return;
    }
    if (validation.error) {
      res.status(400).send({ msg: validation.error.details[0].message });
      return;
    }
    const result = db.validate(source, targets);
    if (result.err) {
      res.status(400).send({ msg: result.msg });
      return;
    }
    db.add(source, targets);
    res.send({ "msg": "Successfully connected" });
  });
}

module.exports = connRoute;