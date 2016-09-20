class Tools {
    constructor(){
        this.cache = {}
    }
    cacheFor(url,usageCount){
        let c = this.cache[url] = this.cache[url] || {}
        c.max = usageCount
    }
    loadImage(url,cb){
        let c = this.cache[url]
        if(c && c.promise){
            c.promise.then(d=>{
                this.loadImage(url,cb)
            })
        }
        if(c && c.buffer){
            let ret = cb(c.buffer)
            if(ret) c.count++
            if(c.max && c.count > c.max) delete this.cache[url]
        }else{
            this.cache[url]  = c = c || { url }
            c.promise = new Promise((resolve,reject)=>{
                require('fs').readFile(url,(err,data)=>{
                    c.buffer = data
                    delete c.promise
                    resolve(data)
                })  
            })
        }
    }
    CreateGroundFromHeightMap(name, url, options, scene) {
            var width = options.width || 10;
            var height = options.height || 10;
            var subdivisions = options.subdivisions || 1;
            var minHeight = options.minHeight;
            var maxHeight = options.maxHeight || 10;
            var updatable = options.updatable;
            var onReady = options.onReady;
            var ground = new BABYLON.GroundMesh(name, scene);
            ground._subdivisions = subdivisions;
            ground._width = width;
            ground._height = height;
            ground._maxX = ground._width / 2;
            ground._maxZ = ground._height / 2;
            ground._minX = -ground._maxX;
            ground._minZ = -ground._maxZ;
            ground._setReady(false);
            let fs = require('fs')
            this.loadImage(url,(buffer)=>{
              var vertexData = BABYLON.VertexData.CreateGroundFromHeightMap({
                    width: width, height: height,
                    subdivisions: subdivisions,
                    minHeight: minHeight, maxHeight: maxHeight,
                    buffer: buffer, bufferWidth: bufferWidth, bufferHeight: bufferHeight
                });
                vertexData.applyToMesh(ground, updatable);
                ground._setReady(true);
                //execute ready callback, if set
                if (onReady) {
                    onReady(ground);
                }  
                return true
            })
            return ground;
        }
    }
module.exports = new Tools()