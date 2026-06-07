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
  category: string;
  description: string;
  creator: string;
  votes: number;
  comments: Comment[];
}

@Injectable({
  providedIn: 'root',
})
export class NftService {
  private readonly storageKey = 'nft_marketplace_items';

  private nftsSubject = new BehaviorSubject<NFT[]>(this.loadNfts());
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
        image: 'https://cdn.forbes.ru/forbes-static/new/2021/12/75f-61c1f76ccde7d.jpg',
        category: 'Collectible',
        description: 'A golden ape collectible inspired by the classic hype era of NFT profile pictures.',
        creator: 'Anonymous-User-9de72',
        votes: 42,
        comments: [],
      },
      {
        id: '2',
        name: 'King Beard Ape #2414',
        price: 1.25,
        image: 'https://woolypooly.com/ru/blog/wp-content/uploads/2023/12/NFT-950x500.jpg-1.webp',
        category: 'Art',
        description: 'King Beard Ape is a loud collectible with bold color accents, hand-picked for the featured page.',
        creator: 'Anonymous-User-9de72',
        votes: 89,
        comments: [],
      },
      {
        id: '3',
        name: 'Yacht Club Ape',
        price: 0.85,
        image: 'https://www.sostav.ru/blogs/images/feeds/84/167613.jpg',
        category: 'Collectible',
        description: 'A blue-background ape profile collectible with the familiar old-school NFT energy.',
        creator: 'Anonymous-User-9de72',
        votes: 156,
        comments: [],
      },
      {
        id: '4',
        name: 'Pink Hoodie Ape',
        price: 2.1,
        image: 'https://a.storyblok.com/f/102932/1920x1080/156ed23596/monkey-g46eb24a10_1920.jpg',
        category: 'Art',
        description: 'A soft pink ape mint with streetwear mood and a clean collectible look.',
        creator: 'Anonymous-User-9de72',
        votes: 73,
        comments: [],
      },
      {
        id: '5',
        name: 'Aqua Ape',
        price: 0.62,
        image: 'https://i.redd.it/1kk7njgbzs881.png',
        category: 'Virtual',
        description: 'A bright blue profile collectible from the same anonymous collection.',
        creator: 'Anonymous-User-9de72',
        votes: 61,
        comments: [],
      },
      {
        id: '6',
        name: 'Painted Ape',
        price: 0.92,
        image: 'https://i.pinimg.com/236x/7f/59/0a/7f590a7ee311d849bc9672eaee21bb50.jpg',
        category: 'Art',
        description: 'A saturated portrait collectible with playful shapes and a clean white background.',
        creator: 'Anonymous-User-9de72',
        votes: 104,
        comments: [],
      },
      {
        id: '7',
        name: 'Night Ape',
        price: 1.05,
        image: 'https://img2.storyblok.com/325x325/f/102932/1920x1080/156ed23596/monkey-g46eb24a10_1920.jpg',
        category: 'Game',
        description: 'Rare shadow mint with saturated nightlife colors and a darker ape silhouette.',
        creator: 'Anonymous-User-9de72',
        votes: 118,
        comments: [],
      },
      {
        id: '8',
        name: 'Red Cap Ape',
        price: 1.77,
        image: 'https://www.coexya.eu/app/uploads/2022/04/nft-singes.webp',
        category: 'Music',
        description: 'A red cap ape mint made for the lower row of the collection.',
        creator: 'Anonymous-User-9de72',
        votes: 96,
        comments: [],
      },
    ];
  }

  private loadNfts(): NFT[] {
    const initialNfts = this.getInitialNFTs();
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      this.saveNfts(initialNfts);
      return initialNfts;
    }

    try {
      const parsed = JSON.parse(stored) as NFT[];
      const initialById = new Map(initialNfts.map((nft) => [nft.id, nft]));
      const storedNfts = parsed.map((nft) => ({
        ...nft,
        comments: nft.comments.map((comment) => ({
          ...comment,
          timestamp: new Date(comment.timestamp),
        })),
      }));
      const mergedNfts = storedNfts.map((nft) => {
        const initialNft = initialById.get(nft.id);
        if (!initialNft) {
          return nft;
        }

        return {
          ...nft,
          name: initialNft.name,
          price: initialNft.price,
          image: initialNft.image,
          category: initialNft.category,
          description: initialNft.description,
          creator: initialNft.creator,
        };
      });
      const storedIds = new Set(mergedNfts.map((nft) => nft.id));
      const missingInitialNfts = initialNfts.filter((nft) => !storedIds.has(nft.id));
      const finalNfts = [...mergedNfts, ...missingInitialNfts];
      this.saveNfts(finalNfts);
      return finalNfts;
    } catch {
      this.saveNfts(initialNfts);
      return initialNfts;
    }
  }

  private saveNfts(nfts: NFT[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(nfts));
  }

  getNfts(): NFT[] {
    return this.nftsSubject.value;
  }

  selectNft(id: string): void {
    const nft = this.nftsSubject.value.find((item) => item.id === id);
    this.selectedNftSubject.next(nft ?? null);
  }

  addComment(nftId: string, author: string, text: string): void {
    const comment: Comment = {
      id: Date.now().toString(),
      author,
      text: text.trim(),
      timestamp: new Date(),
    };
    const updatedNfts = this.nftsSubject.value.map((nft) =>
      nft.id === nftId ? { ...nft, comments: [...nft.comments, comment] } : nft
    );
    this.nftsSubject.next(updatedNfts);
    this.saveNfts(updatedNfts);

    if (this.selectedNftSubject.value?.id === nftId) {
      this.selectedNftSubject.next(updatedNfts.find((nft) => nft.id === nftId) ?? null);
    }
  }

  voteForNft(nftId: string): void {
    const updatedNfts = this.nftsSubject.value.map((nft) =>
      nft.id === nftId ? { ...nft, votes: nft.votes + 1 } : nft
    );
    this.nftsSubject.next(updatedNfts);
    this.saveNfts(updatedNfts);

    if (this.selectedNftSubject.value?.id === nftId) {
      this.selectedNftSubject.next(updatedNfts.find((nft) => nft.id === nftId) ?? null);
    }
  }

  buyNft(nftId: string, userId: string): boolean {
    const userNfts = this.userNftsSubject.value;
    if (!userNfts.includes(nftId)) {
      const updatedUserNfts = [...userNfts, nftId];
      this.userNftsSubject.next(updatedUserNfts);
      localStorage.setItem(`user_${userId}_nfts`, JSON.stringify(updatedUserNfts));
      return true;
    }
    return false;
  }

  userOwnNft(nftId: string): boolean {
    return this.userNftsSubject.value.includes(nftId);
  }

  loadUserNfts(userId: string): void {
    const stored = localStorage.getItem(`user_${userId}_nfts`);
    if (!stored) {
      this.userNftsSubject.next([]);
      return;
    }

    try {
      this.userNftsSubject.next(JSON.parse(stored) as string[]);
    } catch {
      localStorage.removeItem(`user_${userId}_nfts`);
      this.userNftsSubject.next([]);
    }
  }

  clearUserNfts(): void {
    this.userNftsSubject.next([]);
  }

  addNft(nft: Omit<NFT, 'id' | 'votes' | 'comments'>): void {
    const newNft: NFT = {
      ...nft,
      id: Date.now().toString(),
      votes: 0,
      comments: [],
    };
    const updatedNfts = [...this.nftsSubject.value, newNft];
    this.nftsSubject.next(updatedNfts);
    this.saveNfts(updatedNfts);
  }

  setUserNfts(nfts: string[]): void {
    this.userNftsSubject.next(nfts);
  }
}
