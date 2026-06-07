import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly usersKey = 'nft_marketplace_users';
  private readonly currentUserKey = 'currentUser';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  private users: StoredUser[] = this.loadUsers();

  register(username: string, email: string, password: string): boolean {
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim();

    if (
      !normalizedUsername ||
      !normalizedEmail ||
      !password ||
      this.users.some((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase())
    ) {
      return false;
    }

    const newUser: StoredUser = {
      id: Date.now().toString(),
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    };

    this.users = [...this.users, newUser];
    this.saveUsers();
    this.setCurrentUser(newUser);
    return true;
  }

  login(username: string, password: string): boolean {
    const normalizedUsername = username.trim().toLowerCase();
    const user = this.users.find(
      (item) => item.username.toLowerCase() === normalizedUsername && item.password === password
    );

    if (!user) {
      return false;
    }

    this.setCurrentUser(user);
    return true;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.currentUserKey);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadUsers(): StoredUser[] {
    const stored = localStorage.getItem(this.usersKey);
    if (stored) {
      try {
        return JSON.parse(stored) as StoredUser[];
      } catch {
        localStorage.removeItem(this.usersKey);
      }
    }

    const demoUsers: StoredUser[] = [
      {
        id: '1',
        username: 'demo',
        email: 'demo@example.com',
        password: 'demo123',
      },
    ];
    localStorage.setItem(this.usersKey, JSON.stringify(demoUsers));
    return demoUsers;
  }

  private saveUsers(): void {
    localStorage.setItem(this.usersKey, JSON.stringify(this.users));
  }

  private setCurrentUser(user: StoredUser): void {
    const publicUser: User = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    this.currentUserSubject.next(publicUser);
    localStorage.setItem(this.currentUserKey, JSON.stringify(publicUser));
  }

  private getUserFromStorage(): User | null {
    const stored = localStorage.getItem(this.currentUserKey);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(this.currentUserKey);
      return null;
    }
  }
}
