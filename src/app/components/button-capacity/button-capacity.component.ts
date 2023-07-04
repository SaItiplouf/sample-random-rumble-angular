import { Store } from "@ngrx/store";
import { GameState } from "../../reducers/game.reducer";
import {hitMonster, healPlayer, updatePlayerScore} from "../../actions/player.action";
import { hitPlayer } from "../../actions/monster.action";
import { Component, Input, Output, EventEmitter } from '@angular/core';

function generateRandomHeal(minHeal: number, maxHeal: number): number {
  return Math.floor(Math.random() * (maxHeal - minHeal + 1)) + minHeal;
}

@Component({
  selector: 'app-button-capacity',
  templateUrl: './button-capacity.component.html',
  styleUrls: ['./button-capacity.component.scss']
})
export class ButtonCapacityComponent {
  @Output() showNewButtonEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() player?: any;
  @Input() actionType?: string;




  constructor(private store: Store<{ game: GameState }>) {}
  onClickDamage() {
    if (this.player.pv <= 0) {
      return;
    }

    if (this.player) {
      this.showNewButtonEvent.emit(true);

      setTimeout(() => {
        this.showNewButtonEvent.emit(false);
      }, 10000);
    }
  }

  onClickHeal() {
    if (this.player && this.player.score >= 1) {
      if (this.player.pv>= 100) {
        return;
      }
      const updatedScore = this.player.score - 1;
      const playerHeal = generateRandomHeal(10, 20);
      this.store.dispatch(healPlayer({ player: this.player, heal: playerHeal }));
      this.store.dispatch(updatePlayerScore({ playerId: this.player.id, score: updatedScore }));
    }
  }
}
