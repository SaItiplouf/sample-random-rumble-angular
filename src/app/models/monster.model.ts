export interface IMonster {
  id: number;
  name: string;
  pvMax: number;
  pv: number;
  isMonsterOnFire: boolean;
  isMonsterOnPoison: boolean;
  isMonsterOnDamage: boolean;
}

export const initialMonster: IMonster = {
  id: 1,
  name: 'Wither',
  pvMax: 300,
  pv: 300,
  isMonsterOnFire: false,
  isMonsterOnPoison: false,
  isMonsterOnDamage: false,
};
