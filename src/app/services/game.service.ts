import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { GameState } from '../reducers/game.reducer';
import { Observable } from 'rxjs';
import {IPlayer, Player} from "../models/player.model";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { shuffle } from 'lodash';
import { map } from 'rxjs/operators';

@Injectable()
export class GameService {
  constructor(private router: Router, private http: HttpClient) {}

  getPlayers(): Observable<IPlayer[]> {
    return this.http.get<IPlayer[]>("https://rumbleapi.projets.garage404.com/api/players").pipe(
      map(players => shuffle(players).slice(0, 3)),
      map(players => players.map(player => new Player(player.id, player.name, player.pv, player.pvMax, player.mana, player.manaMax, player.image, player.score, player.isDead, player.classe)))
    );
  }

}
