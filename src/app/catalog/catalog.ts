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
  
  isLoggedIn$ = this.authService.currentUser$;
  newComment = '';
  showAddNftForm = false;
  newNftData = {
    name: '',
    price: 0,
    image: '',
    description: '',
    creator: ''
  };

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
  }

  userOwnNft(nftId: string): boolean {
    return this.nftService.userOwnNft(nftId);
  }

  toggleAddNftForm(): void {
    this.showAddNftForm = !this.showAddNftForm;
  }

  addNewNft(): void {
    if (this.newNftData.name && this.newNftData.price && this.newNftData.image && this.newNftData.description) {
      const user = this.authService.getCurrentUser();
      this.nftService.addNft({
        name: this.newNftData.name,
        price: this.newNftData.price,
        image: this.newNftData.image,
        description: this.newNftData.description,
        creator: user?.username || 'Anonymous'
      });
      this.resetNftForm();
    }
  }

  navigatePrevious(nfts: any[], currentNft: any): void {
    const index = nfts.findIndex(n => n.id === currentNft.id);
    const prevIndex = (index - 1 + nfts.length) % nfts.length;
    this.selectNft(nfts[prevIndex].id);
  }

  navigateNext(nfts: any[], currentNft: any): void {
    const index = nfts.findIndex(n => n.id === currentNft.id);
    const nextIndex = (index + 1) % nfts.length;
    this.selectNft(nfts[nextIndex].id);
  }

  private resetNftForm(): void {
    this.newNftData = {
      name: '',
      price: 0,
      image: '',
      description: '',
      creator: ''
    };
    this.showAddNftForm = false;
  }
}
