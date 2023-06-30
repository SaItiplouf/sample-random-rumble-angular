import {createAction, props} from '@ngrx/store';
import { IPlayer } from '../models/player.model';

export const hitPlayer = createAction(
  '[Monster] Attack Player',
  props<{ player: IPlayer; damage: number; }>()
);
