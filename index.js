const Koa = require('koa')
const static = require("koa-static")
const msgpack = require('msgpackr')
const msgBody = require('./libs/msgpack')

const app = new Koa()

app.use(static(__dirname + "/public"));
app.use(msgBody())
app.use(async ctx => {
  if (ctx.request.body) {
    console.log(1212, ctx.request.body)
    const datas = msgpack.unpack(ctx.request.body)
    console.log(1313, datas)
    ctx.body = datas
  } else {
    ctx.status = 404
  }
})

app.listen(3000)
