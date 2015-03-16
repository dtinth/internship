
var app = require('koa')()
var router = require('koa-router')()
var json = require('koa-json')
var views = require('koa-render')
var routes = require('./routes')
var serve = require('koa-static')
var cors = require('koa-cors')
var koaBody = require('koa-body')()

//before
app.use(serve(__dirname+'/public'))
app.use(views('./public','jade'))
routes.install(router)

//after
app.use(json())
   .use(cors())
   .use(router.routes())
   .use(router.allowedMethods())
app.listen(8001)
