const Koa = require('koa');
const path = require('path');
const ejs = require('ejs');
const views = require('koa-views'); // 模板呈现中间件
const router = require('koa-router'); // 路由中间件
const bodyParser = require('koa-bodyparser'); // 表单解析中间件
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session'); // 处理数据库的中间件
const staticCache = require('koa-static-cache'); // 文件缓存
const config = require('./config/default.js');
// const koaStatic = require('koa-static') //  静态资源加载中间件
const app = new Koa();


// session存储配置
const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

// 配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}))


// 配置静态资源加载中间件
// app.use(koaStatic(
//   path.join(__dirname , './public')
// ))
// 缓存
app.use(staticCache(path.join(__dirname, './public'), {
    dynamic: true
}, {
    maxAge: 365 * 24 * 60 * 60
}))
app.use(staticCache(path.join(__dirname, './images'), {
    dynamic: true
}, {
    maxAge: 365 * 24 * 60 * 60
}))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))
app.use(bodyParser({
    formLimit: '1mb'
}))

//  路由
app.use(require('./routers/singnin.js').routes())
app.use(require('./routers/signup.js').routes())
app.use(require('./routers/posts.js').routes())
app.use(require('./routers/signout.js').routes())


app.listen(config.port)

// console.log(`listening on port ${config.port}`)
console.log(`Server running at http://127.0.0.1:${config.port}/`);