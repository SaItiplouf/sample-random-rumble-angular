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

  constructor(id: number, name: string, pv: number, pvMax: number, mana: number, manaMax: number, image: string, score: number = 0, isDead: boolean = false, classe: string) {
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
  }
}
