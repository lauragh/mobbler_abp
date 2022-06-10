import { TNodo } from "./arbol/TNodo";
import { TCamara, TEntidad, TLuz, TModelo } from "./arbol/TEntidad";
import {vec3} from 'gl-matrix';

abstract class motor {
    abstract Scene(): any;
    abstract Camera(traslation: vec3, rotation: vec3, scale: vec3,
                fov: number, aspect: number, near: number, far: number, father?: TNodo): TNodo;
    abstract Light(root: TNodo, traslation: vec3, rotation: vec3, scale: vec3, intensidad: vec3): TNodo;
    abstract Mesh(root: TNodo, traslation: vec3, rotation: vec3, scale: vec3, fichero: string): TNodo;
    abstract Renderer(): any;
    abstract CreateBoxGeometry(): any;
    abstract MeshMaterial() :any;
    abstract createNode(root: TNodo, ent: TEntidad, traslation: vec3, rotation: vec3, scale: vec3): TNodo;

    abstract drawScene(): void;
}

export { motor };