class RoomObject extends BABYLON.Mesh {
  constructor(name,scene){
    super(name,scene)
    this.data = {}
    this.renderObj = null
    this.isVisible = false
  }

  tick(dt){

  }

  setData(data){
    for(let k in data)
      this.data[k] = data
    if(typeof data.x != 'undefined') this.position.x = data.x
    if(typeof data.y != 'undefined') this.position.z = -data.y
  }

  destroy(){
    this.renderObj.dispose()
  }
}
module.exports = RoomObject