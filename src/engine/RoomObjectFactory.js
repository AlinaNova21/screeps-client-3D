const RoomObject = require('./RoomObject')

class RoomObjectFactory {
  constructor(){

  }
  create(obj,scene) {
    let ro = new RoomObject(obj._id,scene); //new require(`./objects/${obj.type}`)
    ro.setData(obj)
    // console.log("Creating",obj.type,obj)
    switch(obj.type){
      case 'creep':
        ro.body = new BABYLON.Mesh.CreateCylinder(obj._id,0.3,0.4,0.5,24,1,scene)
        ro.body.position.y = 0.15
        ro.body.parent = ro
        break;
      default:
        ro.body = new BABYLON.Mesh.CreateBox(obj._id,1,scene)
        ro.body.position.y = 0.5
        ro.body.parent = ro
        break;
    }
    return ro
  }
}

module.exports = RoomObjectFactory
