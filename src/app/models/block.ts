import * as THREE from "three";
import { EngineService } from "../engine/engine.service";
import { Chunk } from "./chunk";
import { Renderable } from "./renderable";

export class Block extends Renderable {

    name: string = 'block';
    uuid: string = '';

    chunk!: Chunk | undefined;

    //#region Position

    public set x(v: number) {
        this.mesh.position.x = v;
    }

    public get x(): number {
        return this.mesh.position.x
    }

    public set y(v: number) {
        this.mesh.position.y = v;
    }

    public get y(): number {
        return this.mesh.position.y;
    }

    public set z(v: number) {
        this.mesh.position.z = v;
    }

    public get z(): number {
        return this.mesh.position.z;
    }

    //#endregion

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

    constructor(protected engine: EngineService, material: THREE.Material = new THREE.MeshStandardMaterial({ color: 0x119933 /** Math.floor(Math.random() * 16777216) */ })) {
        super(engine);

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.mesh.material = material;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

    }

    generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Render this block to the scene
     */
    render(): void {
        this.engine.scene.add(this.mesh);
    }

    /**
     * Remove this block from the scene
     */
    hide(): void {
        this.engine.scene.remove(this.mesh);
    }

}
