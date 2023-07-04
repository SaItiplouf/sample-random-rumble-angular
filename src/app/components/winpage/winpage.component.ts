import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { resetGame } from '../../actions/game.action';
import { GameState } from '../../reducers/game.reducer';
import { Router } from '@angular/router';
import {IPlayer} from "../../models/player.model";
import {initPlayers} from "../../actions/player.action";
import {GameService} from "../../services/game.service";
@Component({
  selector: 'app-winpage',
  templateUrl: './winpage.component.html',
  styleUrls: ['./winpage.component.scss']
})
export class WinpageComponent implements OnInit {
  players: IPlayer[] = [];

  constructor(private store: Store<{ game: GameState }>, private router: Router, private gameService : GameService) { }


  ngOnInit(): void {
    this.store.select((state)=>state.game).subscribe(state => {
      console.log(state);
      this.players = state.players; // Assurez-vous que le chemin d'accès à state.players est correct
    });
  }

  onJouerClick() {
    this.store.dispatch(resetGame());
    this.gameService.getPlayers().subscribe((data :IPlayer[])=>{
      console.log(data)
      this.store.dispatch(initPlayers({players: data}))
    })

    this.router.navigate(['/']);
  }

}
