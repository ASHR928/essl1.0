import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SessionWarningComponentComponent } from '../_Popup/session-warning-component/session-warning-component.component';
import { MessagesService } from '../_Toastr/messages.service';
import { LoginService } from './login.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly SESSION_TIMEOUT = 2 * 60 * 1000; // 20 minutes
  private readonly WARNING_TIMEOUT = 1 * 60 * 1000; // 19 minutes (1 minute before expiry)
  private sessionTimer: any;
  private warningTimer: any;
  private countdownTimer: any;

  // Add timer state observables
  private timeRemaining = new BehaviorSubject<{ minutes: number; seconds: number }>({ minutes: 20, seconds: 0 });
  public timeRemaining$ = this.timeRemaining.asObservable();

  private sessionResetEvent = new Subject<void>();

  private activityHandler = () => this.resetTimers();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessagesService,
    private loginService: LoginService
  ) {}

  initializeSession(): void {
    this.resetTimers();
    this.setupActivityListeners();
    this.startCountdown();
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'mousemove', 'click', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, this.activityHandler);
    });
  }

  private removeActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'mousemove', 'click', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.removeEventListener(event, this.activityHandler);
    });
  }

  private startCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    let totalSeconds = 2 * 60; // 20 minutes in seconds
    
    this.countdownTimer = setInterval(() => {
      totalSeconds--;
      
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      
      this.timeRemaining.next({ minutes, seconds });

      if (totalSeconds <= 0) {
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  }

  private resetTimers(): void {
    clearTimeout(this.sessionTimer);
    clearTimeout(this.warningTimer);
    clearInterval(this.countdownTimer);

    // Reset countdown display
    this.timeRemaining.next({ minutes: 2, seconds: 0 });
    this.startCountdown();

    // Set warning timer
    this.warningTimer = setTimeout(() => {
      this.showWarningDialog();
    }, this.WARNING_TIMEOUT);

    // Set session timeout timer
    this.sessionTimer = setTimeout(() => {
      this.endSession();
    }, this.SESSION_TIMEOUT);
  }

  private showWarningDialog(): void {
    // Check if user is still logged in before showing dialog
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const dialogRef = this.dialog.open(SessionWarningComponentComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked continue
        this.resetTimers();
      } else {
        // User clicked logout
        this.endSession();
      }
    });
  }

  endSession(): void {
    // Immediately clear all timers
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    
    // Reset the time remaining to 0
    this.timeRemaining.next({ minutes: 0, seconds: 0 });
    
    // Remove event listeners
    this.removeActivityListeners();
    
    // Clear all local storage
    localStorage.clear();
    
    // Show message to user
    this.messageService.errorMsg('Session expired. Please login again.');
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  // Call this method when user logs out manually
  logout(): void {
    this.endSession();
  }

  getSessionResetEvent() {
    return this.sessionResetEvent.asObservable();
  }

  resetSession() {
    this.sessionResetEvent.next();
  }
}