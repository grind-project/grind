import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Document } from '../api/documents';
import { api } from '../api/config';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Fonction pour parser les expressions mathématiques inline
const parseInlineMath = (line: string) => {
  const parts = line.split(/(\$[^\$]+\$)/g);
  return (
    <p key={line}>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>;
        }
        return part;
      })}
    </p>
  );
};

export default function DocumentView() {
  const { id } = useParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/api/documents/${id}`);
        setDocument(response.data);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Unable to load document');
      }
    };
    fetchDocument();
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!document) return <div className="animate-pulse">Loading...</div>;

  const renderContent = () => {
    const lines = document!.content.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Équation en block
      if (line.trim().startsWith('$$')) {
        let mathContent = '';
        let j = i + 1;
        
        // Cherche la fin de l'équation
        while (j < lines.length) {
          if (lines[j].trim().endsWith('$$')) {
            mathContent = lines.slice(i + 1, j).join('\n');
            break;
          }
          j++;
        }
        
        // Ajoute l'équation et saute les lignes utilisées
        result.push(
          <div key={i} className="my-4">
            <BlockMath>{mathContent.trim()}</BlockMath>
          </div>
        );
        i = j; // Saute au-delà de l'équation
        continue;
      }
      
      // Équation inline
      if (line.includes('$')) {
        result.push(parseInlineMath(line));
        continue;
      }
      
      // Texte normal
      if (line.trim()) {
        result.push(<p key={i}>{line}</p>);
      }
    }
    
    return result;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{document?.title}</h1>
      <div className="prose max-w-none">
        {document && renderContent()}
      </div>
    </div>
  );
}