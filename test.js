
var app = require('koa')()
var router = require('koa-router')()
var json = require('koa-json')

var routes = require('./routes')

var parser = require('koa-body-parser')

routes.install(router)

app.use(json())
   .use(parser())
   .use(router.routes())
   .use(router.allowedMethods());
app.listen(8001)
