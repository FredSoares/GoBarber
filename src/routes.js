//import da classe Router do express
const { Router } = require('express')

//instancia da classe Router
const routes = new Router()

//rota raiz
routes.get('/', (req, res)=>{
  return res.json({
    message: "Hello World!"
  })
})

//export do routes
module.exports = routes


