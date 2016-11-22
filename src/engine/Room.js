const BLANK_TERRAIN = '0'.repeat(2500)
const Tools = require('./Tools')
const RoomObjectFactory = require('./RoomObjectFactory')

class Room extends BABYLON.Mesh {
  static toName(x,y){
    let name = ''
    x = Math.round(x)
    y = Math.round(y)
    y--
    name += x<=0?`W${-x}`:`E${x-1}`
    name += y<=0?`S${-y}`:`N${y-1}`
    return name
  }
  static parseName(name){
    let [,dirx,x,diry,y] = name.match(/^([WE])(\d+)([NS])(\d+)$/)
    if(dirx == 'W')
      x = -x - 1
    if(diry == 'S')
      y = -y - 1
    y++
    return { x, y }
  }
  constructor(name,scene){
    super(name,scene)
    this.isVisible = false
    this.roomName = name
    this.terrain = BLANK_TERRAIN
    this.root = null
    this.objects = {}
    this.rof = new RoomObjectFactory()
    this.scene = scene
    let {x,y} = Room.parseName(name)
    this.position.x = x * 50
    this.position.z = y * 50
    this.position.y = 27
    // this.createLabel()
  }
  dispose(){
    if(this.ground){
      let mat = this.ground.material
      let tex = mat.diffuseTexture
      this.ground.dispose()
      this.ground.material = null
      mat.diffuseTexture = null
      mat.dispose()
      tex.dispose()
    }
    if(this.plane){
      let mat = this.plane.material
      let tex = mat.diffuseTexture
      this.label.dispose()
      this.label.material = null
      mat.diffuseTexture = null
      mat.dispose()
      tex.dispose()
    }
  }
  createLabel(){
    let plane = BABYLON.Mesh.CreatePlane(`${this.roomName}_label_plane`,25,this.scene,false)
    plane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL
    plane.material = new BABYLON.StandardMaterial(`${this.roomName}_label_plane`, this.scene);
    plane.position = new BABYLON.Vector3(24.5, 10, -24.5);
    plane.scaling.y = 0.2;

    let texture = new BABYLON.DynamicTexture(`${this.roomName}_label_texture`,512,this.scene,true)
    plane.material.diffuseTexture = texture;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    plane.material.backFaceCulling = true;

    texture.drawText(this.roomName,null,140,"bold 100px verdana","white",null)
    plane.parent = this
    this.label = plane
  }
  setTerrain(terrain){
    this.terrain = terrain
    // let ground = BABYLON.Mesh.CreateGroundFromHeightMap(`${this.roomName}_terrain`,`map3/${this.roomName}.heightmap.png`,50,50,50,0,5,this.scene)
    
    let texture = new BABYLON.Texture(`map2/${this.roomName}.png`,this.scene)
    texture.uScale = 0.98 //1.02
    texture.vScale = 0.98 //1.02
    texture.uOffset = 0.005
    texture.vOffset = 0.015
    // let texture = new BABYLON.Texture(`final.png`,this.scene)
    // let x = (this.position.x/50) / 61
    // let y = (this.position.x/50) / 61
    // texture.uOffset = x
    // texture.vOffset = y
    // texture.uScale = 1/61
    // texture.vScale = 1/61
    let material = new BABYLON.StandardMaterial(`${this.roomName}_terrain`, this.scene);
    material.diffuseTexture = texture
    material.specularColor = new BABYLON.Color3(0.00, 0.00, 0.00);
    let ground0 = BABYLON.Mesh.CreateGroundFromHeightMap(`${this.roomName}_terrain0`,`heightmap/${this.roomName}.png`,50,50,50,0,5,this.scene,false,(gm)=>{
      
    })
    // let ground1 = BABYLON.Mesh.CreateGroundFromHeightMap(`${this.roomName}_terrain1`,`heightmap/${this.roomName}.png`,50,50,25,0,5,this.scene)
    // let ground2 = BABYLON.Mesh.CreateGroundFromHeightMap(`${this.roomName}_terrain2`,`heightmap/${this.roomName}.png`,50,50,10,0,5,this.scene)
    // let ground3 = BABYLON.Mesh.CreateGroundFromHeightMap(`${this.roomName}_terrain3`,`heightmap/${this.roomName}.png`,50,50,5,0,5,this.scene)
    ground0.position.x = 24.5
    ground0.position.z = -24.5
    ground0.position.y = -0.8
    ground0.material = material
    // ground1.material = material
    // ground2.material = material
    // ground3.material = material
    // ground0.addLODLevel(50*3,ground1)
    // ground0.addLODLevel(50*5,ground2)
    // ground0.addLODLevel(50*10,ground3)
    // ground0.addLODLevel(50*20,null)
    ground0.parent = this
    this.ground = ground0
  }
  setData(data){
    for(let k in data){
      let obj = this.objects[k]
      if(obj && data[k] === null){
        this.objects[k].parent = null
        obj.destroy()
        delete this.objects[k]
      }
      if(obj){
        obj.setData(data[k])
      }else{
        this.objects[k] = this.rof.create(data[k],this.scene)
        this.objects[k].parent = this
      }
    }
  }
}

module.exports = Room