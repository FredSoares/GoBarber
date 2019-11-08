const express = require('express')
const routes = require('./routes')

class App {
  //metodo que será chamado na inicialização da classe
  //possui todas as configurações necessarias
  constructor() {
    this.server = express()
    //inicialização dos metodos 
    this.middleware()
    this.routes()
  }

  middleware(){
    //config para receber requisicoes no formato JSON
    this.server.use(express.json())
  }

  routes(){
    //utiliza rotas do arquivo routes
    this.server.use(routes)
  }
}
//export da classe para que possa ser utilizada por outras classes
//PS: App().server como é a unica coisa que será utilizado foi passado diretamente
module.exports = new App().server 