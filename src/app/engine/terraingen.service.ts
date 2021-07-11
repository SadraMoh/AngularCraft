import { Injectable } from '@angular/core';
import { Block } from '../models/block';
import { ChunkHeight, ChunkSize } from '../models/chunk';
import { EngineService } from './engine.service';

@Injectable({
  providedIn: 'root'
})
export class TerraingenService {

  constructor(protected engine: EngineService) { }

  GenerateFlat(): Block[][][] {

    const ans: Block[][][] = new Array(ChunkSize).fill(new Array(ChunkHeight).fill(new Array(ChunkSize).fill(undefined)));


    const y = ChunkHeight / 2;

    for (let x = 0; x < ChunkSize; x++) {
      for (let z = 0; z < ChunkSize; z++) {
        ans[x][y][z] = new Block(this.engine);
      }
    }
    
    // for (let x = 0; x < 2; x++) {
    //   for (let z = 0; z < 2; z++) {
    //     ans[x][5][z] = new Block(this.engine);
    //   }
    // }
    

    return ans;
  }
}
