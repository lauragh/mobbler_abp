import * as THREE from 'three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Product from './products/Product.js';
import Scene1 from './scenes/Scene1.js';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import { TNodo } from './src/arbol/TNodo';
import { mat4, vec2, vec3 } from 'gl-matrix';
import * as MOTOR from './src/motorTAG';
import { motor } from './src/interfazMotor';


// Funciones que se llamaran en el Frontend
@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy {
    public Motor: MOTOR.motorTAG;
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private scene: Scene1;

    private frameId: number = null;

    private pointer: vec2;
    private raycaster: THREE.Raycaster;
    private isShiftDown: boolean = false;
    private rollOverMesh: THREE.Mesh;
    private objects: TNodo[] = [];

    private clickMouse = new THREE.Vector2();
    private moveMouse = new THREE.Vector2();
    private draggable = new THREE.Object3D;
    private mouse = new THREE.Vector2();
    private uno: boolean = false;

    private actualObjeto;
    private seleccionado: boolean = false;

    // ======================
    
    private root:TNodo;
    private cam: TNodo;
    private myScene: TNodo;
    // private Motor: MOTOR.motorTAG = new MOTOR.motorTAG(this.canvas);
    public constructor(private ngZone: NgZone) {
    }

    public ngOnDestroy(): void {
        if (this.frameId != null) {
        cancelAnimationFrame(this.frameId);
        }
    }

    

    public setCanvas(canvas: ElementRef<HTMLCanvasElement>){
        this.canvas = canvas.nativeElement;
    }

    public IniMotor(canvas: ElementRef<HTMLCanvasElement>){
        this.setCanvas(canvas)
        
        this.Motor = new MOTOR.motorTAG(canvas.nativeElement);

    }

    public async addObject(mueble: string, id:number, modelMatrix?:Float32Array){
        //console.log('entro a la función addObject');
        //console.log('el id es: '+ id)

        if(id){
            //console.log("Ha recibido una model matrix");
            if(modelMatrix){
                //console.log("tamos dentro");
                await this.Motor.addMueble(mueble, id, modelMatrix);
            } 
            else{
                //console.log("tamos dentro2");
                await this.Motor.addMueble(mueble,id);
            } 
        }
        else{
            //console.log("con model matrix sin id");
            await this.Motor.addMueble(mueble,-1 ,modelMatrix);
        }

        
    }

    public resetScene(){
        this.Motor.clearObjects();
        this.Motor.testDraw2();
    }


    public selectObject(index:number){
        var motor = this.Motor;
        function funcion(event) {

            document.addEventListener("click", function() {
                document.removeEventListener('keydown',funcion, false);
              });
            switch(event.key){
                case "a":
                    // izquierda
                    //this.Motor.traslate(pos, -1,0,0);
                    motor.translate( -0.2,0.0,0.0, index);
                    break;
                case "d":
                    // derecha
                    motor.translate( 0.2,0.0,0.0,index);
                    break;
                case "w":
                    // atras
                    motor.translate( 0.0,0.0,-0.2, index);
                    break;
                case "s":
                    // adelante
                    motor.translate( 0.0,0.0,0.2, index);
                    break;
                case "q":
                    motor.translate( 0.0,0.0,0.0, index, 1);
                    break;
                case "e":
                    motor.translate( 0.0,0.0,0.0, index, -1);
                    break;
                default:
                    //console.log("Objeto no se ha movido "+event.key);
            }
        }
        if( typeof index !== 'undefined'){
            //console.log("EL INDICE ES: "+ index);
            document.addEventListener('keydown',funcion, false);
        }   
    }
    public getPosition( posObj: number){
        return (this.Motor.getPosition(posObj));
        
       // return (id,x,y,z,rotation);
    }

    public saveModelMatrix(posObj: number){
        return (this.Motor.saveModelMatrix(posObj));
    }

    public testDraw( posObj?: number) // Dibujar
    {

       
        var motor = this.Motor;
        //this.canvas = canvas.nativeElement;
        // this.Motor.testDraw(canvas);
        // this.Motor.loadShaders('/assets/shaders/fragmentShader.glsl', '/assets/shaders/vertexShader.glsl');
        this.Motor.testDraw2();
        
        // document.addEventListener('click', this.Motor.getPositionOnCanvas, false);
        // document.addEventListener('click', this.Motor.raycast2, false);
        

        // crear una escena
        //this.Motor.Scene();
        // crear una camara
        // this.Motor.Camera();
        // crear luces
        // poner wiewport
        // cargar modelo
        // dibujar
    
    }
    

    captura(){
        this.Motor.animate(0);
    }

    delete(pos: number){
        this.Motor.deleteObj(pos);
    }


    public createScene(canvas: ElementRef<HTMLCanvasElement>) {
        // The first step is to get the reference of the canvas element from our HTML document


        this.canvas = canvas.nativeElement;

        this.myScene = this.Motor.Scene();
        this.scene.background = new THREE.Color('rgb(193, 193, 193)').convertSRGBToLinear();

        
        this.cam = this.Motor.Camera([5,5,-5], vec3.create(), vec3.create(), 
                                    45, window.innerWidth / window.innerHeight, 1, 1000, this.myScene);
        
        this.camera.lookAt(0, 0, 0);

        // CUBO
        //const geometry:THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const material:THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
        // const cube:THREE.Mesh = new THREE.Mesh(geometry, material);
        //this.scene.add(cube);


        const controls = new OrbitControls(this.camera, this.canvas);

        // ROLL-OVER HELPERS --> te dice donde colocar el objeto
        let product = new Product();
        this.rollOverMesh = product.createRollOver();
        this.scene.add(this.rollOverMesh);

        this.pointer = vec2.create();
        this.raycaster = new THREE.Raycaster();
        // devuelve las cordenadas del puntero

        this.objects.push(this.scene.plane);

        // RENDER
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,    // transparent background
            antialias: true // smooth edges
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth-28, window.innerHeight-250);

        // EVENT LISTENER
        // document.addEventListener('pointermove', this.onPointerMove);
        // document.addEventListener('pointerdown', this.onPointerDown);
        // document.addEventListener('keydown', this.onDocumentKeyDown);
        // document.addEventListener('keyup', this.onDocumentKeyUp);

        // // //funcion para mover objetos drag and drop
        // document.addEventListener('click', this.DragandDrop);
        // document.addEventListener('mousemove', this.Dragging);
    }

    public async cargaModelo(path){
        this.Motor.Mesh(this.scene, vec3.create(), vec3.create(), vec3.create(), path);

    }

    public async translateModel(tX, tY, tZ,pos,r){
        this.Motor.translate(tX, tY, tZ,pos,r);
    }


    public animate( time){

        this.Motor.animate(time);

    }

    // public animate(): void {
    // // We have to run this outside angular zones,
    // // because it could trigger heavy changeDetection cycles.
    //     this.ngZone.runOutsideAngular(() => {
    //         if (document.readyState !== 'loading') {
    //         this.render();
    //         } else {
    //         window.addEventListener('DOMContentLoaded', () => {
    //             this.render();
    //         });
    //         }

    //         window.addEventListener('resize', () => {
    //             this.resize();
    //         });


    //     });
    // }

    public render(): void {
        this.dragObject();
        this.frameId = requestAnimationFrame(() => {
            this.render();
        });
        this.renderer.render(this.scene, this.camera);

    }

    public resize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }



    // Devuelve objetos que intersecionan desde nuestra camara
    public intersect(pos) {
        this.raycaster.setFromCamera(pos, this.camera);
        return this.raycaster.intersectObjects(this.scene.children);
    }

    // aqui te dice cuando selecciona algo y cuando lo suelta
    public DragandDrop(event) {
        if (this.uno) {
            if (this.draggable != null) {
                //console.log(`dropping draggable ${this.draggable.name}`)
                this.draggable = null
                return;
            }
        }
        this.uno = true;
        this.clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.clickMouse, this.camera);
        const found = this.raycaster.intersectObjects(this.scene.children, true);
        if (found.length > 0 && found[0].object.name != "plano") {
            this.draggable = found[0].object;
            //console.log("found : " + this.draggable.name);
        }

    }

    public Dragging(event) {
        this.moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    public dragObject() {
        if (this.draggable != null) {
            const found = this.intersect(this.moveMouse);
            if (found.length > 0) {
                for (let i = 0; i < found.length; i++) {
                    if (found[i].object.name != "plano")
                        continue

                    let target = found[i].point;
                    this.draggable.position.x = target.x;
                    this.draggable.position.z = target.z;
                }
            }
        }
    }

    //Función para posicionar el objeto al mover el ratón 
    public onPointerMove(event) {

        this.pointer[0] = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer[1] =  -(event.clientY / window.innerHeight) * 2 + 1;
        // console.log(this.pointer);

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, false);

        if (intersects.length > 0) {

            const intersect = intersects[0];

            this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);

            // Pararesolver colisiones
            //rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

        }
        /*
        else if (intersects.length <= 0){
            //console.log("El objeto se pasa del plano");
        }
        */
    }



    //Función para clickar diferentes objetos
    public onPointerDown(event): boolean {
        this.seleccionado = false;
        this.mouse = new THREE.Vector2();

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        var intersects = this.raycaster.intersectObjects(this.scene.children, true);

        // borrado
        if (this.isShiftDown) {
            //console.log("tecla presionada OK");
            this.objectDelete();

            return true;
        }

        if (this.actualObjeto == undefined) {
            //actual = intersects[0].object.name;
            this.actualObjeto = intersects[0];
        }

        if (intersects.length > 0) {
            if (!this.seleccionado) {
                intersects[0].object.material.transparent = true;
                intersects[0].object.material.opacity = 0.5;

            }
            if (intersects[0].object.name.localeCompare(this.actualObjeto.name) != 0) {
                this.actualObjeto.object.material.transparent = false;
                this.actualObjeto.object.material.opacity = 1;
            } else {
                this.seleccionado = true;
            }
            //actual = intersects[0].object.name;
            this.actualObjeto = intersects[0];
        }
    }

    // DELETE OBJECT
    public objectDelete() {
        var intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0 && intersects[0] !== this.scene.plane) {
            const intersect = intersects[0];

            // delete cube
            if (intersect.object !== this.scene.plane && intersect.object != null) {
                //console.log(this.objects);
                this.scene.remove(intersect.object.parent);
                //console.log("objeto removido --> ");

                this.objects.splice(this.objects.indexOf(intersect.object), 1);
                //console.log(this.objects);
            }
        }
    }


    //Función para que al mantener pulsado shift haga algo
    public onDocumentKeyDown(event) {

        var intersects = this.raycaster.intersectObjects(this.scene.children, false);

        switch (event.code) {
            //tecla shift
            case 'ShiftLeft':
                this.isShiftDown = true;
                break;

        }
    }

    //Función para que al dejar de pulsar shift no haga nada
    public onDocumentKeyUp(event) {

        switch (event.keyCode) {
            //tecla shift
            case 16:
                this.isShiftDown = false;
                break;

        }

    }
}
