import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { GameState } from '../reducers/game.reducer';
import { Observable } from 'rxjs';
import {IPlayer, Player} from "../models/player.model";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { shuffle } from 'lodash';
import { map } from 'rxjs/operators';
import { format, parse } from 'date-fns';

@Injectable()
export class GameService {
  private apiUrl = 'https://rumbleapi.projets.garage404.com/api';
  constructor(private router: Router, private http: HttpClient) {}

  getPlayers(): Observable<IPlayer[]> {
    return this.http.get<IPlayer[]>(`${this.apiUrl}/players`).pipe(
      map(players => shuffle(players).slice(0, 3)),
      map(players => players.map(player => new Player(player.id, player.name, player.pv, player.pvMax, player.mana, player.manaMax, player.image, player.score, player.isDead, player.classe, player.createdAt)))
    );
  }

  postDeadPlayer(player: IPlayer): Observable<any> {
    const deadPlayer = [{
      name: player.name,
      pv: player.pv,
      image: player.image,
      classe: player.classe
    }];
    return this.http.post(`${this.apiUrl}/dead-players`, deadPlayer);
  }
  getDeadPlayers(offset: number): Observable<IPlayer[]> {
    return this.http.get<IPlayer[]>(`${this.apiUrl}/get-dead-players/${offset}`).pipe(
      map(players => players.map(player =>
        new Player(
          player.id,
          player.name,
          player.pv,
          0, // pvMax par défaut
          0, // mana par défaut
          0, // manaMax par défaut
          decodeURIComponent(player.image), // Décode le lien de l'image
          0, // score par défaut
          true, // isDead est toujours vrai pour les joueurs morts
          decodeURIComponent(player.classe), // Décode la classe du joueur
          format(new Date(player.createdAt), 'dd/MM/yyyy HH:mm:ss')
        )
      ))
    );
  }




}
