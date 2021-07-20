import { HostListener, Injectable } from '@angular/core';
import { GUI } from 'dat.gui';
import { fromEvent, Observable, Subscription } from 'rxjs';
import * as THREE from 'three';
import { BoxGeometry, Camera, Mesh, MeshBasicMaterial, MeshLambertMaterial, Vector3 } from 'three';
import { EngineService } from '../engine/engine.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  keydown$!: Observable<KeyboardEvent>;
  keyup$!: Observable<KeyboardEvent>;
  mousemove$!: Observable<MouseEvent>

  body = new BoxGeometry(0.8, 1.8, 0.8);
  skin = new MeshBasicMaterial({ color: 0xffeedd });
  player: Mesh = new Mesh(this.body, this.skin);

  movement: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  isPointerLocked = false;

  constructor(public engine: EngineService) {

    this.engine.canvasViewInit.subscribe(i => {

      this.player.position.set(0, 16, 0);
      this.engine.camera.parent = this.player;
      this.engine.scene.add(this.player);

      this.keydown$ = fromEvent(window, 'keydown') as Observable<KeyboardEvent>;
      this.keyup$ = fromEvent(window, 'keyup') as Observable<KeyboardEvent>;
      this.mousemove$ = fromEvent(window, 'mousemove') as Observable<MouseEvent>;



      //#region Pointer Lock

      (fromEvent(this.engine.canvas, 'click') as Observable<MouseEvent>).subscribe(_ => {
        this.isPointerLocked = document.pointerLockElement === this.engine.canvas;
        if (!this.isPointerLocked) {
          this.engine.canvas.requestPointerLock();
        }
      });

      // #USEFUL triggered when the pointerLock has changed
      // (fromEvent(document, 'pointerlockchange')).subscribe(i => {
      //   console.log('isPointerLocked', this.isPointerLocked)
      // });

      //#endregion


      this.mousemove$.subscribe((arg) => {
        this.lookAround(arg)
      });

      this.keydown$.subscribe((arg) => {
        this.keydown(arg);
      });

      this.keyup$.subscribe((arg) => {
        this.keyup(arg);
      });

      this.engine.tick.subscribe(_ => {
        this.player.translateOnAxis(this.movement, 0.1)
      });

    });

  }

  /** Blocks per second */
  readonly walkingSpeed: number = 4.317;
  readonly sprintingSpeed: number = 5.612;
  readonly sneakingSpeed: number = 1.295;
  readonly flyingSpeed: number = 10.89;

  readonly rotationConstant = 720;

  lookAround(event: MouseEvent): void {

    const angleOfRotationAroundY = Math.PI * event.movementX / this.rotationConstant;

    this.engine.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -angleOfRotationAroundY);

    const angleOfRotationAroundX = Math.PI * event.movementY / this.rotationConstant;

    this.engine.camera.rotateOnAxis(new Vector3(1, 0, 0), -angleOfRotationAroundX)

  }

  keydown(event: KeyboardEvent): void {

    /** Facing direction */
    let direction = new THREE.Vector3();
    this.engine.camera.getWorldDirection(direction);
    direction.y = 0;

    if (event.key === 'w') {

      this.player.position.add(direction.multiplyScalar(1));
    }

    if (event.key === 's') {
      this.player.position.sub(direction.multiplyScalar(1));
    }

    if (event.key === 'd') {

      // Rotate facing direction around y axis
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

      this.player.position.sub(direction.multiplyScalar(1));
    }

    if (event.key === 'a') {

      // Rotate facing direction around y axis
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / -2);

      this.player.position.sub(direction.multiplyScalar(1));
    }

  }

  keyup(event: KeyboardEvent): void {

  }

}


