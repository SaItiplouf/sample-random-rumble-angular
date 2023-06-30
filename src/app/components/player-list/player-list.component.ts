import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from 'src/app/reducers/game.reducer';
import { IPlayer } from "../../models/player.model";
import { initialPlayers$ } from "../../reducers/game.reducer"; // Modifier le chemin d'importation

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {

  players: IPlayer[] = [];

  constructor(private store: Store<{ game: GameState }>) {}

  ngOnInit() {
    initialPlayers$.subscribe(players => { // Utiliser initialPlayers$ au lieu de initialPlayers
      this.players = players;
      console.log('Joueurs récupérés :', this.players);
    });

    this.store.select(state => state.game).subscribe(game => {
      this.players = game.players;
    });
  }
}
