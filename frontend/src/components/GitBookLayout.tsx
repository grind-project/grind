import React, { useState, ReactNode } from 'react';
import { Menu, ChevronRight, ChevronDown, Book, Search, BookOpen, Image, PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDocuments } from '../api/documents';  // Le fichier où la fonction est réellement définie

const GRADES = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Term'];
const SUBJECTS = ['Mathématiques', 'Physique', 'Chimie', 'SVT', 'Technologie'];
const CATEGORIES = ['Cours', 'Exemples', 'Exercices'];

const CATEGORY_ICONS = {
  'Cours': BookOpen,
  'Exemples': Image,
  'Exercices': PenLine
} as const;

interface GitBookLayoutProps {
  children: ReactNode;
}

const GitBookLayout: React.FC<GitBookLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [activeGrade, setActiveGrade] = useState<string | null>(null);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCategoryClick = async (grade: string | null, subject: string | null, category: string) => {
    try {
      // Ajout de logs pour debug
      console.log('Searching for:', { grade, subject, category });
      const documents = await getDocuments();
      console.log('All documents:', documents);

      // Vérification plus stricte
      const document = documents.find(doc => {
        console.log('Checking document:', {
          docGrade: doc.parent?.parent?.title,
          docSubject: doc.parent?.title,
          docCategory: doc.title,
          matches: {
            grade: doc.parent?.parent?.title === grade,
            subject: doc.parent?.title === subject,
            category: doc.title === category
          }
        });
        return doc.parent?.parent?.title === grade && 
               doc.parent?.title === subject && 
               doc.title === category;
      });

      console.log('Found document:', document);
      if (document) {
        navigate(`/documents/${document.id}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-x-hidden overscroll-x-none touch-pan-y">
      <div className="flex flex-col">
        {/* Top Header with Grade Selection */}
        <div className="h-16 flex justify-end items-center px-10">        
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {GRADES.map(grade => (
                <div key={grade} className="relative group">
                  <button
                    className={`
                      min-w-[72px]
                      w-fit
                      px-3 
                      py-1 
                      rounded-md 
                      text-base
                      text-center
                      border-none 
                      flex
                      items-center
                      justify-center
                      gap-0.5
                      ${
                        activeGrade === grade 
                          ? 'text-[#4d535f] font-medium' 
                          : 'text-[#585E6B] hover:text-[#333333]'
                      }
                    `}
                  >
                    {grade}
                    <ChevronDown 
                      className={`!w-4 !h-4 flex-shrink-0 stroke-1 mt-1 opacity-60 hover:text-[#000000] transition-transform duration-75 group-hover:rotate-180`}
                    />
                  </button>
                  
                  <div className="absolute h-2 w-full left-0 top-full" />
                  
                  <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-0 absolute z-50 top-[calc(100%+4px)] left-3 w-48 bg-white rounded-lg shadow-lg border border-gray-100 hover:opacity-100 hover:visible p-2">
                    {SUBJECTS.map(subject => (
                      <button
                        key={subject}
                        onClick={() => {
                          setActiveGrade(grade);
                          setActiveSubject(subject);
                          setActiveCategory(null);  // Réinitialiser la catégorie
                        }}
                        className="w-full text-left px-3 py-1.5 text-[14px] text-black hover:bg-[#eeeeee] rounded-md"
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="w-[225px] flex items-center space-x-0 text-[#585E6B] hover:text-[#000000] border-[0.5px] border-[rgba(0,0,0,0.08)] rounded-lg px-3 py-[6px] min-h-[34px] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.12)] hover:shadow-[0_2px_4px_-1px_rgba(0,0,0,0.2)] transform-gpu will-change-transform transition-transform duration-100 hover:scale-[1.02] group focus-visible:outline-none focus:outline-none focus:ring-0"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                outline: '2px solid transparent',
                outlineOffset: '2px'
              }}
            >
              <Search className="w-5 h-5 text-[#000000] group-hover:text-[#000000] stroke-1" />
              <div className="flex justify-between items-center w-full ml-2">
                <span className="text-[15px] text-[#585E6B] font-[450] opacity-90 group-hover:text-[#000000]">&nbsp;&nbsp;Search...</span>
                <span className="text-xs text-[#585E6B] opacity-95">Ctrl + K</span>
              </div>          
            </button>
          </div>
        </div>

        {/* Categories Menu */}
        <div className="h-12 flex items-center px-10 relative">
          <div className="flex space-x-3 -ml-5">
            {CATEGORIES.map(category => {
              const IconComponent = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(activeGrade!, activeSubject!, category)}
                  className={`
                    px-3 
                    pt-[14px]
                    pb-[2px]
                    rounded-md 
                    text-base
                    border-none 
                    transition-colors
                    flex
                    items-center
                    gap-2
                    relative
                    ${
                      activeCategory === category 
                        ? 'text-[#404040] after:content-[""] after:absolute after:bottom-[-8px] after:left-[12%] after:w-[78%] after:h-[1.5px] after:bg-[#404040] after:transition-all' 
                        : 'text-[#585E6B] hover:text-[#333333] hover:bg-[#f5f5f5]'
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4 stroke-[1.5] -mt-[12px]" />
                  <span className="-mt-[13px]">{category}</span>
                </button>
              );
            })}
          </div>
          <div className="absolute bottom-[2px] left-0 right-0 h-[0.5px] bg-[rgba(0,0,0,0.05)]"></div>
        </div>
      </div>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default GitBookLayout;