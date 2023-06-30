import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { GameState } from '../reducers/game.reducer';
import { Observable } from 'rxjs';
import { IPlayer } from "../models/player.model";

@Injectable()
export class GameService {
  getPlayers(): Observable<IPlayer[]> {
    return new Observable<IPlayer[]>(observer => {
      fetch('https://rumbleapi.projets.garage404.com/api/players')
        .then(response => response.json())
        .then((players: any[]) => {
          const playerInstances = players.map((player: any) => {
            return {
              id: player.id,
              name: player.name,
              pv: player.pv,
              pvMax: player.pvmax,
              mana: player.mana,
              manaMax: player.manamax
            };
          });

          observer.next(playerInstances);
          observer.complete();
        })
        .catch(error => {
          console.error("Une erreur s'est produite lors de la récupération des joueurs :", error);
          observer.next([]); // Valeur par défaut en cas d'erreur
          observer.complete();
        });
    });
  }

}
