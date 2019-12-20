try{
const clean   = require('./clean.js')
//before starting server we should clean some thins

clean.files()//delete temp files
clean.chaters()//delete chaters from db
//clean.users()

//run server
const env = require('dotenv').config().parsed
const App 		= require('./app')() 
const Server 	= require('http').Server(App) 
const Io 		= require('socket.io')(Server)

const Chat 		= Io.of('/chat')
//middlewares
  //check host
Io.use((socket,next)=>{
  let verifiedHosts = ['clucker.ru','localhost:3000']
  let host = socket.handshake.headers.host
  console.log(verifiedHosts.includes(host))
  if(!verifiedHosts.includes(host))   socket.close()
    next()
})
require('./io').io(Chat) 

Server.listen(env.PORT,()=>{console.log('server started')}) 
}
catch(err){

  console.log(err)

  const log     = require('./mongoose').log
  //save wrongs
  let doc = new log({
    log: err,
  })
  doc.save(()=>{})


}