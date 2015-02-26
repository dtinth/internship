
var app = require('koa')()
var router = require('koa-router')()
var json = require('koa-json')
var views = require('koa-render')
var routes = require('./routes')

var parser = require('koa-body-parser')

//before
app.use(views('./views','jade'))

routes.install(router)

//after
app.use(json())
   .use(parser())
   .use(router.routes())
   .use(router.allowedMethods());
app.listen(8001)
