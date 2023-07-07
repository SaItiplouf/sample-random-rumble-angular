import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IMonster } from 'src/app/models/monster.model';
import { GameState } from 'src/app/reducers/game.reducer';
import { setGameState } from 'src/app/actions/game.action';
import { Router } from '@angular/router';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.scss']
})
export class MonsterComponent implements OnInit, OnDestroy {
  monster?: IMonster;
  private ngUnsubscribe = new Subject<void>();
  private animationFrameId: number | null = null;

  constructor(private store: Store<{ game: GameState }>, private router: Router) {
    document.addEventListener('DOMContentLoaded', this.moveBoss);
  }

  ngOnInit(): void {
    this.store.select(state => state.game)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((game: GameState) => {
        this.monster = game.monster;

        if (this.monster && this.monster.pv && this.monster.pv <= 0) {
          if(this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
          }
          this.ngUnsubscribe.next();
          this.store.dispatch(setGameState({ gameState: 'win' }));
          this.router.navigate(['']);
        }

        // if(game.gameState === 'win') {
        //   this.router.navigate(['/', 'win-page']);
        // }
      });
  }

  ngOnDestroy(): void {
    document.removeEventListener('DOMContentLoaded', this.moveBoss);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if(this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
  moveBoss = () => {
    const bossElement = document.querySelector('#boss') as HTMLElement;

    // Vérification de l'état du monstre avant de démarrer l'animation
    if (!this.monster || this.monster.pv <= 0) {
      return;
    }

    const direction = Math.random() < 0.5 ? -1 : 1;
    const offsetX = Math.random() * 15 * direction;
    const offsetY = Math.random() * 8 - 5;

    if (Math.random() < 0.2) {
      const newOffsetY = Math.random() * 10 - 5;
      bossElement.style.top = `${newOffsetY}px`;
    }

    const currentOffsetX = parseFloat(bossElement.style.transform.replace(/[^\d.-]/g, '')) || 0;
    const currentOffsetY = parseFloat(bossElement.style.top.replace(/[^\d.-]/g, '')) || 0;

    const targetOffsetX = currentOffsetX + offsetX;
    const targetOffsetY = currentOffsetY + offsetY;

    const duration = 1000;
    const startTime = performance.now();

    const updateBossPosition = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = elapsed / duration;

      const easedProgress = this.easeInOutCubic(progress);

      const currentX = currentOffsetX + offsetX * easedProgress;
      const currentY = currentOffsetY + offsetY * easedProgress;

      bossElement.style.transform = `translateX(${currentX}px)`;
      bossElement.style.top = `${currentY}px`;

      if (this.monster && this.monster.pv > 0) {
        if (elapsed < duration) {
          this.animationFrameId = requestAnimationFrame(updateBossPosition);
        } else {
          this.animationFrameId = requestAnimationFrame(this.moveBoss);
        }
      } else {
        // Assurez-vous qu'aucune nouvelle animation n'est planifiée si le monstre est mort
        this.animationFrameId = null;
      }
    };

    this.animationFrameId = requestAnimationFrame(updateBossPosition);
  }


  easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
}
