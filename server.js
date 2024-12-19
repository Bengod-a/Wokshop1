const express = require('express')
const app = express()
const morgan = require('morgan')
const { readdirSync } = require('fs')
const cors = require('cors')
// const authRouter = require('./routes/auts')
// const categoryRouter = require('./routes/category')


app.use(morgan('dev'))
app.use(express.json({limit:'50mb'}))
app.use(cors())


readdirSync('./routes')
.map((c)=> app.use('/api', require('./routes/'+c)) )
// app.use('/api', authRouter)
// app.use('/api',categoryRouter)

// app.post('/api',(req,res)=> {

//     const {username,password} = req.body
//     console.log(username,password);
//     console.log(req.body.email);
//     res.send('Jukkru')
// })

app.listen(3000, () => console.log('Server is running on port 3000'));
