import * as THREE from "three";
import { EngineService } from "../engine/engine.service";
import { Renderable } from "./renderable";

export class Block extends Renderable {

    name: string = 'block';

    public set geometry(v: THREE.BoxGeometry) {
        this.mesh.geometry = v;
    }

    public get geomtery(): THREE.BoxGeometry {
        return this.mesh.geometry as THREE.BoxGeometry;
    }


    constructor(protected engine: EngineService) {
        super(engine);

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.mesh.material = new THREE.MeshBasicMaterial({  })

    }

}
