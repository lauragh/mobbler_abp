import { mat4 } from 'gl-matrix';
import {RCamera, Recurso, RMalla, RMaterial, RShader, RTextura} from './recurso'

class gestorRecursos{
    // private recursos: Recurso[]; // recursos en memoria
    
    private mallas: RMalla[] = [];
    private materiales: RMaterial[] = [];
    private texturas: RTextura[] = [];
    // private shaders:RShader[];
    private shaders:RShader;
    private camera:RCamera;

    constructor(gl:WebGL2RenderingContext){
        this.shaders = new RShader("Shaders basicos");
        this.camera = new RCamera("FPS Camera");
    }

    getAllMeshs():RMalla[]{
        return this.mallas;
    }

    getMesh(id){
        

        for(let i  = 0; i < this.mallas.length; i++){
            if( this.mallas[i].getId() == id){
                //console.log('La malla que pillas es esta owo'+id);
                return this.mallas[i];
            }
        }

        
    }

    getCamera():RCamera {
        return this.camera;
    }

    clearObjects(){
        this.mallas = [];
    }

    async loadObject(nombre:string, id?:number){
        //console.log("El objeto leido en json: ");
        //console.log("/assets/models/" + nombre+"/"+ nombre +".json");
        var newMalla:RMalla;
        if(id){
            //console.log("Le va a llegar el id: ", id);
            newMalla = new RMalla(nombre, id);
        }else{
            newMalla = new RMalla(nombre);
        }
        var file = await this.readFileJSON("/assets/models/" + nombre+"/"+ nombre +".json");
        var colors = [
            5,3,7, 5,3,7, 5,3,7, 5,3,7,
            1,1,3, 1,1,3, 1,1,3, 1,1,3,
            0,0,1, 0,0,1, 0,0,1, 0,0,1,
            1,0,0, 1,0,0, 1,0,0, 1,0,0,
            1,1,0, 1,1,0, 1,1,0, 1,1,0,
            0,1,0, 0,1,0, 0,1,0, 0,1,0 
         ];
        
        var img = await this.loadImage(nombre);
        file.meshes.forEach(mesh => {
        
            var indexes = [].concat.apply([], mesh.faces)
            // console.log("TextureCoords: ")
            // console.log(mesh.texturecoords);
            newMalla.loadMesh(mesh.vertices, indexes, mesh.normals, img, mesh.texturecoords[0]);
        });

        this.mallas.push(newMalla);
        return newMalla;
    }


    deleteObject(pos){

        
        for (let i = 0 ; i< this.mallas.length; i++){
            if(this.mallas[i].getId() > pos){
                this.mallas[i].setId(this.mallas[i].getId()-1);
            }
        }
        this.mallas.splice(pos,1);
       
    }

    // obtener Recurso tipo MALLA
    getMalla(nameMesh: string): RMalla{
        let recurso: RMalla;

        if(nameMesh){
            this.mallas.forEach(rec => {
                if(rec.getName() && rec.getName() == nameMesh){ // Si lo encunetra
                    // Leer en memoria
                    return rec;
                }
            });
            // No lo encuentra
            recurso = new RMalla(nameMesh);
            //recurso.loadMesh(nameMesh);
            this.mallas.push(recurso);
            
        }

        return recurso;
    }

    // obtener Recurso tipo MATERIAL
    getMaterial(nameMaterial: string): RMaterial{
        let recurso: RMaterial;

        if(nameMaterial){
            this.materiales.forEach(rec => {
                if(rec.getName() && rec.getName() == nameMaterial){ // Si lo encunetra
                    // Leer en memoria
                    return rec;
                }
            });
            // No lo encuentra
            recurso = new RMaterial(nameMaterial);
            recurso.loadMaterial(nameMaterial);
            this.materiales.push(recurso);
        }
        return recurso;
    }

    bufferResources(gl:WebGL2RenderingContext)
    {
        // console.log("Mallas: ")
        // console.log(this.mallas);
        this.mallas.forEach(mesh => {
            // console.log("Malla de: ");
            // console.log(mesh);
            mesh.bufferData(gl);
        })
    }

    getVertexBuffers():WebGLBuffer[] {
        var res:WebGLBuffer[] =[];
        this.mallas.forEach(mesh =>{
            mesh.getMeshes().forEach(imesh => {
                res.push(imesh.getVertexBuffer());
            });
        })

        return res;
    }

    getNormalsBuffer():WebGLBuffer[] {
        var res:WebGLBuffer[] =[];
        this.mallas.forEach(mesh =>{
            mesh.getMeshes().forEach(imesh => {
                res.push(imesh.getNormalsBuffer());
            });
        })

        return res;
    }

    // getColorBuffers():WebGLBuffer[] {
    //     var res:WebGLBuffer[] =[];
    //     this.mallas.forEach(mesh =>{
    //         mesh.getMeshes().forEach(imesh => {
    //             res.push(imesh.getColorsBuffer());
    //         });
    //     })

    //     return res;
    // }

    getTextureBuffers():WebGLBuffer[] {
        var res:WebGLBuffer[] =[];
        this.mallas.forEach(mesh =>{
            mesh.getMeshes().forEach(imesh => {
                res.push(imesh.getTextureBuffer());
            });
        })

        return res;
    }

    getIndexBuffers():WebGLBuffer[] {
        var res:WebGLBuffer[] =[];
        this.mallas.forEach(mesh =>{
            mesh.getMeshes().forEach(imesh => {
                res.push(imesh.getIndexBuffer());
            });
        })

        return res;
    }
    

    // setColor(gl:WebGL2RenderingContext){
    //     this.mallas.forEach(mesh =>{
    //         mesh.setColors(gl, this.shaders.getProgramShader())
    //     })
    // }

    createShaders(gl:WebGL2RenderingContext, vertCode:string, fragCode:string){
        
        this.shaders.createShaders(gl, vertCode, fragCode);
    }

    
    getVertexShaderCode(){
        return this.shaders.getVertexShaderCode();
    }
    
    getFragmentShaderCode(){
        return this.shaders.getFragmentShaderCode();
    }
    
    createVertexShader(vertCode){
        this.shaders.setVertexShaderCode(vertCode);
    }

    createFragmentShader(fragCode){
        this.shaders.setFragmentShaderCode(fragCode);
    }
    
    async readFile(path: string){
        
        if(!path){
            alert("Warning: " + path + " don't exist");
        }

        var x: any;
        const res = await fetch(path)
            .then((result) => result.text())
            .then((data) => {
                x = data;
                // console.log(data);   
                return data
            })
            .catch((error) => console.log(error));
        // const json = await res.json();
        // var aux = JSON.stringify(json);
        // var data = JSON.parse(aux);

        return x;
    }

    async readFileJSON(path: string){

        if(!path){
            alert("Warning: " + path + " don't exist");
        }

        var x: any;
        const res = await fetch(path)
            .then((result) => result.json())
            .then((data) => {
                x = data;
                // console.log(x);
                return x})
            .catch((error) => console.log(error));
        // const json = await res.json();
        // var aux = JSON.stringify(json);
        // var data = JSON.parse(aux);

        return x;
    }

    async loadImage(nombre: string): Promise<HTMLImageElement> {
        return new Promise((resolve: Function, reject: Function) => {
            let image: HTMLImageElement = new Image();

            image.onload = () => { resolve(image); };
            image.onerror = error => { reject(error); };
            image.src = "/assets/models/" + nombre+"/"+ nombre +".png";
        });
    }
    
    getGlobalModelMatrix() {
        var generalMatrix = new Float32Array(16);
        mat4.identity(generalMatrix);
        this.mallas.forEach(malla =>{  
            mat4.add(generalMatrix, generalMatrix, malla.getModelMatrix());
        });

        return generalMatrix;
    }

    associateAttributes(gl:WebGL2RenderingContext){
        
        var shaderprogram = this.shaders.getProgramShader();

        this.getVertexBuffers().forEach(vbuffer =>{
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
            var _position = gl.getAttribLocation(shaderprogram, "position");
            gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
            gl.enableVertexAttribArray(_position);
        })

        this.getNormalsBuffer().forEach(nbuffer =>{
            gl.bindBuffer(gl.ARRAY_BUFFER, nbuffer);
            var _normals = gl.getAttribLocation(shaderprogram, "a_normal");
            gl.vertexAttribPointer(_normals, 3, gl.FLOAT, true, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(_normals);
        })

        this.getTextureBuffers().forEach(tbuffer =>{
            gl.bindBuffer(gl.ARRAY_BUFFER, tbuffer);
            var _texture = gl.getAttribLocation(shaderprogram, "a_texcoord");
            gl.vertexAttribPointer(_texture, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0 );
            gl.enableVertexAttribArray(_texture);
            
        })

        // this.getColorBuffers().forEach(cbuffer => {
        //     gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
        //     var _color = gl.getAttribLocation(shaderprogram, "color");
        //     gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ;
        //     gl.enableVertexAttribArray(_color);
        // })


        gl.useProgram(shaderprogram);
    }



    
    setMatrixs(gl:WebGL2RenderingContext, proj_matrix, view_matrix, mo_matrix){
        this.mallas.forEach(mesh => {
            mesh.setMatrixs(gl, proj_matrix, view_matrix, mo_matrix);
        });
    }

    getShaderProgram(){
        return this.shaders.getProgramShader()
    }
    
    draw2(gl:WebGL2RenderingContext){
        this.mallas.forEach(mesh =>{
            mesh.draw2(gl, this.shaders.getProgramShader());
        })
    }

    move(gl:WebGL2RenderingContext, tX:any ,tY: any, tZ:any, viewMatrix){
        var shaderprogram = this.shaders.getProgramShader();
        this.mallas.forEach(mesh =>{
            mesh.move(gl,shaderprogram, tX, tY, tZ, viewMatrix)
        })
    }

    draw(gl:WebGL2RenderingContext){
        this.mallas.forEach(mesh =>{
            mesh.draw(gl, this.getShaderProgram())
        })
    }

   
    // associateAttributes(gl:WebGL2RenderingContext){
    //     this.mallas.forEach(mesh =>{
    //         mesh.bufferData(gl);
    //     })
    // }

}

export {gestorRecursos}