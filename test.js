
var app = require('koa')()
var router = require('koa-router')()
var json = require('koa-json')

var routes = require('./routes')

route.install(router)

app.use(json())
   .use(router.routes())
   .use(router.allowedMethods());

app.listen(8001)
