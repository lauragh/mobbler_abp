import { mat3,vec3,mat4, glMatrix, mat2 } from 'gl-matrix';
import {RMalla} from '../gestorDeRecursos/recurso'

abstract class TEntidad{
    abstract draw(matrix4: mat4): void;

}

// Entidad LUZ
class TLuz extends TEntidad{

    private intensidad: vec3;

    constructor(intensidad: vec3){
        super();
        // Inicializaciones 
        this.intensidad = vec3.create();

        // Asignaciones
        this.intensidad = intensidad;
    }

    draw(matrix4: mat4): void {
        //console.log("Luz -->", "Instensidad", this.intensidad);
        
    }
    setIntensidad (vector3: vec3): void{
        if(vector3){
            this.intensidad = vector3;
        }
    }
    getIntensidad (): vec3{
        return this.intensidad;
    }
   
}

// Entidad CAMARA
class TCamara extends TEntidad{
    
    private fov: number; // field of view
    private aspect: number; // aspect ratio
    private near: number; // a partir de donde EMPIEZA a renderizar la escena
    private far: number; // hasta donde renderiza
    
    private isPerspective: boolean; // tipo de camara

    constructor(fov: number, aspect: number, near: number, far: number){
        super();

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.isPerspective = true;
    }

    draw(matriz4: mat4): void {
         //console.log("Camara -->", "Parametros(fov, retio, near, far, isPerspective)", this.fov, this.aspect, this.near, this.far, this.isPerspective);
    }

    setPerspectiva (fov: number, aspect: number, near: number, far: number): void{
        
        if(this.isPerspective == true){
            this.fov = fov;
            this.aspect = aspect;
            this.near = near;
            this.far = far;
        }
        
    }
    
    setParalela (x: number, y: number): void{

    }

    // Matriz de Proyeccion
    projectionMatrix(): mat4{
        var matAux4: mat4 = mat4.create();
        
        if(this.isPerspective == true){
            mat4.perspective(matAux4, this.fov, this.aspect, this.near, this.far);
        }

        return matAux4;
    }
 
}

// Entidad MODELO (Malla)
class TModelo extends TEntidad{

    private mesh: RMalla;

    constructor(){
        super();

        this.mesh = new RMalla(''); 
    }

    loadModel(mesh: string){

    }

    draw(matriz4: mat4): void {
         //console.log("Modelo");
    }
    
}
export { TEntidad, TLuz, TCamara, TModelo }