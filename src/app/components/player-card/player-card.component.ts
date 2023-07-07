import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IPlayer } from "../../models/player.model";
import { Store } from '@ngrx/store';
import {hitPlayer, setMonsterOnDamage, setMonsterOnFire, setMonsterOnPoison} from "../../actions/monster.action";
import { GameState } from "../../reducers/game.reducer";
import { initPlayers} from "../../actions/player.action";
import {
  updatePlayerScore,
  setPlayerDead,
  hitMonster,
  enflammer,
  healPlayer,
  poison,
  isProtected
} from "../../actions/player.action";
import {Router} from "@angular/router";
import {filter, Subject, take, takeUntil} from "rxjs";
import {GameService} from "../../services/game.service";
import {setGameState} from "../../actions/game.action";
function generateRandomHeal(minHeal: number, maxHeal: number): number {
  return Math.floor(Math.random() * (maxHeal - minHeal + 1)) + minHeal;
}
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
  constructor(private store: Store<{ game: GameState }>, private router: Router, private gameService :GameService, private GameService: GameService) {
  }

  ngOnInit() {
    console.log(this.player);
  }

  onClickHealEveryone() {
    // Récupérer tous les joueurs du store
    this.store.select(state => state.game.players).subscribe(players => {
      players.forEach(player => {
        // Vérifier si le joueur n'est pas mort et s'il n'est pas un médecin avec 100hp
        if (player && !player.isDead && (player.classe !== 'Medecin' || (player.classe === 'Medecin' && player.pv < 100)) && player.score >= 1) {
          const updatedScore = player.score - 1;
          const playerHeal = generateRandomHeal(10, 20);
          this.store.dispatch(healPlayer({ player: player, heal: playerHeal }));
          this.store.dispatch(updatePlayerScore({ playerId: player.id, score: updatedScore }));
        }
        // Si le joueur est un médecin avec 100hp, il peut toujours soigner les autres joueurs
        else if (player && !player.isDead && player.classe === 'Medecin' && player.pv >= 100 && player.score >= 1) {
          players.filter(p => p.id !== player.id && !p.isDead).forEach(p => {
            const updatedScore = player.score - 1;
            const playerHeal = generateRandomHeal(10, 20);
            this.store.dispatch(healPlayer({ player: p, heal: playerHeal }));
            this.store.dispatch(updatePlayerScore({ playerId: player.id, score: updatedScore }));
          });
        }
      });
    });
  }
  addPlayerToStore(): void {
    this.gameService.getPlayers().subscribe((players: IPlayer[]) => {
      const randomPlayerIndex = Math.floor(Math.random() * players.length);
      const randomPlayer: IPlayer = players[randomPlayerIndex];

      this.store.select(state => state.game.players).pipe(take(1)).subscribe((currentPlayers: IPlayer[]) => {
        const updatedPlayers: IPlayer[] = [...currentPlayers, randomPlayer];
        this.store.dispatch(initPlayers({ players: updatedPlayers }));
        const updatedScore = Math.max((this.player.score ?? 0) - 3, 0);
        this.store.dispatch(updatePlayerScore({ playerId: this.player.id, score: updatedScore }));
      });
    });
  }
  onClickProtected() {
    if (this.player) {
      const updatedScore = Math.max((this.player.score ?? 0) - 3, 0);
      this.store.dispatch(updatePlayerScore({ playerId: this.player.id, score: updatedScore }));
      this.store.dispatch(isProtected({ playerId: this.player.id}));
    }
  }
  onClickEnflammer() {
    if (this.player) {
      // Décrémenter le score
      const updatedScore = Math.max((this.player.score ?? 0) - 3, 0);
      this.store.dispatch(updatePlayerScore({ playerId: this.player.id, score: updatedScore }));
      this.store.dispatch(enflammer({ playerId: this.player.id }));
      this.store.dispatch(setMonsterOnFire({ isMonsterOnFire: true }));
      console.log('Le monstre est enflammé :', this.store.select(state => state.game.monster.isMonsterOnFire));
      PlayerCardComponent.fireSound.play();
      this.store.select(state => state.game.monster.isMonsterOnFire).pipe(take(1)).subscribe(isOnFire => {
        console.log('isMonsterOnFire:', isOnFire);
      });

      let damageInterval = setInterval(() => {
        const damage = generateRandomDamage(4, 16); // générer des dégâts aléatoires
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
  onClickPoison() {
    if (this.player) {
      // Décrémenter le score
      const updatedScore = Math.max((this.player.score ?? 0) - 3, 0);
      this.store.dispatch(updatePlayerScore({ playerId: this.player.id, score: updatedScore }));
      this.store.dispatch(poison({ playerId: this.player.id }));
      this.store.dispatch(setMonsterOnPoison({ isMonsterOnPoison: true }));
      PlayerCardComponent.hitSound.play();
      this.store.select(state => state.game.monster.isMonsterOnPoison).subscribe(isOnPoison => {
        console.log('isMonsterOnPoison:', isOnPoison);
      });

      let damageInterval = setInterval(() => {
        const damage = generateRandomDamage(1.5, 20); // générer des dégâts aléatoires
        this.store.dispatch(hitMonster({ damage: damage, playerId: this.player.id }));

        // Jouer le son
        PlayerCardComponent.hitSound.currentTime = 0; // Réinitialiser la position de lecture du son à 0
        PlayerCardComponent.hitSound.play(); // Jouer le son
      }, 1000);

      setTimeout(() => {
        clearInterval(damageInterval);
        this.store.dispatch(setMonsterOnPoison({ isMonsterOnPoison: false }));
        PlayerCardComponent.hitSound.pause(); // Mettre en pause le son
        PlayerCardComponent.hitSound.currentTime = 0; // Réinitialiser la position de lecture du son à 0
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
      const playerDamage = this.clickCount * generateRandomDamage(1,10);

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

  private ngUnsubscribe = new Subject<void>();
  checkAllPlayersDead() {
    console.log("ppl fonction check all dead")

    this.store.select(state => state.game)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((game: GameState) => {
        if (game.players) {
          const allPlayersDead = game.players.every(player => player.isDead);
          if (allPlayersDead) {
            console.log('Tous les joueurs sont morts. Fin de la partie...');
            this.ngUnsubscribe.next();  // Annule l'abonnement
            this.store.dispatch(setGameState({ gameState: 'lose' }));
            this.router.navigate(['']);
          }
        }
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  hitback() {
    const monsterMinDamage = 15;
    const monsterMaxDamage = 50;



    if (Math.random() <= 0.1) {
      if (this.player && this.player.isProtected) {
        console.log("Le Joueur à été épargné")
        this.store.dispatch(isProtected({ playerId: this.player.id }));
        return;
      }
      const monsterDamage = generateRandomDamage(monsterMinDamage, monsterMaxDamage);
      this.store.dispatch(hitPlayer({ player: this.player, damage: monsterDamage }));
      this.consecutiveClicks = 0;

      // Vérifiez si le joueur est mort après avoir été touché
      if (this.player && this.player.pv <= monsterDamage) {
        this.store.dispatch(setPlayerDead({ playerId: this.player.id }));
        console.log("Le joueur a été tué suite à l'attaque du monstre");

        this.gameService.postDeadPlayer(this.player).subscribe(response => {
          console.log('Joueur mort envoyé à l\'API', response);
        }, error => {
          console.error('Erreur lors de l\'envoi du joueur mort à l\'API', error);
        });

        this.checkAllPlayersDead();
      }
    } else {
      this.consecutiveClicks++;
    }
  }
}
