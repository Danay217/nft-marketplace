import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

export interface NFT {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  creator: string;
  votes: number;
  comments: Comment[];
}

@Injectable({
  providedIn: 'root',
})
export class NftService {
  private nftsSubject = new BehaviorSubject<NFT[]>(this.getInitialNFTs());
  nfts$ = this.nftsSubject.asObservable();

  private selectedNftSubject = new BehaviorSubject<NFT | null>(null);
  selectedNft$ = this.selectedNftSubject.asObservable();

  private userNftsSubject = new BehaviorSubject<string[]>([]);
  userNfts$ = this.userNftsSubject.asObservable();

  private getInitialNFTs(): NFT[] {
    return [
      {
        id: '1',
        name: 'Bored Ape Crown',
        price: 0.45,
        image: 'https://api.dicebear.com/9.x/notionists/svg?seed=bored-ape-crown&backgroundColor=f4b942',
        description: 'A golden ape collectible inspired by the classic hype era of NFT profile pictures.',
        creator: 'Anonymous-User-9de72',
        votes: 42,
        comments: [],
      },
      {
        id: '2',
        name: 'King Beard Ape #2414',
        price: 1.25,
        image: 'https://api.dicebear.com/9.x/notionists/svg?seed=king-beard-ape&backgroundColor=8fe3ee',
        description: 'King Beard Ape is a loud collectible with bold color accents, hand-picked for the featured page.',
        creator: 'Anonymous-User-9de72',
        votes: 89,
        comments: [],
      },
      {
        id: '3',
        name: 'Yacht Club Ape',
        price: 0.85,
        image: 'https://api.dicebear.com/9.x/notionists/svg?seed=yacht-club-ape&backgroundColor=6eb6ff',
        description: 'A blue-background ape profile collectible with the familiar old-school NFT energy.',
        creator: 'Anonymous-User-9de72',
        votes: 156,
        comments: [],
      },
      {
        id: '4',
        name: 'Pink Hoodie Ape',
        price: 2.1,
        image: 'https://api.dicebear.com/9.x/notionists/svg?seed=pink-hoodie-ape&backgroundColor=f7a7cf',
        description: 'A soft pink ape mint with streetwear mood and a clean collectible look.',
        creator: 'Anonymous-User-9de72',
        votes: 73,
        comments: [],
      },
      {
        id: '5',
        name: 'Aqua Ape',
        price: 0.62,
        image: 'https://api.dicebear.com/9.x/notionists/svg?seed=aqua-hype-ape&backgroundColor=7ff0df',
        description: 'A bright blue profile collectible from the same anonymous collection.',
        creator: 'Anonymous-User-9de72',
        votes: 61,
        comments: [],
      },
      {
        id: '6',
        name: 'Painted Ape',
        price: 0.92,
        image: 'https://api.dicebear.com/9.x/notionists/svg?seed=painted-bored-ape&backgroundColor=f7df72',
        description: 'A saturated portrait collectible with playful shapes and a clean white background.',
        creator: 'Anonymous-User-9de72',
        votes: 104,
        comments: [],
      },
      {
        id: '7',
        name: 'Night Ape',
        price: 1.05,
        image: 'https://api.dicebear.com/9.x/notionists/svg?seed=night-club-ape&backgroundColor=151820',
        description: 'Rare shadow mint with saturated nightlife colors and a darker ape silhouette.',
        creator: 'Anonymous-User-9de72',
        votes: 118,
        comments: [],
      },
      {
        id: '8',
        name: 'Red Cap Ape',
        price: 1.77,
        image: 'https://api.dicebear.com/9.x/notionists/svg?seed=red-cap-ape&backgroundColor=ff8a65',
        description: 'A red cap ape mint made for the lower row of the collection.',
        creator: 'Anonymous-User-9de72',
        votes: 96,
        comments: [],
      },
    ];
  }

  getNfts(): NFT[] {
    return this.nftsSubject.value;
  }

  selectNft(id: string): void {
    const nft = this.nftsSubject.value.find((item) => item.id === id);
    this.selectedNftSubject.next(nft ?? null);
  }

  addComment(nftId: string, author: string, text: string): void {
    const nfts = this.nftsSubject.value;
    const nft = nfts.find((item) => item.id === nftId);
    if (nft) {
      const comment: Comment = {
        id: Date.now().toString(),
        author,
        text,
        timestamp: new Date(),
      };
      nft.comments.push(comment);
      this.nftsSubject.next([...nfts]);

      if (this.selectedNftSubject.value?.id === nftId) {
        this.selectedNftSubject.next({ ...nft });
      }
    }
  }

  voteForNft(nftId: string): void {
    const nfts = this.nftsSubject.value;
    const nft = nfts.find((item) => item.id === nftId);
    if (nft) {
      nft.votes++;
      this.nftsSubject.next([...nfts]);

      if (this.selectedNftSubject.value?.id === nftId) {
        this.selectedNftSubject.next({ ...nft });
      }
    }
  }

  buyNft(nftId: string, userId: string): boolean {
    const userNfts = this.userNftsSubject.value;
    if (!userNfts.includes(nftId)) {
      userNfts.push(nftId);
      this.userNftsSubject.next([...userNfts]);
      localStorage.setItem(`user_${userId}_nfts`, JSON.stringify(userNfts));
      return true;
    }
    return false;
  }

  userOwnNft(nftId: string): boolean {
    return this.userNftsSubject.value.includes(nftId);
  }

  addNft(nft: Omit<NFT, 'id' | 'votes' | 'comments'>): void {
    const newNft: NFT = {
      ...nft,
      id: Date.now().toString(),
      votes: 0,
      comments: [],
    };
    this.nftsSubject.next([...this.nftsSubject.value, newNft]);
  }

  setUserNfts(nfts: string[]): void {
    this.userNftsSubject.next(nfts);
  }
}
