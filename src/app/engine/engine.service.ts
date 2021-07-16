import { EventEmitter, HostListener, Injectable } from '@angular/core';
import { GUI } from 'dat.gui';
import { fromEvent, Observable } from 'rxjs';
import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Block } from '../models/block';
import { Chunk, ChunkHeight, ChunkSize } from '../models/chunk';
import { Renderable } from '../models/renderable';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  //#region voxels

  /** World Map (X,Y) */
  world: Chunk[][] = [];

  /**
   * Get block by it's position
   * @param x global coordination of X 
   * @param y global coordination of Y 
   * @param z global coordination of Z
   * @returns The requested block if one is found, {@link null}  if no block was present at the specified location
   * @throws {@link TypeError} is thrown if the specified index out of range
   *  */
  getBlock(x: number, y: number, z: number): Block | null {

    // integer division of X
    const chunkX = Math.floor(x / ChunkSize);
    const blockX = x % ChunkSize;

    // ingeter division of Y
    const chunkY = Math.floor(y / ChunkSize);
    const blockY = y % ChunkSize;

    return this.world[chunkX][chunkY].getBlock(blockX, blockY, z);
  }

  /**
   * Set a block inside it's apropriate chunk
   * @param x global coordination of X 
   * @param y global coordination of Y 
   * @param z global coordination of Z
   * @throws {@link TypeError} is thrown if the specified index out of range
   *  */
  setBlock(x: number, y: number, z: number, block: Block): void {

    // integer division of X
    const chunkX = Math.floor(x / ChunkSize);
    const blockX = x % ChunkSize;

    // ingeter division of Y
    const chunkY = Math.floor(y / ChunkSize);
    const blockY = y % ChunkSize;

    this.world[chunkX][chunkY].setBlock(blockX, blockY, z, block);
  }

  //#endregion

  /**
   * Sizes
   */
  width: number = window.innerWidth;
  height: number = window.innerHeight;

  /** First person view camera */
  public camera!: THREE.PerspectiveCamera;

  //#region Canvas

  /** When the canvas element is initialized */
  public canvasViewInit: EventEmitter<HTMLCanvasElement> = new EventEmitter<HTMLCanvasElement>();

  public canvas!: HTMLCanvasElement;

  public sun: THREE.DirectionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);

  public initCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasInitialized();
    this.canvasViewInit.emit(this.canvas);

    this.scene.background = new THREE.Color('lightblue');

    this.sun.position.set(-1, 2, 4);
    this.scene.add(this.sun);

  }

  //#endregion Canvas

  // Debug
  public gui = new GUI();
  // Scene
  public scene: THREE.Scene = new THREE.Scene();

  /** Renderer*/
  public renderer!: THREE.WebGLRenderer;

  public tick: EventEmitter<number> = new EventEmitter<number>();

  /** Frame time */
  public clock: THREE.Clock = new THREE.Clock(false)

  constructor() { }

  /** Initialize code that depends on the canvas element */
  private canvasInitialized(): void {

    /** Initialize Renderer */
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    })

    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100)
    this.camera.position.x = 0
    this.camera.position.y = 10
    this.camera.position.z = 2
    this.camera.rotateX(Math.PI / -8)
    this.scene.add(this.camera)


    // FLY CONTROLS the camera is given as the first argument, and
    // the DOM element must now be given as a second argument
    // let flyControls = new FlyControls(this.camera, this.canvas);
    // flyControls.dragToLook = true;
    // flyControls.movementSpeed = 25;
    // flyControls.rollSpeed = 1;

    const controls = new OrbitControls(this.camera, this.canvas);
    // target should be at the center of the scene
    controls.target.set(ChunkSize / 2, ChunkSize / 4, ChunkSize / 2);
    controls.zoomSpeed = 4;
    controls.update();

    // start timer
    this.clock.start();

    let number = 0;

    let lt = new Date();

    const ticked = () => {
      // Update Orbital Controls
      // controls.update()

      const elapsedTime = this.clock.getElapsedTime()

      // Announce that a tick has passed
      this.tick.emit(elapsedTime);

      // Update controls
      // flyControls.update(0.01);
      controls.update();


      // Render
      this.renderer.render(this.scene, this.camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(ticked);
    }

    ticked();

    /** Adjust view aspect ratio when the window was resized */
    fromEvent(window, 'resize').subscribe(() => {
      // Update sizes
      this.width = window.innerWidth
      this.height = window.innerHeight

      // Update camera
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix()

      // Update renderer
      this.renderer.setSize(this.width, this.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    });

  }

  renderChunk(chunk: Chunk) {

    for (const x of chunk.blocks) {
      for (const y of x) {
        for (const block of y) {
          if (block) {
            block.mesh.position.x = Math.floor(Math.random() * 16);
            block.mesh.position.y = Math.floor(Math.random() * 256);
            block.mesh.position.z = Math.floor(Math.random() * 16);
            this.scene.add(block.mesh);
          }
        }
      }
    }

    // for (const block of chunk.blocks) {
    //   this.scene.add(block.mesh);
    // }

    console.log('rendered')

  }




}
