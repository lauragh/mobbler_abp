import { motor as MOTOR } from "./interfazMotor";
import { TNodo } from "./arbol/TNodo";
import { TCamara, TEntidad, TLuz, TModelo } from "./arbol/TEntidad";
import { gestorRecursos } from './gestorDeRecursos/gestorRecursos'
import { RCamera, RMalla } from "./gestorDeRecursos/recurso";
import { ElementRef, ɵɵclassMapInterpolate5 } from "@angular/core";

// Funciones para cargar los objetos, 


import {vec3, mat4, vec4, mat3, glMatrix} from 'gl-matrix';
import { animate } from "@angular/animations";
import { Console } from "console";
import { lookup } from "dns";
import { transformAll } from "@angular/compiler/src/render3/r3_ast";
import { identity } from "rxjs";
import { moment } from "ngx-bootstrap/chronos/test/chain";
import { BsDaterangepickerConfig } from "ngx-bootstrap/datepicker";

class motorTAG extends MOTOR {


            
    private root: TNodo; // nodo raiz
    private gestorRec: gestorRecursos; // gestor de recursos
    
    private viewMatrix:mat4;
    private camMatrix: mat4;
    private eye: vec3;
    private up: vec3;
    private target: vec3;
    
    
    // Registros de Camaras, Luces y Viewports
    private regCams: TNodo[];
    private regLights: TNodo[];

    
    // Activaciones: lo que podemos activar

    private activeLights: boolean[];
    
    // contexto del canvas

    private gl: WebGL2RenderingContext;
    private canvas: HTMLCanvasElement;
    
    // Buffers y Shaders
    private programInfo: any;

    // private mo_matrix; 
    // private view_matrix;
    private proj_matrix:mat4;

    // Posiciones de mouse
    private x = null;
    private y = null;
    static canvas: any;
    static gl: any;
    static camera: TCamara;
    static nCam: TNodo;
    static tX: number= 0.0;
    static tY: number= 0.0;
    static tZ: number = 0.0;

    private prevX = -1;
    private prevY = -1;

    private PressedKeys = {
        Up: false,
        Rigth: false,
        Down: false,
        Left: false, 
        Forward: false,
        Back: false,

        RotLeft: false,
        RotRight: false,
        RotUp: false,
        RotDown: false,
        Restart: false
    };

    private MoveForwardSpeed = 50.5;
    private RotateSpeed = 50.5;
    private dt = 0;
    private old_time;

    private cameraOriginalPos:mat4;

    constructor(canvasOriginal: HTMLCanvasElement){
        super();
        // Sacamos webgl en el rendercontext
        this.canvas = canvasOriginal; // sacamos el canvas.
        motorTAG.canvas = canvasOriginal;
        this.gl = canvasOriginal.getContext('webgl2');
        motorTAG.gl = canvasOriginal.getContext('webgl2');

        this.root = new TNodo(null, null, null, null, null, null, null);
        this.gestorRec = new gestorRecursos(this.gl);
        this.regCams = [];
        this.regLights = [];
        // this.regViewPorts = [];

        this.activeLights = [];
        this.proj_matrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.cameraOriginalPos = mat4.create();

        
        // ====== CAMARA VIEJA =========
        // this.proyectionMatrix = mat4.create();

        // this.camMatrix = mat4.create();
        // this.eye = vec3.fromValues(0, -1.5, -8); // posicion de la camara
        // this.target = vec3.fromValues(0, -1.5, 0);
        // this.up = vec3.fromValues(0, 1, 0); 
        // this.viewMatrix = mat4.create();

        // mat4.lookAt(this.camMatrix, this.eye, this.target, this.up);
        // mat4.invert(this.viewMatrix, this.camMatrix);

        // //this.view_matrix[14] = this.view_matrix[14]-6;
        // this.proj_matrix = this.get_projection(40, this.canvas.width/this.canvas.height, 1, 100);

        // this.camera = new TCamara(1, 45 * Math.PI / 180, 0.05, 1000);
        // motorTAG.camera = new TCamara(1, 45 * Math.PI / 180, 0.05, 1000);
        // this.nCam = new TNodo(mat4.create(), this.root, this.camera, null, vec3.create(), vec3.create(), vec3.create());
        // motorTAG.nCam = new TNodo(mat4.create(), this.root, this.camera, null, vec3.create(), vec3.create(), vec3.create());
        // this.projectionMatrix = this.camera.projectionMatrix();

        // ======== CAMARA VIEJA ===== 


        // ======= FPS CAMERA =========
        var Camera:RCamera = this.gestorRec.getCamera();

        Camera.initialize(
            vec3.fromValues(0, -1.5, -8),
            vec3.fromValues(0, -1.5, 0),
            vec3.fromValues(0, 1, 0)
        );
        
        mat4.perspective(
            this.proj_matrix,
            glMatrix.toRadian(60),
            this.canvas.width/this.canvas.height,
            0.35,
            85.0
        )
        
        Camera.moveUp(3);
        Camera.moveRight(10);
        Camera.rotateRight(1);
        Camera.moveForward(8);
        Camera.getViewMatrix(this.viewMatrix);
        mat4.copy(this.cameraOriginalPos, Camera.getViewMatrix(this.viewMatrix));

        // ===========================
    }
    Scene(): any{
        this.root = this.createNode(null, null, vec3.create(), vec3.create(), vec3.create());

        return this.root; // Instancia del primer nodo (NODO ESCENA)
    }
    
    loadShader = async function (shaderUrl:string) {
        await this.gestorRec.loadShader(shaderUrl, function(err, ftext){
            if(err){
                console.error(err)
            }else{   
                // console.log(ftext);
                return ftext;
                // shaders.push(ftext);
            }
        })
    }

    getPositionOnCanvas(e) {
        // del canvas
        this.x = e.pageX - motorTAG.canvas.getBoundingClientRect().left;
        this.y = e.pageY - motorTAG.canvas.getBoundingClientRect().top;
        // console.log(this.x, this.y);
    }
    
    getMouseX() {
        return this.x;
    }
    
    getMouseY() {
        return this.y;
    }

    async raycast2(){
       // ix: number,iy: number
        var gl = motorTAG.gl;
        var canvas = motorTAG.canvas;
        var Mat4 : mat4 = mat4.create();
        var Cam = motorTAG.camera;
        // convertimos las coordenadas de la pantalla coordenadas
        // normalizadas en el espacio del dispositivo
        
        var nx = this.x / canvas.width * 2 - 1;
        var ny = 1 - this.y / canvas.height * 2;
        // console.log('Coordenadas pantalla '+this.x+' '+this.y)
        // console.log('Coordenadas dipositivo '+nx+' '+ ny);

        //..........................................
        //4d Homogeneous Clip Coordinates
        var vec4Clip : vec4 = vec4.create(); // -Z is forward, W just needs to be 1.0.
        vec4Clip = vec4.fromValues(nx,ny,-1.0,1.0);

        //..........................................
        //4d Eye (Camera) Coordinates
        var vec4Eye : vec4 = vec4.create();
        var matInvProj : mat4 = mat4.create();
        // console.log('MatInvProj: '+ matInvProj);
        // console.log('ProjectionMatrix: '+Cam.projectionMatrix());
        mat4.invert(matInvProj,Cam.projectionMatrix());
        vec4.transformMat4(vec4Eye, vec4Clip, matInvProj);
        vec4Eye[2] = -1; //Reset Forward Direction
        vec4Eye[3] = 0.0; //Not a Point

        //..........................................
        //4d World Coordinates
        var vec4World : vec4 = vec4.fromValues(0,0,0,0);
       
        //.Mat4.transformVec4(vec4World,vec4Clip,Cam.invertedLocalMatrix);
        vec4.transformMat4(vec4World, vec4Eye, motorTAG.nCam.getTransf());

        var ray = vec3.fromValues(vec4World[0],vec4World[1],vec4World[2]);
        vec3.normalize(ray, ray);

        //..........................................
        //FungiApp.debugLines.addVector(ray,[0,0,0],"000000").update()

        //Orbit makes .Position unusable, need to put actual position from the matrix
        var rayStart :vec3 = vec3.fromValues(motorTAG.nCam.getTransf()[12],motorTAG.nCam.getTransf()[13],motorTAG.nCam.getTransf()[14])
        var rayEnd    :vec3 = vec3.clone(rayStart);

        vec3.add( rayEnd, rayEnd, [ray[0]*20, ray[1]*20, ray[2]*20] );
        // console.log('El inicio del rayo: '+rayStart);
        // console.log('El final del rayo: '+rayEnd);
    }


    // async testDraw1(){

    //             // var gl = this.gl
    //             // console.log('var gl',gl);
    //             // console.log('this.gl',this.gl)
    //             // var canvas = this.canvas;
    //             // console.log('this.canvas',this.canvas)

    //             await this.gestorRec.loadObject("sillita.json");
    //             // console.log("Buffer de recursos");
    //             this.gestorRec.bufferResources(this.gl);
    //             /*=================== SHADERS =================== */
    //             // console.log("Lectura Shaders");
    //             var vertCode = await this.gestorRec.readFile('/assets/shaders/vertexShader.glsl');
    //             var fragCode = await this.gestorRec.readFile('/assets/shaders/fragmentShader.glsl');
    //             // console.log("Create vertex shader");
    //             // this.gestorRec.createVertexShader(vertCode);
    //             // console.log("Create fragment shader");
    //             // this.gestorRec.createFragmentShader(fragCode);
    //             // console.log("crear ambos y asignarlos");
    //             this.gestorRec.createShaders(this.gl, vertCode, fragCode);

    //             var shaderprogram = this.gestorRec.getShaderProgram();
    //             // console.log("Asociar atributos");
    //             this.gestorRec.associateAttributes(this.gl);
                 
    //             this.createEvents();
                                  
    //             this.animate(0);
    // }

    async addMueble(mueble : string,id?:number, modelMatrix?:Float32Array ){
        
        if(id && id!= -1){
            var objMueble = await this.loadObject(mueble,id);
        }
        else{
            var objMueble = await this.loadObject(mueble);
        }
        
        if(modelMatrix){
            // console.log("SE HA COLOCADO LA NUEVA MODEL MATRIX")
            objMueble.setNewModelMatrix(modelMatrix,);
        }
        var gl = this.gl;

        // ======== BUFFERING DATA =========
        
        this.gestorRec.bufferResources(this.gl);
        // ==================================
        // ======== CARGANDO SHADERS ========
        await this.loadShaders();
       

        // ======== ASOCIANDO ATRIBUTOS ========
        let shaderprogram = this.gestorRec.getShaderProgram();
        this.gestorRec.getAllMeshs().forEach(mesh => {
            mesh.initialiceMatrixs(this.gl, shaderprogram);
        });
        this.gestorRec.associateAttributes(gl);
        this.animate(0);
    }

    async testDraw2(){

        this.createEvents();
        this.createEvents2();

        await this.loadObject("plano-pared");
        var gl = this.gl;
        // ======== BUFFERING DATA =========
        
        this.gestorRec.bufferResources(this.gl);
        // ==================================
        // ======== CARGANDO SHADERS ========
        await this.loadShaders();
       
        // ======== ASOCIANDO ATRIBUTOS ========
        let shaderprogram = this.gestorRec.getShaderProgram();
        this.gestorRec.getAllMeshs().forEach(mesh => {
            mesh.initialiceMatrixs(this.gl, shaderprogram);
        });
        this.gestorRec.associateAttributes(gl);
        // =====================================
        this.old_time = performance.now();
        this.animate(0);
    }

    

    loadObject = async (mueble: string , id?:number) => {
        var object;
        if(id !== undefined){
            object = await this.gestorRec.loadObject(mueble,id);

        }
        else{
            object = await this.gestorRec.loadObject(mueble);
        }
        return object;
    }

    loadShaders = async () =>{
        var vertCode = await this.gestorRec.readFile('/assets/shaders/vertexShader.glsl');
        var fragCode = await this.gestorRec.readFile('/assets/shaders/fragmentShader.glsl');
        this.gestorRec.createShaders(this.gl, vertCode, fragCode);
    }

    createEvents(){
        var canvas = this.canvas;
        var viewMatrix = this.viewMatrix;

        canvas.draggable = true;
        var animate = this.animate;
    
        var wheel = function(e){
            // this.eye = vec3.fromValues(0, -1.5, -8); // posicion de la camara\
            if (e.deltaY < 0)
            {
                mat4.scale(viewMatrix, viewMatrix, [1.5, 1.5, 1.5]);
                // console.log(viewMatrix);
            }                
    
            else if (e.deltaY > 0)
            {
                mat4.scale(viewMatrix, viewMatrix, [0.5, 0.5, 0.5]);
                // console.log(viewMatrix);
            }
    
            animate(0);
        }
    
        var autoResizeCanvas = function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Resize screen when the browser has triggered the resize event
        }
        
        window.addEventListener('resize', autoResizeCanvas);
        canvas.addEventListener("wheel", wheel);
        
        
        // document.addEventListener('keydown',this.Reiniciar, false);
    }

    createEvents2() {
        // var __KeyDownWindowListener = this._OnKeyDown.bind(this);
        // var __KeyUpWindowListener = this._OnKeyUp.bind(this);

        // this.AddEvent(window, 'keydown', __KeyDownWindowListener);
        // this.AddEvent(window, 'keyup', __KeyUpWindowListener)
        
        window.addEventListener('keydown', this._OnKeyDown.bind(this));
        window.addEventListener('keydown', this._OnKeyUp.bind(this));
    }


    _OnKeyDown = (e) => {
        switch(e.code){
            case 'ArrowUp':
                this.PressedKeys.Forward = true;
                break;
            case 'ArrowLeft':
                this.PressedKeys.Left = true;
                break;
            case 'ArrowRight':
                this.PressedKeys.Rigth = true;
                break;
            case 'ArrowDown': 
                this.PressedKeys.Back = true;
                break;
            case 'ShiftLeft':
                this.PressedKeys.Up = true;
                break;
            case 'ControlLeft':
                this.PressedKeys.Down = true;
                break;
            case 'KeyZ':
                this.PressedKeys.RotLeft = true;
                break;
            case 'KeyX':
                this.PressedKeys.RotRight = true;
                break;
            case 'KeyC':
                this.PressedKeys.RotUp = true;
                break;
            case 'KeyV':
                this.PressedKeys.RotDown = true;
                break;
            case 'KeyR':
                this.PressedKeys.Restart = true;
                break;

            default:
                // console.log(e.code);
                break;
        }
        this.animate(0)
    }

    _OnKeyUp = (e) => {
        switch(e.code){
            case 'ArrowUp':
                this.PressedKeys.Forward = false;
                break;
            case 'ArrowLeft':
                this.PressedKeys.Left = false;
                break;
            case 'ArrowRight':
                this.PressedKeys.Rigth = false;
                break;
            case 'ArrowDown': 
                this.PressedKeys.Back = false;
                break;
            case 'ShiftLeft':
                this.PressedKeys.Up = false;
                break;
            case 'ControlLeft':
                this.PressedKeys.Down = false;
                break;
            case 'KeyZ':
                this.PressedKeys.RotLeft = false;
                break;
            case 'KeyX':
                this.PressedKeys.RotRight = false;
                break;
            case 'KeyC':
                this.PressedKeys.RotUp = false;
                break;
            case 'KeyV':
                this.PressedKeys.RotDown = false;
                break;
            // case 'KeyR':
            //     this.PressedKeys.Restart = false;
            //     break;
            default:
                // console.log(e.code);
                break;
        }
        // window.requestAnimationFrame(this.animate)
        this.animate(0);

    }
    
    checkXDirection= (e) => {
        var direction = "";

        // if (e.pageX < this.oldx) {
        //     direction = "left"
        // } else if (e.pageX > this.oldx) {
        //     direction = "right"
        // }
        
        // this.oldx = e.pageX;

        if(this.prevX == -1) {
            this.prevX = e.pageX;    
            return false;
        }
        // dragged left
        if(this.prevX > e.pageX) {
            direction = "left"
            // console.log('dragged left');
        }
        else if(this.prevX < e.pageX) { // dragged right
            direction = "right"
            // console.log('dragged right');
        }
        this.prevX = e.pageX;
        // console.log('e.pageX', e.pageX);

        return direction;
    }

    checkYDirection= (e) => {
        var direction = "";

        if(this.prevY == -1) {
            this.prevY = e.pageY;    
            return false;
        }
        // dragged left
        if(this.prevY > e.pageY - 10) {
            direction = "up"
            // console.log('dragged arriba');
        }
        else if(this.prevY < e.pageY + 10) { // dragged right
            direction = "down"
            // console.log('dragged abajo');
        }
        this.prevY = e.pageY;
        // console.log('e.pageY', e.pageY);
        return direction;
    }

    deleteObj(pos: number){
        //this.gestorRec.getAllMeshs().splice(pos, 1);
        this.gestorRec.deleteObject(pos);
    }

    animate = (time) => {
        
        var gl = this.gl;
        var newTime = performance.now();

        // UPDATE
        this.dt = newTime - this.old_time;
        if(this.dt >= 1) {
            this.dt = 1;
        }


        var camera:RCamera = this.gestorRec.getCamera();
        // move camera


        if(this.PressedKeys.Forward && !this.PressedKeys.Back) {
            camera.moveForward(this.dt/1000 * this.MoveForwardSpeed);
            // camera.moveForward(this.MoveForwardSpeed);
        }

        if(this.PressedKeys.Back && !this.PressedKeys.Forward) {
            camera.moveForward(-this.dt/1000 * this.MoveForwardSpeed);
            // camera.moveForward(this.MoveForwardSpeed);
        }

        if(this.PressedKeys.Rigth && !this.PressedKeys.Left) {
            camera.moveRight( this.dt/1000 * this.MoveForwardSpeed);
            // camera.moveRight(this.MoveForwardSpeed);
        }

        if(this.PressedKeys.Left && !this.PressedKeys.Rigth) {
            camera.moveRight( -this.dt/1000 * this.MoveForwardSpeed);
            // camera.moveRight(this.MoveForwardSpeed);
        }

        if(this.PressedKeys.Up && !this.PressedKeys.Down) {
            camera.moveUp( this.dt/1000 * this.MoveForwardSpeed);
            // camera.moveUp( this.MoveForwardSpeed);
        }

        if(this.PressedKeys.Down && !this.PressedKeys.Up) {
            camera.moveUp( -this.dt/1000 * this.MoveForwardSpeed);
            // camera.moveUp( this.MoveForwardSpeed);
        }

        if(this.PressedKeys.RotRight && !this.PressedKeys.RotLeft) {
            camera.rotateRight(this.dt/1000 * this.RotateSpeed);
        }
        
        if(this.PressedKeys.RotLeft && !this.PressedKeys.RotRight) {
            camera.rotateRight(-this.dt/1000 * this.RotateSpeed);
        }

        if(this.PressedKeys.RotUp && !this.PressedKeys.RotDown) {
            camera.rotateUp(-this.dt/1000 * this.RotateSpeed);
        }

        if(this.PressedKeys.RotDown && !this.PressedKeys.RotUp) {
            camera.rotateUp(this.dt/1000 * this.RotateSpeed);
        }
        

        // the the matrix
        if(!this.PressedKeys.Restart){
            camera.getViewMatrix(this.viewMatrix);
        } else{
            // mat4.copy(this.viewMatrix, this.cameraOriginalPos);
            camera.initialize(
                vec3.fromValues(0, -1.5, -8),
                vec3.fromValues(0, -1.5, 0),
                vec3.fromValues(0, 1, 0)
            );
            
            camera.moveUp(3);
            camera.moveRight(10);
            camera.rotateRight(1);
            camera.moveForward(8);
            camera.getViewMatrix(this.viewMatrix);
            this.PressedKeys.Restart = false;
        }




        this.old_time = newTime;
        // DRAW
        gl.enable(gl.DEPTH_TEST);

        gl.clearColor(0.5, 0.5, 0.5, 0.9);
        gl.clearDepth(1.0);
        gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for(var a:number = 0; a < this.gestorRec.getAllMeshs().length; a++){
            this.gestorRec.getAllMeshs()[a].setMatrixs(gl, this.proj_matrix, this.viewMatrix,this.gestorRec.getAllMeshs()[a].getModelMatrix());
            this.gestorRec.getAllMeshs()[a].draw(gl, this.gestorRec.getShaderProgram());
        }

        window.requestAnimationFrame(animate);
    }

    update = (dt) =>{
        var camera:RCamera = this.gestorRec.getCamera();
        // console.log("Entra en el update");
        // move camera
        if(this.PressedKeys.Forward && !this.PressedKeys.Back) {
            // console.log("Entra aqui tmb");
            camera.moveForward(dt/1000 * this.MoveForwardSpeed);
        }

        if(this.PressedKeys.Back && !this.PressedKeys.Forward) {
            camera.moveForward(-dt/1000 * this.MoveForwardSpeed);
        }

        if(this.PressedKeys.Rigth && !this.PressedKeys.Left) {
            camera.moveRight( dt/1000 * this.MoveForwardSpeed);
        }

        if(this.PressedKeys.Left && !this.PressedKeys.Rigth) {
            camera.moveRight( -dt/1000 * this.MoveForwardSpeed);
        }

        if(this.PressedKeys.Up && !this.PressedKeys.Down) {
            camera.moveUp( dt/1000 * this.MoveForwardSpeed);
        }

        if(this.PressedKeys.Down && !this.PressedKeys.Up) {
            camera.moveUp( -dt/1000 * this.MoveForwardSpeed);
        }

        

        // the the matrix
        camera.getViewMatrix(this.viewMatrix);


    }

    translateAll = (tX:any, tY:any, tZ:any, angle?: number) => {
        // console.log('gestorRec',this.gestorRec);
        for(let i = 0; i < this.gestorRec.getAllMeshs().length; i++){
            this.translate(tX, tY, tZ, i, angle);
        }
    }


    translate(tX:any, tY:any, tZ:any,posObj?: number, angle?: number){
        
       
        if( typeof posObj !== 'undefined'){
            // console.log('El obj con el que entras tiene pos: '+posObj);
            
            
            this.gestorRec.getMesh(posObj).move(this.gl,this.gestorRec.getShaderProgram(), tX, tY, tZ, this.viewMatrix);
            if(angle){
                
                this.gestorRec.getMesh(posObj).rotate(this.gl,this.gestorRec.getShaderProgram(), angle);
                }   
        }
        this.animate(0);

    }

    getPosition(posObj: number){
        return(this.gestorRec.getAllMeshs()[posObj].getPosition());
    }

    saveModelMatrix(posObj:number){
        return (this.gestorRec.getAllMeshs()[posObj].saveModelMatrix());
    }
    
    clearObjects(){
        this.gestorRec.clearObjects()
    }
         /*==================== Rotation ====================*/

        rotateZ(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];

            m[0] = c*m[0]-s*m[1];
            m[4] = c*m[4]-s*m[5];
            m[8] = c*m[8]-s*m[9];

            m[1]=c*m[1]+s*mv0;
            m[5]=c*m[5]+s*mv4;
            m[9]=c*m[9]+s*mv8;
         }

        rotateX(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv1 = m[1], mv5 = m[5], mv9 = m[9];

            m[1] = m[1]*c-m[2]*s;
            m[5] = m[5]*c-m[6]*s;
            m[9] = m[9]*c-m[10]*s;

            m[2] = m[2]*c+mv1*s;
            m[6] = m[6]*c+mv5*s;
            m[10] = m[10]*c+mv9*s;
         }

        rotateY(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];

            m[0] = c*m[0]+s*m[2];
            m[4] = c*m[4]+s*m[6];
            m[8] = c*m[8]+s*m[10];

            m[2] = c*m[2]-s*mv0;
            m[6] = c*m[6]-s*mv4;
            m[10] = c*m[10]-s*mv8;
        }


    get_projection(angle, a, zMin, zMax) {
        var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
        return [
           0.5/ang, 0 , 0, 0,
           0, 0.5*a/ang, 0, 0,
           0, 0, -(zMax+zMin)/(zMax-zMin), -1,
           0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
           ];
    }

    Camera(traslation: vec3, rotation: vec3, scale: vec3,
        fov: number, aspect: number, near: number, far: number, father?: TNodo): TNodo {
        
        if (father == null){
            father = this.root;
        }

        var cam = new TNodo(mat4.create(), father, null, null, traslation, rotation, scale); // NODO
        cam.setUpdateMatrix();
        father.addChild(cam); // añado al padre el HIJO (NODE)
        
        var eCam = new TCamara(fov, aspect, near, far); // ENTIDAD
        cam.setEntidad(eCam); // asocio al nodo un entidad
        this.regCams.push(cam);
        return cam;
    }

    
    Mesh(root: TNodo, traslation: vec3, rotation: vec3, scale: vec3,
        fichero: string) {
        
        if(fichero){
            if(root == null){
                root = this.root;
            }
            var model = new TNodo(mat4.create(), root, null, null, traslation, rotation, scale); // NODO
            var mesh: RMalla;
            
            model.setRoot(root); // padre
            root.addChild(model); // añado al padre el HIJO (NODE)
            
            mesh = this.gestorRec.getMalla(fichero); // obtener un recurso de RMALLA del gestor de recursos con getRecurso()
            model.setUpdateMatrix(); // pone la matriz a true
            eModel.loadModel(fichero);
            
            var eModel = new TModelo(); // ENTIDAD
            model.setEntidad(eModel);
        }


        return model;
    }

    Light(root: TNodo, traslation: vec3, rotation: vec3, scale: vec3,
        intensidad: vec3) {

        if (root == null){
            root = this.root;
        }

        // LUZ
        var light = new TNodo(mat4.create(), root, null, null, traslation, rotation, scale); 
        light.setUpdateMatrix();
        root.addChild(light);
        
        // ENTIDAD
        var eLight = new TLuz(intensidad); 
        light.setEntidad(eLight);


        return light;
    }

    createNode(root: TNodo, ent: TEntidad, traslation: vec3, rotation: vec3, scale: vec3): TNodo{
        
        if (root == null){
            root = this.root;
        }
        // creamos el nodo
        var node = new TNodo(mat4.create(), root, null, null, traslation, rotation, scale); 

        node.setUpdateMatrix(); // pone la matriz a true
        root.addChild(node);
        return node;
    }

    Renderer() {
        throw new Error("Method not implemented.");
    }

    CreateBoxGeometry() {
        throw new Error("Method not implemented.");
    }

    MeshMaterial() {
        throw new Error("Method not implemented.");
    }

    // registrar camara
    registerCamera(camera: TNodo): number{
        if(camera){
            return this.regCams.push(camera);
            
        }
    }
    // Activar camara 
    // setActiveCamera(nCam: number): void{
    //     if(nCam < this.regCams.length){
    //         this.activeCam = nCam;
    //     }
    // }
    
    // Registrar luces
    registerLight(light: TNodo): number{
        if(light){
            return this.regLights.push(light);
        }
    }

    // Activar luces
    setActiveLight(nLight: number, active: boolean): void{
        if(nLight){
            this.activeLights[nLight] = active;
        }
    }

    registerViewPort(x: number, y: number, width: number, height: number): number{

        this.gl.viewport(x, y, width, height);
        return 0;
    }

    // setActiveViewport(nViewport: number): void{
    //     this.activeVPort = nViewport;
    // }

    public async drawScene(){
        
        this.gl.useProgram(this.programInfo.program);
        
        // La matrix modelViewMatrix
        this.viewMatrix = mat4.create();

        // Luces 



        // Camara


        // Viewport

        

        // inicializar libreria grafica como sea necesario
        // inicializar luces
        // inicializar el viewport
        // inicializar camara
        // escena.recorrer(...)

    }

    draw(){
        var accMat = mat4.create();
        this.root.recorrer(accMat);

        //this.viewMatrix = this.regCams[this.activeCam]
        //this.viewMatrix = this.activeCam.
        //this.proyectionMatrix = this.activeCam.
        /*
        this.matrizAcumulada = mat4.create();
        this.escena.recorrer(this.matrizAcumulada);
        this.matrizVista = this.camara.getMatrizVista();
        this.matrizProyeccion = this.camara.getMatrizProyeccion();
        this.matrizLocal = this.matrizAcumulada;  

        */

    }
}

export { motorTAG };