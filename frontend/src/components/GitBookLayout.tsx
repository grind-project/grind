import React, { useState, ReactNode } from 'react';
import { Menu, ChevronRight, ChevronDown, Book, Search } from 'lucide-react';

interface GitBookLayoutProps {
  children: ReactNode;
}

const GitBookLayout: React.FC<GitBookLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({ docs: true });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleItem = (key: string) => setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`flex flex-col border-r ${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300`}>
        {/* Sidebar Header */}
        <div className="h-14 flex items-center px-4 border-b">
          <Book className="h-6 w-6 text-blue-600" />
          <span className="ml-2 font-semibold">Documentation</span>
        </div>
        
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search docs..."
              className="w-full pl-8 pr-4 py-2 border rounded-md bg-gray-50"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <div className="mb-2">
              <button
                onClick={() => toggleItem('docs')}
                className="flex items-center w-full px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                {expandedItems.docs ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="ml-2">Getting Started</span>
              </button>
              {expandedItems.docs && (
                <div className="ml-4 mt-1">
                  <a href="#" className="block px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Introduction</a>
                  <a href="#" className="block px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Quick Start</a>
                  <a href="#" className="block px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Installation</a>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b flex items-center px-4">
          <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-md">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GitBookLayout;