import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NftService } from '../services/nft.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create.html',
  styleUrl: './create.css'
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

    if (!this.itemName || !this.itemPrice || !this.itemImage || !this.itemDescription) {
      this.errorMessage = 'Пожалуйста, заполните все поля';
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'Только авторизованные пользователи могут создавать NFT';
      return;
    }

    this.nftService.addNft({
      name: this.itemName,
      price: this.itemPrice,
      image: this.itemImage,
      description: this.itemDescription,
      creator: user.username
    });

    this.successMessage = 'NFT успешно создано! Проверьте его в каталоге.';
    this.clearForm();
  }

  logout(): void {
    this.authService.logout();
  }

  private clearForm(): void {
    this.itemName = '';
    this.itemPrice = 0;
    this.itemImage = '';
    this.itemDescription = '';
    this.itemCategory = 'Art';
  }
}
