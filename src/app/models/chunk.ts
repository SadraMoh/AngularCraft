import { Vector, Vector2 } from "three";
import { Block } from "./block";

export const ChunkSize = 16;
export const ChunkHeight = ChunkSize;

export class Chunk {

    /** X Y Z */
    blocks: Block[] = [];

    coordinations: Vector2 = new Vector2(1, 1);

    type: ChunkType = ChunkType.flat;

    constructor(blocks: Block[], coordinations: Vector2, type: ChunkType = ChunkType.flat) {
        this.blocks = blocks;
        this.type = type;
        this.coordinations = coordinations;

        // -4 -3 -2 -1 1 2 3 4 <--
        // Add by one if zero or more
        if (coordinations.x >= 0) {
            for (const block of blocks) {
                block.x *= coordinations.x + 1;
            }
        }
        // Do not add by one 
        else if (coordinations.x < 0) {
            for (const block of blocks) {
                block.x *= coordinations.x;
            }
        }

        if (coordinations.y >= 0) {
            for (const block of blocks) {
                block.z *= coordinations.y + 1;
            }
        }
        else if (coordinations.y < 0) {
            for (const block of blocks) {
                block.z *= coordinations.y;
            }
        }

    }

}

export enum ChunkType {
    flat, terrain, mountain
}
