import { EventEmitter, HostListener, Injectable } from '@angular/core';
import { GUI } from 'dat.gui';
import { fromEvent, Observable } from 'rxjs';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

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

  private canvas!: HTMLCanvasElement;

  public initCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasInitialized();
    this.canvasViewInit.emit(this.canvas);
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
    this.camera.position.y = 1
    this.camera.position.z = 2
    this.camera.rotateX(Math.PI / -8)
    this.scene.add(this.camera)

    // start timer
    this.clock.start();

    let number = 0;
    const ticked = () => {
      // Update Orbital Controls
      // controls.update()

      const elapsedTime = this.clock.getElapsedTime()

      // Announce that a tick has passed
      this.tick.emit(elapsedTime);

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





}
