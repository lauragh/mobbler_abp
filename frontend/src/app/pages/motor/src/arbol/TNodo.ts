import { mat3,vec3,mat4, glMatrix, mat2 } from 'gl-matrix';
import { TEntidad } from './TEntidad';

// import { vec4 } from '../../node_modules/gl-matrix/vec4';

// NODO RAIZ
class TNodo{

    // atributos para el arbol y la entidad
    private root: TNodo;
    private children: TNodo[];
    private entity: TEntidad;

    
    // atributos para las transformaciones
    private translate: vec3;
    private rotate: vec3;
    private scale: vec3;
    private matrixTransf: mat4;
    
    // flag para el recorrido. si se hace alguna transformacion ==> TRUE, así nos ahorramos cálculos
    private updateMatrix: boolean;
    
    constructor(matTranf: mat4, root: TNodo, ent: TEntidad, children: TNodo[], tras: vec3, rot: vec3, esc: vec3){
        // Inicializacion
        this.matrixTransf = mat4.create();
        this.children = [];
        this.translate = vec3.create();
        this.rotate = vec3.create();
        this.scale = vec3.create();
        
        // Asignacion
        this.matrixTransf = matTranf;
        this.root = root;
        this.entity = ent;
        this.children = children;
        this.translate = tras;
        this.rotate = rot;
        this.scale = esc;

        this.updateMatrix = false;
        
    }
    

    // Agregar hijo
    addChild(child: TNodo): boolean{
        if(child){
            this.children.push(child);
            return true;
        }
        return false;
    }

    // Eliminar hijo
    deleteChild(child: TNodo): boolean{

        var index = 1;
        if(child){
            this.children.forEach(c => {
                if(child == c){
                    //console.log("Entra en el borrado");
                    var idx = this.children.indexOf(child);
                    this.children.splice(idx, 1);
                    return true;
                }
                index = index++;
            }); 
        }
        return false;
    }
    
    // recorrer el arbol
    recorrer(matrixAcum: mat4): void{
        if(this.updateMatrix == true){
            mat4.multiply(this.matrixTransf, matrixAcum, this.calcMatrix());
            this.updateMatrix = false;
        }

        
        this.entity.draw(this.matrixTransf);
            
        this.children.forEach(element => {
            element.recorrer(this.getTransf());
                
        });
    }

    // LocalModelMatrix (LocalModelMatrix = TranslationMatrix * RotationMatrix * ScaleMatrix)
    calcMatrix(): mat4{
        var mat4Aux: mat4;
        mat4Aux = mat4.create();

        // Multiplicar
        this.translateObj(this.translate);
        this.rotateObjX(0);
        this.rotateObjY(0);
        this.rotateObjZ(0);
        this.scaleObj(this.scale);

        this.matrixTransf = mat4Aux;
        
        return mat4Aux;
    }

    // ModelMatrix = ParentModelMatrix * LocalModelMatrix
    modelMatrix(): mat4{
        var matAux4: mat4 = mat4.create();
        if(this.root){
            mat4.multiply(matAux4, this.root.getTransf(), this.calcMatrix());
        }
      return matAux4;
    }

    // ViewMatrix = inversa de la matriz de camara
    viewMatrix(): mat4{ 
        var matAux4: mat4 = mat4.create();

        return mat4.invert(matAux4, this.matrixTransf); // inversa de matriz de transformacion = matriz de camara??
    }

    // TRASLACION
    translateObj(vector3: vec3): void{
        if(vector3){
            mat4.translate(this.matrixTransf, this.matrixTransf, vector3);
            this.updateMatrix = true;
            
        }
    }

    // ROTACION EJE X
    rotateObjX(grados: number): void{
        
        var rads = glMatrix.toRadian(grados); // GRADOS --> RAD
        mat4.rotate(this.matrixTransf, this.matrixTransf, rads, [1,0,0]);
        this.updateMatrix = true;

    }

    // ROTACION EJE Y
    rotateObjY(grados: number): void{
        
        var rads = glMatrix.toRadian(grados);
        mat4.rotate(this.matrixTransf, this.matrixTransf, rads, [0,1,0]);
        this.updateMatrix = true;

    }

    // ROTACION EJE Z
    rotateObjZ(grados: number): void{

        var rads = glMatrix.toRadian(grados);
        mat4.rotate(this.matrixTransf, this.matrixTransf, rads, [0,0,1]);
        this.updateMatrix = true;

    }

    // ESCALADO
    scaleObj(vector3: vec3): void{
        if(vector3){
            mat4.fromScaling(this.matrixTransf, this.scale);
            this.updateMatrix = true;
        }
    }


    // -------------------------------------------------------------------------------------------------
    // -------------------------------------- GETTERS AND SETTERS --------------------------------------
    // -------------------------------------------------------------------------------------------------
    
    getTransf(): mat4{
        return this.matrixTransf;
    }
    
    getEntidad(): TEntidad{
        return this.entity;
    }

    getRoot(): TNodo{
        return this.root;
    }

    getChildren(): TNodo[]{
        return this.children;
    }

    setTansf(matrixTranf: mat4): void{
        this.matrixTransf = matrixTranf;
        this.updateMatrix = true;
    }

    setEntidad(entity: TEntidad): boolean{
        if(entity){
            this.entity = entity;
            this.updateMatrix = true;
            return true;
        }
        this.entity = null;
        return false;
    }

    setRoot(root: TNodo): boolean{
        if(root){
            this.root = root;
            this.updateMatrix = true;
            return true;
        }
        this.root = null;
        return false;
    }

    setTaslacion(vectorTras: vec3): boolean{
        if(vectorTras){
            vec3.add(this.translate, this.translate, vectorTras);
            this.updateMatrix = true;
            return true;
        }
        return false;
    }

    setRotate(vectorRot: vec3): boolean{
        if(vectorRot){
            vec3.add(this.rotate, this.rotate, vectorRot);
            this.updateMatrix = true;
            return true;
        }
        return false;
    }

    setScale(vectorScale: vec3): boolean{
        if(vectorScale){
            vec3.multiply(this.scale, this.scale, vectorScale);
            this.updateMatrix = true;
            return true;
        }
        return false;
    }

    setUpdateMatrix(){
        this.updateMatrix = true;
    }

}


export {TNodo}