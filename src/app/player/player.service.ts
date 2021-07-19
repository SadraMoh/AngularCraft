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

  initial!: Vector3

  constructor(public engine: EngineService) {

    this.engine.canvasViewInit.subscribe(i => {

      this.initial = this.engine.camera.rotation.toVector3();

      this.engine.scene.add(this.player);

      this.engine.camera.parent = this.player;

      this.keydown$ = fromEvent(window, 'keydown') as Observable<KeyboardEvent>;
      this.keyup$ = fromEvent(window, 'keyup') as Observable<KeyboardEvent>;
      this.mousemove$ = fromEvent(window, 'mousemove') as Observable<MouseEvent>;


      //#region Pointer Lock

      const lookAroundSub: Subscription[] = [];

      (fromEvent(this.engine.canvas, 'click') as Observable<MouseEvent>).subscribe(i => {
        if (this.isPointerLocked) {
          // unlock
          document.exitPointerLock();
          lookAroundSub.forEach(i => i.unsubscribe());
        }
        else {
          // lock
          this.engine.canvas.requestPointerLock();
          lookAroundSub.push((fromEvent(this.engine.canvas, 'mousemove') as Observable<MouseEvent>).subscribe(i => this.lookAround(i)));
        }
      });

      (fromEvent(document, 'pointerlockchange')).subscribe(i => {
        this.isPointerLocked = document.pointerLockElement === this.engine.canvas;
        if (!this.isPointerLocked)
          lookAroundSub.forEach(i => i.unsubscribe());
      });

      //#endregion



      this.mousemove$.subscribe((arg) => {

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



  lookAround(event: MouseEvent): void {

    const quaternionAroundY = new THREE.Quaternion();
    quaternionAroundY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * event.movementX / -720);

    this.engine.camera.applyQuaternion(quaternionAroundY)

    const quaternionAroundX = new THREE.Quaternion();
    quaternionAroundX.setFromAxisAngle(this.initial, Math.PI * event.movementX / -720);

    this.engine.camera.applyQuaternion(quaternionAroundX)

  }

  keydown(event: KeyboardEvent): void {

  }

  keyup(event: KeyboardEvent): void {

  }

}


