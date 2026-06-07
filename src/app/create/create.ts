import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NftService } from '../services/nft.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class CreateComponent {
  private authService = inject(AuthService);
  private nftService = inject(NftService);

  currentUser$ = this.authService.currentUser$;

  itemName = '';
  itemPrice = 0;
  itemImage = '';
  itemDescription = '';
  itemCategory = 'Art';
  successMessage = '';
  errorMessage = '';

  categories = ['Art', 'Collectible', 'Game', 'Music', 'Virtual'];

  createItem(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const name = this.itemName.trim();
    const image = this.itemImage.trim();
    const description = this.itemDescription.trim();

    if (!name || !this.itemPrice || !image || !description) {
      this.errorMessage = 'Fill in all fields';
      return;
    }

    if (this.itemPrice <= 0) {
      this.errorMessage = 'Price must be greater than 0';
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'Only logged in users can create NFT';
      return;
    }

    this.nftService.addNft({
      name,
      price: this.itemPrice,
      image,
      category: this.itemCategory,
      description,
      creator: user.username,
    });

    this.successMessage = 'NFT created. Check it in the catalog.';
    this.clearForm();
  }

  logout(): void {
    this.authService.logout();
    this.nftService.clearUserNfts();
  }

  private clearForm(): void {
    this.itemName = '';
    this.itemPrice = 0;
    this.itemImage = '';
    this.itemDescription = '';
    this.itemCategory = 'Art';
  }
}
