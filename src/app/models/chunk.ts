import { Vector, Vector2 } from "three";
import { Block } from "./block";

export const ChunkSize = 16;
export const ChunkHeight = 256;

export class Chunk {

    /** X Y Z */
    blockdata: Block[][][] = [];

    coordinations: Vector2 = new Vector2(1, 1);

    type: ChunkType = ChunkType.flat;

    constructor(blockdata: Block[][][], coordinations: Vector2, type: ChunkType = ChunkType.flat) {
        this.blockdata = blockdata;
        this.type = type;
        this.coordinations = coordinations;
    }

}

export enum ChunkType {
    flat, terrain, mountain
}
