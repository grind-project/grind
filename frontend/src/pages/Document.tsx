import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Document } from '../api/documents';
import { api } from '../api/config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
        // Debug logs
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        const response = await api.get(`/api/documents/${id}`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        
        // Debug response
        console.log('Document response:', response);
        
        if (response.data) {
          setDocument(response.data);
        } else {
          setError('Document not found');
        }
      } catch (error: any) {
        console.error('Error details:', error.response || error);
        if (error.response?.status === 401) {
          setError('Authentication required - Please login');
        } else if (error.response?.status === 404) {
          setError('Document not found');
        } else {
          setError(`Unable to load document: ${error.message}`);
        }
      }
    };
    fetchDocument();
  }, [id]);

  if (error) return (
    <div className="p-4">
      <div className="text-red-500 font-semibold">{error}</div>
    </div>
  );
  
  if (!document) return (
    <div className="p-4">
      <div className="animate-pulse">Loading...</div>
    </div>
  );

  const renderContent = () => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Titres personnalisés
          h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
          h2: ({children}) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
          h3: ({children}) => <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>,
          // Gestion des équations
          p: ({children, ...props}) => {
            if (typeof children === 'string' && children.includes('$')) {
              return parseInlineMath(children);
            }
            return <p {...props}>{children}</p>;
          },
          code: ({className, children}) => {
            if (className === 'language-math') {
              return <BlockMath>{children as string}</BlockMath>;
            }
            return <code className={className}>{children}</code>;
          }
        }}
      >
        {document?.content || ''}
      </ReactMarkdown>
    );
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