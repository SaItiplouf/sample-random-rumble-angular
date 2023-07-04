import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IPlayer } from "../../models/player.model";
import { Store } from '@ngrx/store';
import {hitPlayer, setMonsterOnDamage, setMonsterOnFire} from "../../actions/monster.action";
import { GameState } from "../../reducers/game.reducer";
import { updatePlayerScore, setPlayerDead, hitMonster, enflammer } from "../../actions/player.action";
import {Router} from "@angular/router";
import {filter, take} from "rxjs";

function generateRandomDamage(minDamage: number, maxDamage: number): number {
  return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
}

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit {
  @Input() player!: IPlayer;
  @Output() clickCountEvent: EventEmitter<number> = new EventEmitter<number>();
  showNewButton: boolean = false;
  clickCount: number = 0;
  consecutiveClicks: number = 0;
  static fireSound = new Audio('../../../assets/fire.mp3');
  static hitSound = new Audio('../../../assets/hit.mp3');
  isClicking: boolean = false;
  constructor(private store: Store<{ game: GameState }>, private router: Router) {
  }

  ngOnInit() {
    console.log(this.player);
  }

  onClickEnflammer() {
    if (this.player) {
      // Décrémenter le score
      const updatedScore = Math.max((this.player.score ?? 0) - 3, 0);
      this.store.dispatch(updatePlayerScore({ playerId: this.player.id, score: updatedScore }));
      this.store.dispatch(enflammer({ playerId: this.player.id }));
      this.store.dispatch(setMonsterOnFire({ isMonsterOnFire: true }));
      PlayerCardComponent.fireSound.play();
      this.store.select(state => state.game.monster.isMonsterOnFire).subscribe(isOnFire => {
        console.log('isMonsterOnFire:', isOnFire);
      });

      let damageInterval = setInterval(() => {
        const damage = generateRandomDamage(1, 4); // générer des dégâts aléatoires
        this.store.dispatch(hitMonster({ damage: damage, playerId: this.player.id }));

        // Jouer le son
        PlayerCardComponent.fireSound.currentTime = 0; // Réinitialiser la position de lecture du son à 0
        PlayerCardComponent.fireSound.play(); // Jouer le son
      }, 1000);

      setTimeout(() => {
        clearInterval(damageInterval);
        this.store.dispatch(setMonsterOnFire({ isMonsterOnFire: false }));
        PlayerCardComponent.fireSound.pause(); // Mettre en pause le son
        PlayerCardComponent.fireSound.currentTime = 0; // Réinitialiser la position de lecture du son à 0
      }, 10000);
    }
  }


  onShowNewButtonEvent(value: boolean) {
    this.showNewButton = value;
  }

  onButtonClick() {
    if (!this.isClicking) {
      this.isClicking = true;
      this.clickCount++;
      this.traitementDamage();

      setTimeout(() => {
        this.isClicking = false;
      }, 1000);
    }
  }

  traitementDamage() {
    if (this.player) {
      const playerId = this.player.id;
      const playerDamage = this.clickCount * generateRandomDamage(1,4);

      if (this.player.pv <= 0) {
        return; // Ne pas infliger de dégâts au monstre
      }

      this.store.dispatch(hitMonster({ damage: playerDamage, playerId }));

      this.store.dispatch(setMonsterOnDamage({ isMonsterOnDamage: true }));
      PlayerCardComponent.hitSound.play();
      // Supprimer la classe .on-damage juste après la fin de l'animation
      setTimeout(() => {
        this.store.dispatch(setMonsterOnDamage({ isMonsterOnDamage: false }));
      }, 1000); // Durée de l'animation

      this.clickCount = 0;

      this.hitback();
      console.log(this.consecutiveClicks);
      // Vérifier si le joueur a réussi 10 coups consécutifs
      if (this.consecutiveClicks >= 3) {
        if (this.player.score < 3) {
          const updatedScore = (this.player.score ?? 0) + 1;
          console.log(updatedScore);
          this.store.dispatch(updatePlayerScore({ playerId: this.player.id, score: updatedScore }));
          this.consecutiveClicks = 0;
          console.log("youhhh et hop 1 de score");
        }
      }
    }
  }


  checkAllPlayersDead() {
    console.log("ppl fonction check all dead")

    this.store.select(state => state.game).subscribe((game: GameState) => {
      if (game.players) {

        const allPlayersDead = game.players.every(player => player.isDead);
        if (allPlayersDead) {
          console.log('Tous les joueurs sont morts. Fin de la partie...');
          this.router.navigate(['/', 'win-page']);
          // Remplacez 'win-page' par le chemin de la page de victoire
        }
      }
    });
  }

  hitback() {
    const monsterMinDamage = 25;
    const monsterMaxDamage = 50;

    if (Math.random() <= 0.0001) {
      const monsterDamage = generateRandomDamage(monsterMinDamage, monsterMaxDamage);
      this.store.dispatch(hitPlayer({ player: this.player, damage: monsterDamage }));
      this.consecutiveClicks = 0;

      // Vérifiez si le joueur est mort après avoir été touché
      if (this.player && this.player.pv <= monsterDamage) {
        this.store.dispatch(setPlayerDead({ playerId: this.player.id }));
        console.log("Le joueur a été tué suite à l'attaque du monstre");

        this.checkAllPlayersDead();
      }
    } else {
      this.consecutiveClicks++;
    }
  }
}
