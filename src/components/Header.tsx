
import React from 'react';
import { CheckSquare } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 justify-center">
          <CheckSquare className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Kanban Todo Board</h1>
        </div>
        <p className="text-gray-600 mt-2">Organize your tasks with drag-and-drop simplicity</p>
      </div>
    </header>

  );
};
