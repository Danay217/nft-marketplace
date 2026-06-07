import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  isRegistering = false;
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/catalog']);
    }
  }

  toggleMode(): void {
    this.isRegistering = !this.isRegistering;
    this.clearForm();
  }

  register(): void {
    if (!this.username.trim() || !this.email.trim() || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const success = this.authService.register(this.username, this.email, this.password);
    if (success) {
      this.router.navigate(['/catalog']);
    } else {
      this.errorMessage = 'User already exists';
    }
  }

  login(): void {
    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Enter login and password';
      return;
    }

    const success = this.authService.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/catalog']);
    } else {
      this.errorMessage = 'Wrong login or password';
    }
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  private clearForm(): void {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.errorMessage = '';
  }
}
