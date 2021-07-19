import { Vector, Vector2 } from "three";
import { EngineService } from "../engine/engine.service";
import { Block, CubeSide } from "./block";

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

        // Find which voxels and indices need to be rendered
        for (let x = 0; x < ChunkSize; x++) {
            for (let y = 0; y < ChunkHeight; y++) {
                for (let z = 0; z < ChunkSize; z++) {

                    //this.blocks[x][y][z]?.render();

                    const block = this.blocks[x][y][z];
                    if (!block) continue; // ignore if air

                    const sidesToRender: number[] = [];
                    // Cycle through all the faces of the block and find which sides have neighbours
                    for (const { dir, corners, indx } of Block.faces) {
                        const neighbor = this.engine.getBlock(
                            block.x + dir[0],
                            block.y + dir[1],
                            block.z + dir[2]);

                        if (!neighbor) {

                            // Render this face
                            sidesToRender.push(...indx);

                        }
                    }

                    block.render(sidesToRender);

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

/**
  * Convert a blocks global coordinations to its local position within its chunk
  * @param blockX The blocks global X coordination
  * @param blockZ The blocks global Z coordination
  * @returns Local coordinations of the block as `{ x, z }`
  *  */
export function globalToLocal(blockX: number, blockZ: number): { blockX: number, blockZ: number } {

    blockX = blockX % ChunkSize;

    blockZ = blockZ % ChunkSize;

    return { blockX: blockX, blockZ: blockZ }

}

/**
  * Convert a blocks global coordinations to its local position within its chunk
  * @param blockX The blocks local X coordination within its chunk
  * @param blockZ The blocks local Z coordination within its chunk
  * 
  * @returns Global coordinations of the block as `{ x, z }`
  *  */
export function localToGlobal(blockX: number, blockZ: number, chunkX: number, chunkZ: number): { blockX: number, blockZ: number } {

    blockX = (chunkX * ChunkSize) + blockX;

    blockZ = (chunkZ * ChunkSize) + blockZ;

    return { blockX: blockX, blockZ: blockZ }

}