export type DocumentData = {
    month: string;
    downloads: number;
    views: number;
  };
  
  export type CategoryData = {
    category: string;
    documents: number;
  };
  
  export type FileTypeData = {
    type: string;
    count: number;
  };
  
  export type TopDocument = {
    id: string;
    title: string;
    category: string;
    downloads: number;
    views: number;
  };
  
  export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    uploads: number;
    downloads: number;
  };