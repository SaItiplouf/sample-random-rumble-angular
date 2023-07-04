import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { IMonster } from 'src/app/models/monster.model';
import { GameState } from 'src/app/reducers/game.reducer';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.scss']
})
export class MonsterComponent implements OnInit {
  monster?: IMonster;


  constructor(private store: Store<{ game: GameState }>, private router: Router) {}

  ngOnInit(): void {

    this.store.select(state => state.game).subscribe((game: GameState) => {
      this.monster = game.monster;
      const players = game.players;
      if (this.monster.pv <= 0) {
        console.log('Mort');
        console.log(this.router);
        this.router.navigate(['/', 'win-page'])
          .then(nav => {
            console.log(nav); // true if navigation is successful
          }, err => {
            console.log(err); // when there's an error
          });
      }
    });

    document.addEventListener('DOMContentLoaded', () => {
      const bossElement = document.querySelector('#boss') as HTMLElement;

      function moveBoss() {
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

        function updateBossPosition(timestamp: number) {
          const elapsed = timestamp - startTime;
          const progress = elapsed / duration;

          const easedProgress = easeInOutCubic(progress);

          const currentX = currentOffsetX + offsetX * easedProgress;
          const currentY = currentOffsetY + offsetY * easedProgress;

          bossElement.style.transform = `translateX(${currentX}px)`;
          bossElement.style.top = `${currentY}px`;

          if (elapsed < duration) {
            requestAnimationFrame(updateBossPosition);
          } else {
            requestAnimationFrame(moveBoss);
          }
        }

        requestAnimationFrame(updateBossPosition);
      }

      function easeInOutCubic(t: number): number {
        return t < 0.5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      }

      moveBoss();
    });
  }
}
