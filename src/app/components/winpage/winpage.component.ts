import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { resetGame } from '../../actions/game.action';
import { GameState } from '../../reducers/game.reducer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-winpage',
  templateUrl: './winpage.component.html',
  styleUrls: ['./winpage.component.scss']
})
export class WinpageComponent implements OnInit {
  players: any[] = [];

  constructor(private store: Store<GameState>, private router: Router) { }

  ngOnInit(): void {
    this.store.subscribe(state => {
      console.log(state);
      this.players = state.players; // Assurez-vous que le chemin d'accès à state.players est correct
    });
  }

  onJouerClick() {
    this.store.subscribe(state => { console.log(state, state.players);});
    // this.store.dispatch(resetGame());
    // this.router.navigate(['/']);
  }
}
