import { Component, Input } from '@angular/core';
import { Store } from "@ngrx/store";
import { GameState } from "../../reducers/game.reducer";
import { hitMonster } from "../../actions/player.action";
import { hitPlayer } from "../../actions/monster.action";

function generateRandomDamage(minDamage: number, maxDamage: number): number {
  return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
}

@Component({
  selector: 'app-button-capacity',
  templateUrl: './button-capacity.component.html',
  styleUrls: ['./button-capacity.component.scss']
})
export class ButtonCapacityComponent {
  @Input() player?: any;

  constructor(private store: Store<{ game: GameState }>) {}

  onClick() {
    const playerMinDamage = 5;
    const playerMaxDamage = 15;
    const monsterMinDamage = 10;
    const monsterMaxDamage = 30;

    if (this.player) {
      const playerId = this.player.id;

      const playerDamage = generateRandomDamage(playerMinDamage, playerMaxDamage);
      this.store.dispatch(hitMonster({ damage: playerDamage, playerId }));

      setTimeout(() => {
        if (Math.random() <= 0.25) { // Probabilité de 25%
          const monsterDamage = generateRandomDamage(monsterMinDamage, monsterMaxDamage);
          this.store.dispatch(hitPlayer({ player: this.player, damage: monsterDamage }));
        }
      }, 500);
    }
  }
}
