const express = require('express')

let app = express()

app.use('/node_modules', express.static('./node_modules/'))
app.use(express.static('./public'))
app.use(express.static('./src'))

app.listen(process.env.PORT || 8080, () => {
  console.log('listening')
})
