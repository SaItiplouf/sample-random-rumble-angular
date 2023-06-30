import { Observable, BehaviorSubject } from 'rxjs';

export interface IPlayer {
  id: number;
  name: string;
  pv: number;
  pvMax: number;
  mana: number;
  manaMax: number;
}

export class Player implements IPlayer {
  id: number;
  name: string;
  pv: number;
  pvMax: number;
  mana: number;
  manaMax: number;

  constructor(id: number, name: string, pv: number, pvMax: number, mana: number, manaMax: number) {
    this.id = id;
    this.name = name;
    this.pv = pv;
    this.pvMax = pvMax;
    this.mana = mana;
    this.manaMax = manaMax;
  }
}

