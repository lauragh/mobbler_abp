import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ElementRef } from '@angular/core';
import { Console } from 'console';
import { glMatrix, mat4, vec3 } from 'gl-matrix';
import { Malla } from './Malla';

//import fShaderSource from './fragmentShader.glsl';
//import vShaderSource from './vertexShader.glsl';

// const fShaderSource = `
// #version 330 core
// out vec4 fragColor; // valor de salida (color del fragmento)

// struct Material {
//     sampler2D diffuseTexture;
//     // TODO: añadir specularTexture y resto de propiedades del material
// };

// in vec2 texCoord; // Recibido desde el vertex shader
// uniform Material material;

// void main() {
//     fragColor = texture(material.diffuseTexture, texCoord);
// }`;

// const vShaderSource = `
// #version 330 core
// // Vertex attributes
// layout (location = 0) in vec3 aPos; // Posición del vértice
// layout (location = 1) in vec3 aNormal; // normal del vértice
// layout (location = 2) in vec2 aTexCoord;// coordenada de textura

// out vec2 texCoord; //Salida para enviar datos al fragment shader

// uniform mat4 mvp; // Uniform con la multiplicación projection*view*model

// void main() {
//     gl_Position = mvp * vec4(aPos, 1.0f);
//     texCoord = aTexCoord;
// }`;

abstract class Recurso {
    protected name: string;

    constructor(name: string){
        if(name){
            this.name = name;
        } 
    }

    getName(): string{
        return this.name;
    }

    setName(newName: string){
        if(newName){
            this.name = newName;
        }
    }
}

class RMalla extends Recurso{
    private meshes: Malla[]; // array de coodenadas, vertices, normales y texturas.

    private _Pmatrix:WebGLUniformLocation; //proyection --> POSICIONES
    private _Vmatrix:WebGLUniformLocation; //view --> CAMARA
    private _Mmatrix:WebGLUniformLocation; //model --> PASA COORDENADAS LOCALES A COORDENADAS EN LA ESCENA
    private tX:number = 0.0;
    private tY:number = 0.0;
    private tZ:number = 0.0;
    private angle:number = 0;
    private id: number;
    private modelMatrix:mat4 = mat4.create();
    // private modelMatrix = new Float32Array(16)
    private identityMatrix:Float32Array;


    private traslacion:vec3;
    private rotacion:vec3;
    private escalado:vec3;
    
    public angulo: number = 0;
    public posX:number = 0;
    public posY:number = 0;
    public posZ:number = 0;
    
    private ambientUniformLocation:WebGLUniformLocation;
    private sunlightDirUniformLocation:WebGLUniformLocation;
    private sunlightIntUniformLocation:WebGLUniformLocation;

    constructor(name:string, identificador?:number){
        super(name);
        this.meshes = [];
        this.identityMatrix = new Float32Array(16);
        
        if(identificador !== undefined){
            //console.log("Le ha llegado el id: ", identificador);
            this.id = identificador;
        }else{
            this.id = 0;
        }
        //console.log("El objeto, tiene el id: ", this.id);

        mat4.identity(this.identityMatrix);
    }

    getId(){
        return this.id;
    }

    setId( id){

        this.id = id;
    }

    getPosition(){
        // console.log('POSITIONS:'+this.posX+' '+this.posY+' '+this.posZ+' '+this.angulo)
        // console.log('Model matrix'+ this.modelMatrix)
        this.posX = this.modelMatrix[12];
        this.posY =this.modelMatrix[13];
        this.posZ =this.modelMatrix[14];

        let array = [this.posX,this.posY,this.posZ]
        return(array);
    }

    saveModelMatrix(){
        var res = new Float32Array(16);
        mat4.copy(res, this.modelMatrix)
        return res;
    }

    setNewModelMatrix(newMoMatrix:Float32Array){
        mat4.copy(this.modelMatrix, newMoMatrix);
    }

    loadMesh(vertex:number[], indexes:number[], normals:number[], img:HTMLImageElement, textCoords:number[]){
        var auxMesh:Malla = new Malla(vertex, normals, indexes, img, textCoords)
        // console.log(auxMesh);
        this.meshes.push(auxMesh);
    }



    // loadMesh(vertex:number[], normals:number[], indexes:number[], color?:number[],
    //     textures?:number[], coordTex?:number[])
    // {
    //     let auxMesh = new Malla(vertex, normals,indexes);
        
    //     if(typeof color !== 'undefined')
    //     {
    //         auxMesh.loadColor(color);
    //     }

    //     if(typeof textures !== 'undefined' && typeof coordTex !== 'undefined')
    //     {
    //         auxMesh.loadTexture(textures, coordTex)
    //     }
        
    //     this.mesh.push(auxMesh);
    // }

    initialiceMatrixs(gl:WebGL2RenderingContext, shaderprogram:WebGLProgram){
        this._Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix");
        this._Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix");
        this._Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");

        // luces
        this.ambientUniformLocation = gl.getUniformLocation(shaderprogram, 'ambientLightIntensity');
        this.sunlightDirUniformLocation = gl.getUniformLocation(shaderprogram, 'sun.direction');
        this.sunlightIntUniformLocation = gl.getUniformLocation(shaderprogram, 'sun.color');


    }

    setMatrixs(gl:WebGL2RenderingContext, proj_matrix, view_matrix, mo_matrix){

        gl.uniformMatrix4fv(this._Pmatrix, false, proj_matrix);
        gl.uniformMatrix4fv(this._Vmatrix, false, view_matrix);
        gl.uniformMatrix4fv(this._Mmatrix, false, mo_matrix);

        // luces
        gl.uniform3f(this.ambientUniformLocation, 0.2, 0.2, 0.3);
        gl.uniform3f(this.sunlightDirUniformLocation, 3.0, 4.0, -2.0);
        gl.uniform3f(this.sunlightIntUniformLocation, 0.9, 0.9, 0.9);
    }

    
    // cargaMalla(obj: any): Malla{
    //     console.log(obj);
    //     var mesh = new Malla(null, null, null); // creo malla
    //     mesh.setVertex(obj.meshes[0].vertices);
    //     mesh.setNormals(obj.meshes[0].vertices);
    //     mesh.setIndex([].concat.apply([], obj.meshes[0].faces));

    //     console.log("entra en cargaMalla()");

    //     console.log(mesh);

    //     this.meshes.push(mesh);
    //     return mesh;

    // }

    public getMeshes(): Malla[]{
        return this.meshes;
    }

    public getModelMatrix(): mat4{
        return this.modelMatrix;
    }

    // setColors(gl:WebGL2RenderingContext, shaderprogram:WebGLProgram){
    //     this.meshes.forEach(mesh=>{
    //         mesh.setColor(gl,shaderprogram);
    //     })
    // }

    bufferData(gl:WebGL2RenderingContext){
        // console.log("Buffer data de mallas individuales")
        this.meshes.forEach(malla => {
            // console.log(malla);
            malla.bufferData(gl);

        })

    }



    draw2(gl:WebGL2RenderingContext, shaderProgram:WebGLProgram){ // se dibujan cada una de las mallas. El dibujado ocurre en --> draw() de la clase Malla
        this.meshes.forEach(res => {
            res.draw2(gl, shaderProgram);

        });
    }

    

    rotate(gl:WebGL2RenderingContext, shaderProgram: WebGLProgram , rotation: number){

        // console.log(this.modelMatrix);
        
        this.angle = performance.now()/1000/6*2*Math.PI;
        // mat4.rotate(this.modelMatrix, this.identityMatrix, angle2, [0,1,0]);
        // console.log("Entra en la rotación");
        if(rotation > 0){
            this.angulo =this.angulo+5;
            if(this.angulo>=360){
                this.angulo=0;
            }
           
            mat4.rotate(this.modelMatrix, this.modelMatrix, glMatrix.toRadian(5), [0,1,0]);
        }
        // // mat4.rotate(this.modelMatrix, this.identityMatrix, angle, [0,1,0]);
        if (rotation < 0){
            this.angulo = this.angulo-5;
            if(this.angulo<=-360){
                this.angulo=0;
            }
            mat4.rotate(this.modelMatrix, this.modelMatrix, glMatrix.toRadian(5), [0,-1,0]);
        }
        // console.log(this.modelMatrix);
    }

    move(gl:WebGL2RenderingContext, shaderProgram: WebGLProgram , tX: number, tY: number, tZ: number, view_matrix){
        //console.log("Llego al movimiento");
        var translation = gl.getUniformLocation(shaderProgram, "translation");
        // paso al shader la translacion con esos vectores
        // this.tX = this.tX + tX;
        // this.tY = this.tY + tY;
        // this.tZ = this.tZ + tZ;
        // console.log('Se hace la translacion a: '+tX+" "+ tY+" "+ tZ);
        // // console.log(this.modelMatrix);
        // this.posX += tX;
        // this.posY += tY;
        // this.posZ += tZ;
        mat4.translate(this.modelMatrix, this.modelMatrix, [tX, tY, tZ]);
        // mat4.multiply(this.modelMatrix, this.modelMatrix, view_matrix);
        // gl.uniform3f(translation, this.tX, this.tY, this.tZ)
    }


    draw(gl:WebGL2RenderingContext, shaderprogram:WebGLProgram){
        this.meshes.forEach(mesh => {
            var vertex_buffer = mesh.getVertexBuffer();
            // var cbuffer = mesh.getColorsBuffer();
            var textureBuffer = mesh.getTextureBuffer();
            var texture = mesh.getTexture();
            var normals_buffer = mesh.getNormalsBuffer();

            // gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
            // var _color = gl.getAttribLocation(shaderprogram, "color");
            // gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ;
            // gl.enableVertexAttribArray(_color);

            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            var _position = gl.getAttribLocation(shaderprogram, "position");
            gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
            gl.enableVertexAttribArray(_position);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer);
            var _normals = gl.getAttribLocation(shaderprogram, "a_normal");
            gl.vertexAttribPointer(_normals, 3, gl.FLOAT, true, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(_normals);

            gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
            var _texture = gl.getAttribLocation(shaderprogram, "a_texcoord");
            gl.vertexAttribPointer(_texture, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0 );
            gl.enableVertexAttribArray(_texture);
            
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.activeTexture(gl.TEXTURE0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.bindBuffer(gl.TEXTURE_2D, null);

            gl.useProgram(shaderprogram);


            mesh.draw(gl);
        })
    }

}

class RMaterial extends Recurso{
    private Ka: vec3;
    private Kd: vec3;
    private Ks: vec3;

    private Ns: number;
    private d: number;

    private mapaKa: any;
    private mapaKd: any;
    private mapaKs: any;

    loadMaterial(file: any){

    }

}

class RTextura extends Recurso{

    private imageTex: any;

    loadTexture(obj: any){
        // console.log(obj.materials[0].properties[2].value); // Ka
        // console.log(obj.materials[0].properties[3].value); // Kd
        // console.log(obj.materials[0].properties[4].value); // Ks
        // console.log(obj.materials[0].properties[6].value); // shineVal
    }

}

class RShader extends Recurso{
    
    private vShaderCode: string;
    private fShaderCode: string;
    private vertShader: WebGLShader;
    private fragShader: WebGLShader;
    private shaderProgram: WebGLProgram;
    

    constructor(name: string)
    {
        super(name);
    }
    
    setVertexShaderCode(code:string){
        this.vShaderCode = code;
    }

    setFragmentShaderCode(code:string){
        this.fShaderCode = code;
    }

    createShaders(gl:WebGL2RenderingContext, vertCode:string, fragCode:string){
        this.vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vertShader, vertCode); 
        gl.compileShader(this.vertShader);

        this.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fragShader, fragCode);
        gl.compileShader(this.fragShader);

        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, this.vertShader);
        gl.attachShader(this.shaderProgram, this.fragShader);
        gl.linkProgram(this.shaderProgram);
    }

    getProgramShader(){
        return this.shaderProgram;
    }

    getVertexShaderCode(){
        return this.vShaderCode;
    }

    getFragmentShaderCode(){
        return this.fShaderCode;
    }
    // AL dibujado de la malla. Vertex array object. pag 27 diapositivas
    /*
    loadBufferShader(){
        this.vsBuffer = glteBuffer();
        glBuffer(gl.ARglFER, this.vsBuffer);
        glerData(gl.ARglFER, new Float32Array(), )
    
    }
    */
    
}

class RCamera extends Recurso {
    private forward;
    private up;
    private right;
    private position;

    constructor(name:string) {
        super(name)    
    }

    initialize(position, lookAt, up) {
        this.forward = vec3.create();
        this.up = vec3.create();
        this.right = vec3.create();

        this.position = position;

        vec3.subtract(this.forward, lookAt, this.position);
        vec3.cross(this.right, this.forward, up);
        vec3.cross(this.up, this.right, this.forward);

        vec3.normalize(this.forward, this.forward);
        vec3.normalize(this.right, this.right);
        vec3.normalize(this.up, this.up);
    }

    getViewMatrix(out) {
        var lookAt = vec3.create();
        vec3.add(lookAt, this.position, this.forward)
        mat4.lookAt(out, this.position, lookAt, this.up);
        return out;
    }

    rotateUp(rad) {
        var upMatrix = mat4.create();
        mat4.rotate(upMatrix, upMatrix, rad, vec3.fromValues(0,0,1));
        vec3.transformMat4(this.forward, this.forward, upMatrix);
        this._realign();
    }

    rotateRight(rad) {
        var rightMatrix = mat4.create();
        mat4.rotate(rightMatrix, rightMatrix, rad, vec3.fromValues(0,1,0))
        vec3.transformMat4(this.forward, this.forward, rightMatrix);
        this._realign();
    }

    _realign(){
        vec3.cross(this.right, this.forward, this.up);
        vec3.cross(this.up, this.right, this.forward)

        vec3.normalize(this.forward, this.forward);
        vec3.normalize(this.right, this.right);
        vec3.normalize(this.up, this.up);
    }

    moveForward(dist){
        vec3.scaleAndAdd(this.position, this.position, this.forward, dist);
    }

    moveRight(dist){
        vec3.scaleAndAdd(this.position, this.position, this.right, dist);
    }

    moveUp(dist){
        vec3.scaleAndAdd(this.position, this.position, this.up, dist);
    }


}

export {Recurso, RMalla, RMaterial, RTextura, RShader, RCamera}