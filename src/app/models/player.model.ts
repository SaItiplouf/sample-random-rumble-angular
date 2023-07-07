export interface IPlayer {
  id: number;
  name: string;
  pv: number;
  pvMax: number;
  mana: number;
  manaMax: number;
  image: string;
  score: number;
  isDead: boolean;
  classe: string;
  createdAt: string;
  isProtected: boolean; 
}
export class Player implements IPlayer {
  id: number;
  name: string;
  pv: number;
  pvMax: number;
  mana: number;
  manaMax: number;
  image: string;
  score: number = 0;
  isDead: boolean = false;
  classe: string;
  createdAt: string;
  isProtected: boolean = false;

  constructor(id: number, name: string, pv: number, pvMax: number, mana: number, manaMax: number, image: string, score: number = 0, isDead: boolean = false, classe: string, createdAt: string, isProtected: boolean = false) {
    this.id = id;
    this.name = name;
    this.pv = pv;
    this.pvMax = pvMax;
    this.mana = mana;
    this.manaMax = manaMax;
    this.image = image;
    this.score = score;
    this.isDead = isDead;
    this.classe = classe;
    this.createdAt = createdAt;
    this.isProtected = isProtected;
  }
}

