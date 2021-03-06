import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GUI } from "dat.gui";
import { EngineService } from './engine/engine.service';
import { TerraingenService } from './engine/terraingen.service';
import { Chunk, ChunkHeight, ChunkSize } from './models/chunk';
import { Block } from './models/block';
import { PlayerService } from './player/player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('canvasRef')
  public readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(private engine: EngineService, private terraingen: TerraingenService, private player: PlayerService) {

  }

  ngAfterViewInit(): void {

    // Initialize Canvas
    this.engine.initCanvas(this.canvasRef.nativeElement);

    const worldX = 1;
    const worldY = 1;

    // Load world data and shapes (App initialization point)
    for (let x = 0; x < worldX; x++) {
      this.engine.world.push([]);
      for (let y = 0; y < worldY; y++) {
        const chunk = new Chunk(this.terraingen.GenerateSine(x, y), new THREE.Vector2(0, 0), this.engine);
        this.engine.world[x][y] = chunk;
      }
    }

    // Render world (This would probably be run by an event listener when the player moves)
    for (let x = 0; x < worldX; x++) {
      this.engine.world.push([]);
      for (let y = 0; y < worldY; y++) {
        this.engine.world[x][y].render();
      }
    }


    // for (const block of ans) {
    //   this.engine.scene.add(block.mesh);
    // }

    //-

    // const chunks: Chunk[] = [];

    // for (let x = -1; x < 1; x++) {
    //   for (let z = -1; z < 1; z++) {
    //     const blocks = this.terraingen.GenerateMountany(x, z);
    //     chunks.push(new Chunk(blocks, new THREE.Vector2(x, z)));
    //   }
    // }

    // for (const chunk of chunks) {
    //   this.engine.renderChunk(chunk);
    // }

    // // Objects
    // // const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);
    // const geometry = new THREE.BoxGeometry(1, 1, 1);

    // // Materials

    // const material = new THREE.MeshBasicMaterial()
    // material.color = new THREE.Color(0xee2255)

    // // Mesh
    // const sphere = new THREE.Mesh(geometry, material)
    // this.engine.scene.add(sphere)

    // // Lights

    // const light = new THREE.PointLight(0xffffff, 1, 100);
    // light.position.set(50, 50, 50);
    // this.engine.scene.add(light)

    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
    // this.engine.scene.add(pointLightHelper);

    // // Floor 

    // const floorGeometry = new THREE.PlaneGeometry(2, 2);
    // const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
    // const plane = new THREE.Mesh(floorGeometry, floorMaterial);
    // this.engine.scene.add(plane);


    // const controls = {
    //   lightX: 2,
    //   lightY: 3,
    //   lightZ: 4,
    // }

    // this.engine.gui.add(controls, 'lightX', -10, +10);
    // this.engine.gui.add(controls, 'lightY', -10, +10);
    // this.engine.gui.add(controls, 'lightZ', -10, +10);

    // floorGeometry.rotateX(Math.PI / 2)


    // // Controls
    // // const controls = new OrbitControls(camera, canvas)
    // // controls.enableDamping = true


    // // Update objects
    // this.engine.tick.subscribe((elapsedTime) => { sphere.rotation.y = .5 * elapsedTime })
    // this.engine.tick.subscribe((elapsedTime) => { sphere.position.y = Math.sin(elapsedTime * 2) / 2 })



    // // this.engine.tick.subscribe((elapsedTime) => { sphere.position.y = Math.pow((elapsedTime - 3) - 1, 2) })
    // // this.engine.tick.subscribe((x) => { sphere.position.y = Math.sqrt((x + 3) * (x - 3)) })

  }



}