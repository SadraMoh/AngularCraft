import * as THREE from "three";
import { EngineService } from "../engine/engine.service";

export class Renderable {

    public isRendered: boolean = false;

    public mesh: THREE.Mesh = new THREE.Mesh();

    constructor(protected engine: EngineService) { };

    render(x: number = 0, y: number = 0, z: number): void {
        this.engine.scene.add(this.mesh);

        this.isRendered = true;
        
        this.mesh.translateX(x);
        this.mesh.translateY(y);
        this.mesh.translateZ(z);
    }

    dispose(): void {
        this.engine.scene.remove(this.mesh);
    }

}
