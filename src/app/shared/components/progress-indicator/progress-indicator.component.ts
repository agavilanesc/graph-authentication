import { Component, OnInit } from '@angular/core';
import { ProgressIndicatorService } from '../../services/progress-indicator.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.css']
})
export class ProgressIndicatorComponent implements OnInit {

  inProgress$: Subject<boolean> = this.progressIndicatorService.inProgress$;
  
  constructor( private progressIndicatorService: ProgressIndicatorService ) { }

  ngOnInit(): void {
  }

}
