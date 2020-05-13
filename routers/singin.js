const { query } = require('../lib/mysql')
const router = require('koa-router')()
const md5 = require('md5')

router.get('/singin', async (ctx, next) => {
    await ctx.render('singin', { session: ctx.session })
})

router.post('/singin', async (ctx, next) => {
    let { name, password } = ctx.request.body;
    let sql = `select * from users where name="${name}"`

    await query(sql).then(res => {
        if (res[0].name === name && res[0].password === md5(password)) {
            ctx.session = {
                user: res[0].name,
                id: res[0].id
            }
            ctx.body = {
                code: 200,
                data: true
            }
        } else {
            ctx.body = {
                code: 2,
                data: false
            }
        }
    })
})

router.get('/', async (ctx, next) => {
    await ctx.render('index', { session: ctx.session })
})

module.exports = router;