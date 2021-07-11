import * as THREE from "three";
import { EngineService } from "../engine/engine.service";
import { Renderable } from "./renderable";

export class Block extends Renderable {

    name: string = 'block';
    uuid: string = this.generateUUID();

    public set geometry(v: THREE.BoxGeometry) {
        this.mesh.geometry = v;
    }

    public get geomtery(): THREE.BoxGeometry {
        return this.mesh.geometry as THREE.BoxGeometry;
    }

    public set material(v: THREE.Material | THREE.Material[]) {
        this.mesh.material = v;
    }

    public get material(): THREE.Material | THREE.Material[] {
        return this.mesh.material as THREE.Material | THREE.Material[];
    }

    constructor(protected engine: EngineService, material: THREE.Material = new THREE.MeshBasicMaterial({ color: Math.floor(Math.random() * 16777216) })) {
        super(engine);

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.mesh.material = material;


    }

    generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}
