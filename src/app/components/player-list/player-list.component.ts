import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from 'src/app/reducers/game.reducer';
import { IPlayer } from "../../models/player.model";

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {

  players: IPlayer[] = [];

  constructor(private store: Store<{ game: GameState }>) {}

  ngOnInit() {


    this.store.select(state => state.game).subscribe(game => {
      this.players = game.players;
    });
  }
}
