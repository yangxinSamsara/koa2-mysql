const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const MysqlStore = require('koa-mysql-session')
const session = require('koa-session-minimal')
const views = require('koa-views')
const ejs = require('ejs')
const cors = require('koa2-cors')
const path = require('path')
const config = require('./config/index')
const register = require('./routers/register')
const singin = require('./routers/singin')

const app = new Koa();

const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST
}

app.use(session({
    key: 'USER_SESSION',
    store: new MysqlStore(sessionMysqlConfig)
}))

app.use(views(path.join(__dirname, './views'), { extension: 'ejs' }))

app.use(bodyParser())
app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return 'http://localhost:3333';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

app.use(register.routes())
app.use(singin.routes())

app.listen(config.port, () => {
    console.log(`${config.port} running`)
})