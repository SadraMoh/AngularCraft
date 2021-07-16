import { ElementRef, Injectable, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { MeshStandardMaterial } from 'three';
import { Block } from '../models/block';
import { Chunk, ChunkHeight, ChunkSize, fillWithAir } from '../models/chunk';
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
        block.y = Math.round(Math.random() * ChunkHeight);
        block.z = z;
        ans.push(block);
      }
    }

    return ans;
  }


  GenerateRandom(): Block[] {

    const ans: Block[] = [];

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

    const e = require('noisejs');

    const noise = new e.Noise(Math.random());

    for (let x = 0; x < ChunkSize; x++) {
      for (let z = 0; z < ChunkSize; z++) {

        const n = (noise.simplex2(x, z) + 1) * 50
        const block = new Block(this.engine);
        console.log(n);
        (<MeshStandardMaterial>block.mesh.material).color = new THREE.Color(n * 1118481);
        block.x = x;
        block.y = 0;
        block.z = z;

        ans.push(block);
      }
    }

    return ans;

  }

  GenerateSine(chunkX: number = 0, chunkZ: number = 0, amplitude = 2.5, altitude = ChunkSize / 2): Block[][][] | null[][][] {

    const ans: Block[][][] | null[][][] = fillWithAir();

    const chunkXbegin = chunkX * ChunkSize;
    const chunkXend = (chunkX + 1) * ChunkSize;
    const chunkZbegin = chunkZ * ChunkSize;
    const chunkZend = (chunkZ + 1) * ChunkSize;

    console.log({
      chunkXbegin: chunkXbegin,
      chunkXend: chunkXend,
      chunkZbegin: chunkZbegin,
      chunkZend: chunkZend,
    })

    let xCounter = 0
    for (let x = chunkXbegin; x < chunkXend; x++) {
      let zCounter = 0;
      for (let z = chunkZbegin; z < chunkZend; z++) {
        const block = new Block(this.engine);
        const y = Math.round((Math.sin(x / ChunkSize * Math.PI * 4) + Math.sin(z / ChunkSize * Math.PI * 6)) * amplitude + altitude);

        block.x = x;
        block.y = y;
        block.z = z;

        ans[xCounter][y][zCounter] = block;
        zCounter++
      }
      xCounter++
    }

    return <Block[][][] | null[][][]>ans;

  }

  // GenerateSine(amplitude = 2.5, altitude = ChunkSize / 2): Block[] {

  //   const ans: Block[] = [];

  //   for (let x = 0; x < ChunkSize; x++) {
  //     for (let z = 0; z < ChunkSize; z++) {
  //       const block = new Block(this.engine);
  //       block.x = x;
  //       block.y = Math.round((Math.sin(x / ChunkSize * Math.PI * 4) + Math.sin(z / ChunkSize * Math.PI * 6)) * amplitude + altitude);
  //       block.z = z;
  //       ans.push(block);
  //     }
  //   }

  //   return ans;

  // }

  GenerateMountany(chunkX: number, chunkZ: number): Block[] {

    const ans: Block[] = [];

    for (let y = 0; y < ChunkSize; ++y) {
      for (let z = 0; z < ChunkSize; ++z) {
        for (let x = 0; x < ChunkSize; ++x) {

          const height = (Math.sin(x / ChunkSize * Math.PI * 4) + Math.sin(z / ChunkSize * Math.PI * 6)) * 20 + ChunkSize / 2;

          if (height > y && height < y + 1) {
            const offset = y * ChunkSize * ChunkSize +
              z * ChunkSize +
              x;

            ans.push(new Block(this.engine, new THREE.MeshPhongMaterial({ color: 0x118833 })))

          }

        }
      }
    }

    return ans;
  }

}
