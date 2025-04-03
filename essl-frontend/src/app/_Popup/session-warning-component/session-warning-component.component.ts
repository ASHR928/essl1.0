import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-session-warning-component',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatSelectModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './session-warning-component.component.html',
  styleUrl: './session-warning-component.component.scss'
})
export class SessionWarningComponentComponent {
  constructor(private dialogRef: MatDialogRef<SessionWarningComponentComponent>) {}

  onContinue(): void {
    this.dialogRef.close(true);
  }

  onLogout(): void {
    this.dialogRef.close(false);
  }
}