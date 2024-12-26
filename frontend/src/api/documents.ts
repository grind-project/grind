import { api } from './config';

export interface Document {
  id: number;
  title: string;
  content: string;
  parent: number | null;
  children: Document[];
}

export const getDocuments = async () => {
  const response = await api.get<Document[]>('/documents/');
  return response.data;
};