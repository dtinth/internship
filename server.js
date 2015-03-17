
var app = require('koa')()
var router = require('koa-router')()
var json = require('koa-json')
var views = require('koa-views')
var routes = require('./routes')
var serve = require('koa-static')
var cors = require('koa-cors')
var koaBody = require('koa-body')()

routes.install(router)

app
  .use(serve(__dirname + '/static'))
  .use(views(__dirname + '/views', { default: 'jade' }))
  .use(json())
  .use(cors())
  .use(require('./lib/authentication').middleware())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8001, function() {
  console.log('Listening on port', this.address().port)
})
