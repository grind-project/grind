import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Document } from '../api/documents';
import { api } from '../api/config';

export default function DocumentView() {
  const { id } = useParams(); // Récupère l'id depuis l'URL
  const [document, setDocument] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await api.get(`/api/documents/${id}`);
        setDocument(response.data);
      } catch (error) {
        setError('Unable to load document');
        console.error('Error:', error);
      }
    };
    fetchDocument();
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!document) return <div className="animate-pulse">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{document.title}</h1>
      <div className="prose max-w-none">
        {document.content}
      </div>
    </div>
  );
}