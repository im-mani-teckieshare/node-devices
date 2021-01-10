const app = require('./lib/mapper');
const deviceMapper = require('./mapper-router/device-route');
const connMapper = require('./mapper-router/connection-route');
const infoMapper = require('./mapper-router/info-route');

app.route(deviceMapper);
app.route(connMapper);
app.route(infoMapper);


app.listen(8080);