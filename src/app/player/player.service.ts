import { Injectable } from '@angular/core';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { EngineService } from '../engine/engine.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private engine: EngineService) {
 

  }
  
}
