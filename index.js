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
const Io 		= require('socket.io')(Server)/*
const SocketAntiSpam  = require('socket-anti-spam')
*/
/*const socketAntiSpam = new SocketAntiSpam({
    banTime:            30,         // Ban time in minutes
    kickThreshold:      2,          // User gets kicked after this many spam score
    kickTimesBeforeBan: 1,          // User gets banned after this many kicks
    banning:            true,       // Uses temp IP banning after kickTimesBeforeBan
    io:                 Io,  // Bind the socket.io variable
    //redis:              client,      // Redis client if you are sharing multiple servers
})*/

const Chat 		= Io.of('/chat') 
Io.use((socket,next)=>{
  let verifiedHosts = ['clucker.ru']
  let host = socket.handshake.headers.host
  let cofirm = verifiedHosts.filter(el=> el == host)
  if(!(confirm.length > 0)) socket.close()
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