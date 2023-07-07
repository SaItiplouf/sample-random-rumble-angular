import {createAction, props} from '@ngrx/store';
import { IPlayer } from '../models/player.model';

export const hitPlayer = createAction(
  '[Monster] Attack Player',
  props<{ player: IPlayer; damage: number; }>()
);

export const setMonsterOnFire = createAction(
  '[Monster] Set On Fire',
  props<{ isMonsterOnFire: boolean }>()
);
export const setMonsterOnPoison = createAction(
  '[Monster] Set On Poison',
  props<{ isMonsterOnPoison: boolean }>()
);
export const setMonsterOnDamage = createAction(
  '[Monster] Set On Damage',
  props<{ isMonsterOnDamage: boolean }>()
);
