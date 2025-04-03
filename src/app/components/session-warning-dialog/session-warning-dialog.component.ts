import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-warning-dialog',
  template: `
    <h2 mat-dialog-title>Session Timeout Warning</h2>
    <mat-dialog-content>
      <p>Your session will expire in 1 minute. Would you like to continue?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onLogout()">Logout</button>
      <button mat-raised-button color="primary" (click)="onContinue()">Continue Session</button>
    </mat-dialog-actions>
  `
})
export class SessionWarningDialogComponent {
  constructor(private dialogRef: MatDialogRef<SessionWarningDialogComponent>) {}

  onContinue(): void {
    this.dialogRef.close(true);
  }

  onLogout(): void {
    this.dialogRef.close(false);
  }
} 