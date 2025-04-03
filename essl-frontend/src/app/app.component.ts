import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionService } from './_Services/session.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Essl';

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    // Initialize session management if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      this.sessionService.initializeSession();
    }
  }
}
