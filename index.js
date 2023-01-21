const express = require('express');
require('dotenv').config()
const router = require('./router/router');

const port = process.env.PORT || 4000

const app = express()
app.use(express.json())
app.use(router)

app.listen(port, ()=> console.log(`Listening PORT: ${port}`))



