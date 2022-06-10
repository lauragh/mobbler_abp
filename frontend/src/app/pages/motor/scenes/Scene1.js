import * as THREE from "three/build/three.module.js";

class Scene1 extends THREE.Scene {
  constructor() {
    super();
    this.geometry_plano = new THREE.PlaneBufferGeometry(8, 8);

    this.material_plano = new THREE.MeshStandardMaterial({
      // el material estandar interactua con la luz
      color: "coral",
      side: THREE.DoubleSide,
    });
    this.plane = new THREE.Mesh(this.geometry_plano, this.material_plano);
    this.plane.name = "plano";
    this.create();

    //console.log(material_plano);
  }

  create() {
    // GRID - rejilla
    const gridHelper = new THREE.GridHelper(3, 7.5, "black", "black");
    //this.add(gridHelper);

    this.geometry_plano.rotateX(-Math.PI / 2);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0x606060, 1);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();

    // ADD
    this.add(ambientLight);
    this.add(directionalLight);
    this.add(this.plane);
  }
}

export default Scene1;
