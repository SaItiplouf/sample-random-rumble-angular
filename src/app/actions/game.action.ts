import { createAction } from '@ngrx/store';

export const resetGame = createAction('[Game] Reset');

export const startButtonClick = createAction('[Game] Start Button Click');
export const incrementClickCount = createAction('[Game] Increment Click Count');
