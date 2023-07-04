export interface IMonster {
  id: number;
  name: string;
  pvMax: number;
  pv: number;
  isMonsterOnFire: boolean;
  isMonsterOnDamage: boolean;
}

export const initialMonster: IMonster = {
  id: 1,
  name: 'Wither',
  pvMax: 800,
  pv: 400,
  isMonsterOnFire: false,
  isMonsterOnDamage: false,
};
