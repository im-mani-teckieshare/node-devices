const app = require('./lib/mapper');
const deviceMapper = require('./mapper-router/device-route');

app.route(deviceMapper);


app.listen(8080);