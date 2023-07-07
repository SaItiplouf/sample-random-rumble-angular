import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { resetGame } from '../../actions/game.action';
import { GameState } from '../../reducers/game.reducer';
import { Router } from '@angular/router';
import {IPlayer} from "../../models/player.model";
import {initPlayers} from "../../actions/player.action";
import {GameService} from "../../services/game.service";
import { ActivatedRoute } from '@angular/router';
import {Observable, Subject} from "rxjs";
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-winpage',
  templateUrl: './winpage.component.html',
  styleUrls: ['./winpage.component.scss']
})
  export class WinpageComponent implements OnInit, OnDestroy {
  players: IPlayer[] = [];
  gameState$: Observable<'running' | 'win' | 'lose'>;
  private ngUnsubscribe = new Subject<void>();
  deadPlayers: IPlayer[] = [];

  constructor(private store: Store<{ game: GameState }>, private router: Router, private gameService : GameService, private route: ActivatedRoute) {
    this.gameState$ = this.store.pipe(select(state => state.game.gameState)); // initialisation
  }

  ngOnInit(): void {
  this.getRecentDeadPlayers();

    this.store.select((state)=>state.game).pipe(takeUntil(this.ngUnsubscribe)).subscribe(state => {
      console.log(state);
      this.players = state.players;

    });
    this.gameState$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(gameState => {
      if (gameState === 'running') {
        console.log('Le jeu est en cours.');
      } else if (gameState === 'win') {
        console.log('Vous avez gagné !');
      } else if (gameState === 'lose') {
        console.log('Vous avez perdu.');
      }
    });
  }
  getRecentDeadPlayers(): void {
    const offset = 0;
    const limit = 5;

    this.gameService.getDeadPlayers(offset).subscribe((deadPlayers: IPlayer[]) => {
      this.deadPlayers = deadPlayers.slice(0, limit);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onJouerClick() {
    this.store.dispatch(resetGame());
    this.gameService.getPlayers().subscribe((data :IPlayer[])=>{
      console.log(data)
      this.store.dispatch(initPlayers({players: data}))
    })

    this.router.navigate(['/game']);
  }
  Cimetiere() {
    // this.gameService.getPlayers().subscribe((data :IPlayer[])=>{
    //   console.log(data)
    //   this.store.dispatch(initPlayers({players: data}))
    // })

    this.router.navigate(['/cimetiere']);
  }
}
