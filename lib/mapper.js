const express = require('express');
const bodyParser = require('body-parser');
const queryString = require('query-string');
const { EventEmitter } = require('events');
const { match: regexp } = require("path-to-regexp");
const emitter = new EventEmitter();
const expressApp = express();
const app = {};
const _routes = [];

function register(url, callbackFn) {
  _routes.push(url);
  emitter.on(url, callbackFn);
}
expressApp.use(bodyParser.text());

expressApp.post('/api/v1', (req, res, next) => {
  handle([req, res, next]);
})

expressApp.use((req, res) => {
  res.status(404).send('Route Not Found')
})

function execute(req, res, next) {
  findRoute(req, next);
  if (req.path)
    emitter.emit(req.path, req, res, next);
}
app.create = (url, callbackFn) => {
  register('/create' + url, callbackFn);
}

app.modify = (url, callbackFn) => {
  register('/modify' + url, callbackFn);
}
app.fetch = (url, callbackFn) => {
  register('/fetch' + url, callbackFn);
}
app.delete = (url, callbackFn) => {
  register('/delete' + url, callbackFn);
}

app.route = (routerFn) => {
  routerFn(app);
}

function handle([nativeReq, ...args]) {
  const req = {};
  req.query = {};
  req.params = {};
  req.body = {};
  let input = nativeReq.body.split(/\n/);
  let commandArray = input[0].split(/\s/);
  commandArray[0] = '/' + commandArray[0].trim().toLowerCase();
  commandArray[1] = commandArray[1].trim()
  const query = queryString.parseUrl(commandArray.join(''));
  req.url = query.url;
  req.query.params = query.query;
  if (input[1]) {
    const mimeTypes = (input[1].replace(/\s/g, '') || '').split(':');
    if (mimeTypes.length === 2) {
      req[mimeTypes[0]] = mimeTypes[1];
      const body = input[3] || "";
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
    }
  }
  execute(req, ...args);
}

app.listen = (port = 8080) => {
  expressApp.listen(port);
}

const findRoute = (req, next) => {
  let target = null;
  for (routeUrl of _routes) {
    const match = regexp(routeUrl, { decode: decodeURIComponent });
    target = match(req.url);
    if (target) {
      req.path = routeUrl;
      break;
    }
  }
  if (!target) {
    next();
    return;
  }
  req.params = { ...target.params };
}
module.exports = app;