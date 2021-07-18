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

    public set geometry(v: THREE.BufferGeometry) {
        this.mesh.geometry = v;
    }

    public get geometry(): THREE.BufferGeometry {
        return this.mesh.geometry as THREE.BufferGeometry;
    }

    public set material(v: THREE.Material | THREE.Material[]) {
        this.mesh.material = v;
    }

    public get material(): THREE.Material | THREE.Material[] {
        return this.mesh.material as THREE.Material | THREE.Material[];
    }


    public texture: THREE.Texture;

    constructor(protected engine: EngineService, texture: THREE.Texture = new THREE.Texture()) {
        super(engine);

        this.texture = texture;

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

        this.material = new THREE.MeshPhongMaterial({ color: 0x88FF88, map: this.texture });

        const geometry = new THREE.BufferGeometry();

        const numVertices = this.vertices.length;
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        const positions = new Float32Array(numVertices * positionNumComponents);
        const normals = new Float32Array(numVertices * normalNumComponents);
        const uvs = new Float32Array(numVertices * uvNumComponents);
        let posNdx = 0;
        let nrmNdx = 0;
        let uvNdx = 0;

        for (const vertex of this.vertices) {
            positions.set(vertex.pos, posNdx);
            normals.set(vertex.nor, nrmNdx);
            uvs.set(vertex.uv, uvNdx);
            posNdx += positionNumComponents;
            nrmNdx += normalNumComponents;
            uvNdx += uvNumComponents;
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, positionNumComponents));
        geometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(normals, normalNumComponents));
        geometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(uvs, uvNumComponents));

        geometry.setIndex([
            0, 1, 2, 2, 1, 3,        // front
            4, 5, 6, 6, 5, 7,        // right
            8, 9, 10, 10, 9, 11,     // back
            12, 13, 14, 14, 13, 15,  // left
            16, 17, 18, 18, 17, 19,  // top
            20, 21, 22, 22, 21, 23,  // bottom
        ]);

        this.geometry = geometry;
        this.geometry.scale(0.5, 0.5, 0.5)

        this.engine.scene.add(this.mesh);
    }

    /**
     * Remove this block from the scene
     */
    hide(): void {
        this.engine.scene.remove(this.mesh);
    }

    readonly vertices: CubeVertex[] = [
        // front
        { pos: [-1, -1, 1], nor: [0, 0, 1], uv: [0, 0], },    // 0
        { pos: [1, -1, 1], nor: [0, 0, 1], uv: [1, 0], },     // 1
        { pos: [-1, 1, 1], nor: [0, 0, 1], uv: [0, 1], },     // 2

        { pos: [1, 1, 1], nor: [0, 0, 1], uv: [1, 1], },      // 3
        // right
        { pos: [1, -1, 1], nor: [1, 0, 0], uv: [0, 0], },     // 4
        { pos: [1, -1, -1], nor: [1, 0, 0], uv: [1, 0], },    // 5

        { pos: [1, 1, 1], nor: [1, 0, 0], uv: [0, 1], },      // 6
        { pos: [1, 1, -1], nor: [1, 0, 0], uv: [1, 1], },     // 7
        // back
        { pos: [1, -1, -1], nor: [0, 0, -1], uv: [0, 0], },   // 8
        { pos: [-1, -1, -1], nor: [0, 0, -1], uv: [1, 0], },  // 9

        { pos: [1, 1, -1], nor: [0, 0, -1], uv: [0, 1], },    // 10
        { pos: [-1, 1, -1], nor: [0, 0, -1], uv: [1, 1], },   // 11
        // left
        { pos: [-1, -1, -1], nor: [-1, 0, 0], uv: [0, 0], },  // 12
        { pos: [-1, -1, 1], nor: [-1, 0, 0], uv: [1, 0], },   // 13

        { pos: [-1, 1, -1], nor: [-1, 0, 0], uv: [0, 1], },   // 14
        { pos: [-1, 1, 1], nor: [-1, 0, 0], uv: [1, 1], },    // 15
        // top
        { pos: [1, 1, -1], nor: [0, 1, 0], uv: [0, 0], },     // 16
        { pos: [-1, 1, -1], nor: [0, 1, 0], uv: [1, 0], },    // 17

        { pos: [1, 1, 1], nor: [0, 1, 0], uv: [0, 1], },      // 18
        { pos: [-1, 1, 1], nor: [0, 1, 0], uv: [1, 1], },     // 19
        // bottom
        { pos: [1, -1, 1], nor: [0, -1, 0], uv: [0, 0], },    // 20
        { pos: [-1, -1, 1], nor: [0, -1, 0], uv: [1, 0], },   // 21

        { pos: [1, -1, -1], nor: [0, -1, 0], uv: [0, 1], },   // 22
        { pos: [-1, -1, -1], nor: [0, -1, 0], uv: [1, 1], },  // 23
    ];

    readonly faces: CubeFace[] = [
        { // left
            dir: [ -1,  0,  0, ],
            corners: [
              [ 0, 1, 0 ],
              [ 0, 0, 0 ],
              [ 0, 1, 1 ],
              [ 0, 0, 1 ],
            ],
          },
          { // right
            dir: [  1,  0,  0, ],
            corners: [
              [ 1, 1, 1 ],
              [ 1, 0, 1 ],
              [ 1, 1, 0 ],
              [ 1, 0, 0 ],
            ],
          },
          { // bottom
            dir: [  0, -1,  0, ],
            corners: [
              [ 1, 0, 1 ],
              [ 0, 0, 1 ],
              [ 1, 0, 0 ],
              [ 0, 0, 0 ],
            ],
          },
          { // top
            dir: [  0,  1,  0, ],
            corners: [
              [ 0, 1, 1 ],
              [ 1, 1, 1 ],
              [ 0, 1, 0 ],
              [ 1, 1, 0 ],
            ],
          },
          { // back
            dir: [  0,  0, -1, ],
            corners: [
              [ 1, 0, 0 ],
              [ 0, 0, 0 ],
              [ 1, 1, 0 ],
              [ 0, 1, 0 ],
            ],
          },
          { // front
            dir: [  0,  0,  1, ],
            corners: [
              [ 0, 0, 1 ],
              [ 1, 0, 1 ],
              [ 0, 1, 1 ],
              [ 1, 1, 1 ],
            ],
          },
    ];

}

export interface CubeVertex {

    /** The position of the vertex (XYZ) */
    pos: [number, number, number]
    /**  */
    nor: [number, number, number]
    /** Which location of the uv will it take */
    uv: [number, number]

}

export interface CubeFace {

    dir: [number, number, number]

    corners: [[number, number, number], [number, number, number], [number, number, number], [number, number, number]]

}