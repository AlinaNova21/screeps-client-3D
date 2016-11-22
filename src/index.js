let Game = require('./engine/Game')
let Room = require('./engine/Room')
const ScreepsAPI = require('./screepsapi')
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
      rooms.forEach(r=>{
        console.log('Subscribe',r)
        window.subRoom(r) //api.subscribe(`room:${r}`)
      })
    })
}

window.subRoom = function(room){
  api.subscribe(`room:${room}`)
}

api.on('message', (msg) => {
  console.log('MSG', msg)
  if (msg.slice(0, 7) == 'auth ok') {
    // api.subscribe('/console')
    // api.subscribe('room:E3N31')      
  }
})
// let log = (...a)=>console.log(...a)
api.on('room', (msg) => {
  // log(msg)
  let [event,room] = msg
  let [,roomName] = event.split(':')
  if(!GameRooms[roomName])
  {
    console.log('Register room',roomName)
    GameRooms[roomName] = new Room(roomName,Game.scene)
  }
  console.log('Update room',roomName)
  GameRooms[roomName].setData(room.objects)
  // console.log(JSON.stringify(msg, null, 3))
})
