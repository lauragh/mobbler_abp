// import {TNodo} from './TNodo';
// import { mat3,vec3,mat4, glMatrix,vec4 } from 'gl-matrix';
// import { TCamara, TEntidad, TLuz, TModelo,  } from './TEntidad';

// let scene: TNodo;
// let light: TNodo;
// let camera: TNodo;
// let model: TNodo;

// let eLight: TLuz;
// let eCamera: TCamara;
// let eModel: TModelo;

// let matrix4: mat4 = mat4.create();

// // RAIZ
// scene = new TNodo();
// scene.setEntidad(null);
// scene.setRoot(null);

// // LUZ
// light = new TNodo();
// eLight = new TLuz();
// light.setEntidad(eLight);
// light.setRoot(scene);

// console.log(light.getTransf());
// console.log( light.calcMatrix());
// light.rotateObjX(1);
// console.log(light.getTransf());


// // CAMARA
// camera = new TNodo();
// eCamera = new TCamara(100, 1, 50, 150);
// camera.setEntidad(eCamera);
// camera.setRoot(scene);

// // MODELO
// model= new TNodo();
// eModel = new TModelo();
// model.setEntidad(null);
// model.setRoot(scene);

// console.log(scene.getTransf());

// // AÑADIR HIJO A CAMARA
// let lente = new TNodo();
// let eLente = new TModelo();
// lente.setRoot(camera);
// lente.setEntidad(eLente);
// camera.setEntidad(null);


// // HIJOS
// scene.addChild(light);
// scene.addChild(camera);
// scene.addChild(model);

// camera.addChild(lente);

// // console.log(scene.getChildren().length);

// scene.recorrer(matrix4);


// console.log("Borrado de objeto");
// scene.deleteChild(model);
// console.log(scene.getChildren().length);
// console.log(scene.getChildren());
