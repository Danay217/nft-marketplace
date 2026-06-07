import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NftService } from '../services/nft.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private nftService = inject(NftService);

  currentUser$ = this.authService.currentUser$;
  userNfts$ = this.nftService.userNfts$;
  allNfts$ = this.nftService.nfts$;

  logout(): void {
    this.authService.logout();
  }
}
