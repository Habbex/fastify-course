const { build } = require('./app.js')
const env = require('./config/env.js')

const app = build({ logger: true }, {
    exposeRoute: true, routePrefix: '/docs', swagger: {
        info: { title: "Fastify API test", version: "1.0.0" }
    }
},{
    connectionString: env.POSTGRES_DB_CONNECTION_STRING
})
console.log(env.POSTGRES_DB_CONNECTION_STRING)
app.get('/time', (request, reply)=>{
    app.pg.connect(OnConnect)

    function OnConnect(err, client, release){
        if(err){
            reply.send(err)
        }

        client.query('SELECT now()', function onResult(err,result){
            release()
            reply.send(err || result.rows[0])
        })
    }
})

// Run
app.listen(env.WEB_APP_HOST_PORT,'0.0.0.0', function (err, address) {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
})
