import { api } from './config';

export interface Document {
  id: number;
  title: string;
  content: string;
  parent: Document | null;  // Le parent est maintenant un Document complet
  children: Document[];
  order: number;
}

export const getDocuments = async () => {
  const response = await api.get<Document[]>('/api/documents/');
  return response.data;
};