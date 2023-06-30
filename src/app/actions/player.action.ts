import {createAction, props} from '@ngrx/store';

export const hitMonster = createAction('[Player] Attack Monster', props<{ damage: number; playerId: number; }>());

