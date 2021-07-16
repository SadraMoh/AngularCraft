import * as THREE from "three";
import { EngineService } from "../engine/engine.service";

export class Renderable {

    public isRendered: boolean = false;

    public mesh: THREE.Mesh = new THREE.Mesh();

    constructor(protected engine: EngineService) { };

    dispose(): void {
        this.engine.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
    }

}
