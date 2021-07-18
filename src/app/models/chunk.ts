import { Vector, Vector2 } from "three";
import { EngineService } from "../engine/engine.service";
import { Block } from "./block";

export const ChunkSize = 16 // 16;
export const ChunkHeight = ChunkSize;

export class Chunk {

    /** X Y Z */
    blocks: Block[][][] | null[][][] = fillWithAir();

    coordinations: Vector2 = new Vector2(1, 1);

    type: ChunkType = ChunkType.flat;

    constructor(blocks: Block[][][] | null[][][], coordinations: Vector2, private engine: EngineService, type: ChunkType = ChunkType.flat) {
        this.blocks = blocks;
        this.type = type;
        this.coordinations = coordinations;

        // // -4 -3 -2 -1 1 2 3 4 <--
        // // Add by one if zero or more
        // if (coordinations.x >= 0) {
        //     for (const block of blocks) {
        //         block.x *= coordinations.x + 1;
        //     }
        // }
        // // Do not add by one 
        // else if (coordinations.x < 0) {
        //     for (const block of blocks) {
        //         block.x *= coordinations.x;
        //     }
        // }

        // if (coordinations.y >= 0) {
        //     for (const block of blocks) {
        //         block.z *= coordinations.y + 1;
        //     }
        // }
        // else if (coordinations.y < 0) {
        //     for (const block of blocks) {
        //         block.z *= coordinations.y;
        //     }
        // }

    }

    /** 
     * Get block from this chunk
     * @param x local value of X within the chunk
     * @param y local value of Y within the chunk
     * @param z local value of X within the chunk
     * @returns The requested block if one is found, {@link undefined} if no block was present at the specified location
     */
    getBlock(x: number, y: number, z: number): Block | null {
        // return this.blocks.filter(block => block.x == x && block.y == y && block.z == z)[0];
        return this.blocks[x][y][z];
    }

    /** 
     * Set a block inside this chunk
     * @param x local value of X within the chunk
     * @param y local value of Y within the chunk
     * @param z local value of X within the chunk
     * @remarks Will replace a pre-existing block if a block with the same coordinations exist
     */
    setBlock(x: number, y: number, z: number, block: Block): void {
        this.blocks[x][y][z] = block;
    }

    /**
     * Renders all the blocks in this chunk to the scene
     */
    render(): void {

        const positions = [];
        const normals = [];
        const indices = [];

        // Find which voxels and indices need to be rendered
        for (let x = 0; x < ChunkSize; x++) {
            for (let y = 0; y < ChunkHeight; y++) {
                for (let z = 0; z < ChunkSize; z++) {

                    //this.blocks[x][y][z]?.render();

                    const block = this.blocks[x][y][z];
                    if (!block) continue; // ignore if air

                    for (const { dir, corners } of block.faces) {
                        const neighbor = this.engine.getBlock(
                            x * ChunkSize + dir[0],
                            y + dir[1],
                            z * ChunkSize + dir[2]);

                        if (!neighbor) {
                            // this voxel has no neighbor in this direction so we need a face
                            // here.
                            const ndx = positions.length / 3;
                            for (const pos of corners) {
                                positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                                normals.push(...dir);
                            }
                            indices.push(
                                ndx, ndx + 1, ndx + 2,
                                ndx + 2, ndx + 1, ndx + 3,
                            );
                        }
                    }

                }
            }
        }

        // Render geometry
        
    }

    /**
     * Removes all the blocks in this chunk from the scene
     */
    hide(): void {
        for (let x = 0; x < ChunkSize; x++) {
            for (let y = 0; y < ChunkHeight; y++) {
                for (let z = 0; x < ChunkSize; z++) {

                    this.blocks[x][y][z]?.hide();

                }
            }
        }
    }


}

export enum ChunkType {
    flat, terrain, mountain
}

/**
 * Empty space
 * @returns A three dimentional matrix full of null
 */
export function fillWithAir(): null[][][] | Block[][][] {
    return Array.from({ length: ChunkSize }, () => Array.from({ length: ChunkHeight }, () => Array.from({ length: ChunkSize }))) as Block[][][]
}