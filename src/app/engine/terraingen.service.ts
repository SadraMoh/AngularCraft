import { Injectable } from '@angular/core';
import { Block } from '../models/block';
import { ChunkHeight, ChunkSize } from '../models/chunk';
import { EngineService } from './engine.service';

declare var require: any

@Injectable({
  providedIn: 'root'
})
export class TerraingenService {

  constructor(protected engine: EngineService) { }

  GenerateFlat(): Block[] {

    const ans: Block[] = [];

    for (let x = 0; x < ChunkSize; x++) {
      for (let z = 0; z < ChunkSize; z++) {
        const block = new Block(this.engine);
        block.x = x;
        block.y = 0;
        block.z = z;
        ans.push(block);
      }
    }

    return ans;
  }


  GenerateRandom(): Block[] {

    const ans: Block[] = [];

    const perlin = require('perlin-noise');

    perlin.generatePerlinNoise(480, 480);

    for (let x = 0; x < ChunkSize; x++) {
      for (let z = 0; z < ChunkSize; z++) {
        const r = Math.round(Math.random() * 8);

        for (let y = 0; y < r; y++) {
          const block = new Block(this.engine);
          block.x = x;
          block.y = y;
          block.z = z;
          ans.push(block);
        }
      }
    }

    return ans;
  }

  GenerateHilly(): Block[] {

    const ans: Block[] = [];

    const perlin = require('perlin-noise');

    const e = perlin.generatePerlinNoise(480, 480);

    console.log(e)

    // for (let x = 0; x < ChunkSize; x++) {
    //   for (let z = 0; z < ChunkSize; z++) {

    //     const block = new Block(this.engine);
    //     block.x = x;
    //     block.y = perlin.;
    //     block.z = z;

    //     ans.push(block);
    //   }
    // }

    return ans;

  }

  GenerateSine(): Block[] {

    const ans: Block[] = [];

    for (let x = 0; x < ChunkSize; x++) {
      for (let z = 0; z < ChunkSize; z++) {

        const block = new Block(this.engine);
        block.x = x;
        block.y = Math.sin((x) + (z));
        block.z = z;
        ans.push(block);
      }
    }

    return ans;

  }

}
