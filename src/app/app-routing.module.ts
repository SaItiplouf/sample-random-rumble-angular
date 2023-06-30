import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WinpageComponent} from "./components/winpage/winpage.component";
import {AppComponent} from "./app.component";
import {GameComponent} from "./components/game/game.component";

const routes: Routes = [
  { path: '', component: GameComponent, title: 'index', pathMatch: 'full'},
  { path: 'win-page', component: WinpageComponent, title: 'winpage'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
