import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SessionService } from '../../_Services/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-timer',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './session-timer.component.html',
  styleUrl: './session-timer.component.scss'
})
export class SessionTimerComponent implements OnInit, OnDestroy {
  minutes: number = 1;
  seconds: number = 0;
  private subscription?: Subscription;

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.subscription = this.sessionService.timeRemaining$.subscribe(time => {
      this.minutes = time.minutes;
      this.seconds = time.seconds;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
