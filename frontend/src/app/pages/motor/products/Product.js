import * as THREE from "three/build/three.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


class Product extends THREE.Object3D {
  constructor() {
    super();
    this.model = new GLTFLoader();
  }

  createRollOver() {
    const rollOverGeo = this.geometry;
    const rollOverMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.5,
      transparent: true,
    });

    let rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    return rollOverMesh;
  }

}

export default Product;
