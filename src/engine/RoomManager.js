const Room = require('./Room')

class RoomManager {
  constructor(scene){
    this.scene = scene
    this.camera = null
    this.rooms = []
  }
  tick(){
    let radius = 4
    let ra = this.rooms.filter(this.farther((radius+3)*50))
    ra.forEach(r=>this.removeRoom(r))
    for(let x=0;x<radius*2;x++){
      for(let y=0;y<radius*2;y++){
        let wx = Math.round(this.camera.position.x / 50) + x - radius
        let wy = Math.round(this.camera.position.z / 50) + y - radius
        if(wx > 50 || wy > 50 || wx < -49 || wy < -49) continue
        let name = Room.toName(wx,wy)
        let room = this.rooms.find(r=>r.roomName == name)
        if(!room){
          room = this.addRoom(name)
        }
      }
    }
  }
  addRoom(name){
    let room = new Room(name,this.scene)
    room.setTerrain()
    this.rooms.push(room)
    return room
  }
  removeRoom(r){
    r.dispose()
    let i = this.rooms.indexOf(r)
    this.rooms.splice(i,1)
  }
  range(r){
    let dx = Math.abs(r.position.x - this.camera.position.x)
    let dy = Math.abs(r.position.z - this.camera.position.z)
    return Math.max(dx,dy)//Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
  }
  within(dist){
    return (r)=>this.range(r)<=dist
  }
  farther(dist){
    return (r)=>this.range(r)>dist
  }
}

module.exports = RoomManager