const {build} = require('./app')

const app = build({logger: true}, {connectionString: 'postgres://postgres:postgres@localhost:5432/library'})

app.listen({port: 3000}, (err)=>{
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
})