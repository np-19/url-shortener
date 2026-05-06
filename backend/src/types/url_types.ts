export interface CreateUrlInput { //sent by frontend
  originalUrl: string;
  expiresAt: number;
  customAlias?: string;
}

export interface CreateUrlRecord { //stored in DB
  originalUrl: string;      
  expiresAt: Date;
  userId?: string;
}

export interface CreateUrlRequestBody { //sent by frontend
  Url: CreateUrlInput;
  customAlias?: string;
}

