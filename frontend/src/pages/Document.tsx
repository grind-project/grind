import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Document } from '../api/documents';
import { api } from '../api/config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface TableOfContentsItem {
 id: string;
 title: string;
 level: number;
 children: TableOfContentsItem[];
}

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

const DocumentView = () => {
 const { id } = useParams();
 const [document, setDocument] = useState<Document | null>(null);
 const [error, setError] = useState<string | null>(null);
 const [toc, setToc] = useState<TableOfContentsItem[]>([]);

 useEffect(() => {
   // Génère la table des matières à partir du contenu
   const generateTOC = (content: string) => {
     const lines = content.split('\n');
     const items: TableOfContentsItem[] = [];
     
     lines.forEach(line => {
       if (line.startsWith('#')) {
         const level = line.match(/^#+/)?.[0].length || 0;
         const title = line.replace(/^#+\s*/, '');
         const id = title.toLowerCase().replace(/\s+/g, '-');
         
         if (level === 1) {
           items.push({ id, title, level, children: [] });
         } else if (level === 2) {
           if (items.length > 0) {
             items[items.length - 1].children.push({ id, title, level, children: [] });
           }
         } else if (level === 3) {
           const lastItem = items[items.length - 1];
           if (lastItem?.children.length > 0) {
             lastItem.children[lastItem.children.length - 1].children.push({ id, title, level, children: [] });
           }
         }
       }
     });
     
     return items;
   };

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
         setToc(generateTOC(response.data.content));
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

 const renderTOC = () => (
   <nav className="w-64 pt-7">
     <ul className="space-y-2 px-3">
       {toc.map(item => (
         <li key={item.id}>
           <a 
             href={`#${item.id}`}
             className="text-gray-700 hover:text-[#404040] block py-1.5 -mx-3 px-4" // Même padding que les sous-titres
           >
             <div className="flex">
               <div className="pl-4 w-full"> {/* Added div with full width to maintain padding */}
                 {item.title}
               </div>
             </div>
           </a>
           {item.children.length > 0 && (
             <ul className="pl-4 mt-2 space-y-2">
               {item.children.map(child => (
                 <li key={child.id}>
                   <a 
                     href={`#${child.id}`}
                     className="text-gray-600 hover:text-[#404040] hover:bg-[#f5f5f5] block py-1.5 -mx-3 px-4 rounded-md"
                   >
                     {child.title}
                   </a>
                   {child.children.length > 0 && (
                     <ul className="pl-4 mt-2 space-y-2">
                       {child.children.map(subChild => (
                         <li key={subChild.id}>
                           <a 
                             href={`#${subChild.id}`}
                             className="text-gray-600 hover:text-[#404040] hover:bg-[#f5f5f5] block py-1.5 -mx-3 px-4 rounded-md text-sm" // Modifié ici
                           >
                             {subChild.title}
                           </a>
                         </li>
                       ))}
                     </ul>
                   )}
                 </li>
               ))}
             </ul>
           )}
         </li>
       ))}
     </ul>
   </nav>
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
   <div className="flex h-[calc(100vh-8rem)]">
     {/* Sidebar de navigation */}
     {document && (
       <div className="w-80 relative"> {/* Supprimé h-full et ajouté relative */}
         <div className="absolute -top-0.5 bottom-0 left-0 right-0 overflow-y-auto sidebar"
         style={{ bottom: '-15px'}}> {/* Ajouté les mêmes classes que main-content */}
           {renderTOC()}
         </div>
       </div>
     )}

     {/* Wrapper pour le contenu principal */}
     <div className="flex-1 relative">
       {/* Container avec scrollbar */}
       <div className="absolute -top-0.5 bottom-0 left-0 right-0 overflow-y-auto main-content"
       style={{ bottom: '-15px' }}>
         {/* Container intérieur avec marges */}
         <div className="max-w-[calc(100%-19rem)]">
           <div className="mx-8">
             <div className="ml-14">
               {error ? (
                 <div className="text-red-500 font-semibold">{error}</div>
               ) : !document ? (
                 <div className="animate-pulse">Loading...</div>
               ) : (
                 <div className="prose max-w-none">
                   {renderContent()}
                 </div>
               )}
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default DocumentView;