import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WinpageComponent} from "./components/winpage/winpage.component";
import { CimetiereComponent} from "./components/cimetiere/cimetiere.component";
import {GameComponent} from "./components/game/game.component";

const routes: Routes = [
  { path: 'game', component: GameComponent, title: 'Game', pathMatch: 'full'},
  { path: '', component: WinpageComponent, title: 'Menu'},
  { path: 'cimetiere', component: CimetiereComponent, title: 'Cimetière'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
