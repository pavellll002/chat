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
const Sp    = require('socket-protect')

const defaultOpts = {
  origin: [],
  secure: false,
  xdomain: false,
  debug: false,
  ipLimit: 0,
  login: {
    required: false,
    loginfn: ()=>{},
    timeout: 3000 // 3 seconds
  },
  ddos: {
    enabled: true,
    timeout: 50 // 50 ms
  }
} 
 
const Chat 		= Io.of('/chat') 

Io.use((socket, next) => {
  Sp.protectHandshake(Io, socket, defaultOpts) 
  next() 
}) 

require('./io').io(Chat, Sp, defaultOpts) 

Server.listen(env.PORT,()=>{console.log('server started1')}) 
}
catch(err){


  const log     = require('./mongoose').log
  //save wrongs
  let doc = new log({
    log: err,
  })
  doc.save(()=>{})


}