import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from '../features/documents/documentsSlice';
import type { RootState, AppDispatch } from '../app/store';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments())
      .unwrap()
      .catch((error) => {
        console.error('Failed to fetch documents:', error);
      });
  }, [dispatch]);

  if (status === 'loading') return <div>Chargement...</div>;
  if (status === 'failed') return <div>Erreur: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Documents</h1>
      {items.map(doc => (
        <div key={doc.id} className="mb-4 p-4 border rounded">
          <h2 className="text-xl">{doc.title}</h2>
          <p>{doc.content}</p>
        </div>
      ))}
    </div>
  );
}