let Game = require('./engine/Game')
const ScreepsAPI = require('screeps-api')
const auth = require('../auth')
let api = new ScreepsAPI(auth)
api.socket(() => {})

window.Game = Game
module.exports = Game
let GameRooms = {}
window.test = function test(username){
  let rooms,user
  Promise.resolve()
    .then(()=>api.req('GET',`/api/user/find?username=${username}`))
    .then((resp)=>(user=resp.body.user,api.req('GET',`/api/user/rooms?id=${user._id}`)))
    .then((resp)=>(rooms=resp.body.rooms))
    .then(()=>{
      rooms.forEach(r=>api.subscribe(`rooms:${r}`))
    })
}

api.on('message', (msg) => {
  console.log('MSG', msg)
  if (msg.slice(0, 7) == 'auth ok') {
    // api.subscribe('/console')
    // api.subscribe('room:E3N31')      
  }
})

api.on('room', (msg) => {
  let [event,room] = msg
  let [,roomName] = event.split(':')
  if(!GameRooms[roomName])
  {
    GameRooms[roomName] = new Room(roomName,Game.scene)
  }else{
  }
  GameRooms[roomname].setData(room.objects)
  // console.log(JSON.stringify(msg, null, 3))
})
