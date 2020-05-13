const router = require('koa-router')()
const { query } = require('../lib/mysql.js')
const md5 = require('md5')
router.post('/register', async (ctx, next) => {
    let { name, password } = ctx.request.body;
    let sql = `select * from users where name="${name}"`
    let user = await query(sql).then(res => {
        return res
    })
    if (user.length > 0) {
        ctx.body = {
            code: 200,
            data: '用户已存在'
        }
    } else {
        // 注册插入数据
        password = md5(password)
        let sql = `insert into users (name,password) values ('${name}','${password}');`
        await query(sql).then(r => {
            ctx.body = {
                code: 200,
                data: 'register success'
            }
        })
    }


})
router.get('/register', async (ctx, next) => {
    await ctx.render('register', { session: ctx.session })
})
module.exports = router