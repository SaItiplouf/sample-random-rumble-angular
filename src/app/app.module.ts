import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { gameReducer } from './reducers/game.reducer';
import { GameService } from './services/game.service';

import { MonsterComponent } from './components/monster/monster.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { PlayerCardComponent } from './components/player-card/player-card.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ButtonCapacityComponent } from './components/button-capacity/button-capacity.component';
import { WinpageComponent } from './components/winpage/winpage.component';
import {GameComponent} from "./components/game/game.component";

@NgModule({
  declarations: [
    AppComponent,
    MonsterComponent,
    PlayerListComponent,
    PlayerCardComponent,
    ProgressBarComponent,
    ButtonCapacityComponent,
    WinpageComponent,
    GameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ game: gameReducer }),
    EffectsModule.forRoot([]),
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})

export class AppModule { }
