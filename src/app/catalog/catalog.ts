import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NftService, NFT } from '../services/nft.service';
import { SearchService } from '../services/search.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class CatalogComponent {
  private authService = inject(AuthService);
  private nftService = inject(NftService);
  private searchService = inject(SearchService);

  nfts$ = this.nftService.nfts$;
  filteredNfts$ = combineLatest([this.nfts$, this.searchService.searchQuery$]).pipe(
    map(([nfts, query]) => {
      const filter = query.trim().toLowerCase();
      if (!filter) {
        return nfts;
      }
      return nfts.filter((nft) =>
        nft.name.toLowerCase().includes(filter) ||
        nft.creator.toLowerCase().includes(filter) ||
        nft.description.toLowerCase().includes(filter)
      );
    })
  );
  selectedNft$ = this.nftService.selectedNft$;
  currentUser$ = this.authService.currentUser$;

  newComment = '';

  constructor() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.nftService.loadUserNfts(user.id);
    }
  }

  selectNft(id: string): void {
    this.nftService.selectNft(id);
  }

  addComment(nftId: string): void {
    if (this.newComment.trim()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.nftService.addComment(nftId, user.username, this.newComment);
        this.newComment = '';
      }
    }
  }

  voteForNft(nftId: string): void {
    this.nftService.voteForNft(nftId);
  }

  buyNft(nftId: string): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.nftService.buyNft(nftId, user.id);
    }
  }

  logout(): void {
    this.authService.logout();
    this.nftService.clearUserNfts();
  }

  userOwnNft(nftId: string): boolean {
    return this.nftService.userOwnNft(nftId);
  }

  navigatePrevious(nfts: NFT[], currentNft: NFT): void {
    const index = nfts.findIndex(n => n.id === currentNft.id);
    const prevIndex = (index - 1 + nfts.length) % nfts.length;
    this.selectNft(nfts[prevIndex].id);
  }

  navigateNext(nfts: NFT[], currentNft: NFT): void {
    const index = nfts.findIndex(n => n.id === currentNft.id);
    const nextIndex = (index + 1) % nfts.length;
    this.selectNft(nfts[nextIndex].id);
  }
}
