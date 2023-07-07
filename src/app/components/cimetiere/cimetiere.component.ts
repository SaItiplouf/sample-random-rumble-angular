import { Component, OnInit } from '@angular/core';
import { IPlayer} from "../../models/player.model";
import { GameService} from "../../services/game.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-cimetiere',
  templateUrl: 'cimetiere.component.html',
  styleUrls: ['cimetiere.component.scss']
})
export class CimetiereComponent implements OnInit {
  deadPlayers: IPlayer[] = [];
  currentPage: number = 1;
  perPage: number = 12;
  hasNextPage: boolean = false;

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
    this.getDeadPlayers();
  }

  getDeadPlayers(): void {
    const offset = (this.currentPage - 1) * this.perPage;
    this.gameService.getDeadPlayers(offset).subscribe(deadPlayers => {
      this.deadPlayers = deadPlayers;
      this.hasNextPage = deadPlayers.length > 0;
    });
  }

  getTotalPages(): number[] {
    const totalPlayers = this.deadPlayers.length;
    const totalPages = Math.ceil(totalPlayers / this.perPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  navigateToPage(page: number): void {
    const totalPages = this.getTotalPages();
    if (page >= 1) {
      this.currentPage = page;
      this.getDeadPlayers();
    }
  }

  BackButton(): void {
    this.router.navigate(['/']);
  }
}
