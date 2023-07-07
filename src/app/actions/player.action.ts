import {createAction, props} from '@ngrx/store';
import {IPlayer} from "../models/player.model";

export const initPlayers = createAction('[Player] Init player', props<{players : IPlayer[]}>())
export const hitMonster = createAction('[Player] Attack Monster', props<{ damage: number; playerId: number; }>());

export const healPlayer = createAction(
  '[Monster] Heal Player',
  props<{ player: any, heal: number }>()
);

export const updatePlayerScore = createAction(
  '[Player] Update Score',
  props<{ playerId: number, score: number }>()
);

export const setPlayerDead = createAction(
  '[Player] Set Player Dead',
  props<{ playerId: number }>()
);

export const enflammer = createAction(
  '[Player] Enflammer',
  props<{ playerId: number }>()
);
export const poison = createAction(
  '[Player] Poison',
  props<{ playerId: number }>()
);

export const isProtected = createAction(
  '[Player] isProtected',
  props<{ playerId: number }>()
);
