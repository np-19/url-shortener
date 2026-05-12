export interface CreateUrlRecord { //stored in DB
  originalUrl: string;      
  expiresAt: Date;
  userId?: string;
}

export interface CachedUrl {
	originalUrl: string;
	clicks: number;
}



