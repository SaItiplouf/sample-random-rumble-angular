import {createAction, props} from '@ngrx/store';

export const resetGame = createAction('[Game] Reset');

export const startButtonClick = createAction('[Game] Start Button Click');
export const incrementClickCount = createAction('[Game] Increment Click Count');

export const setGameState = createAction(
  '[Game] Set Game State',
  props<{ gameState: 'running' | 'win' | 'lose' }>()
);
