import { Component, Input } from '@angular/core';
import {IPlayer} from "../../models/player.model";

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() pv?: number;
  @Input() pvMax?: number;
  @Input() mana?: number;
  @Input() manaMax?: number;
  @Input() faType?: string;
  @Input() barName?: string;
  constructor() { }

}
