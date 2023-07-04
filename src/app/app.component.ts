import {Component, OnInit} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {GameService} from "./services/game.service";
import {Store} from "@ngrx/store";
import {initPlayers} from "./actions/player.action";
import {IPlayer} from "./models/player.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements  OnInit{
  title = 'random-rumble';

  constructor(private gameService :GameService, private store : Store) {
  }

  ngOnInit() {
    this.gameService.getPlayers().subscribe((data :IPlayer[])=>{
      console.log(data)
      this.store.dispatch(initPlayers({players: data}))
    })
  }
}
