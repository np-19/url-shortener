export interface CreateUrlRecord { //stored in DB
  originalUrl: string;      
  expiresAt: Date;
  userId?: string;
}


