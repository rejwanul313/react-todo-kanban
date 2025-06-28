
import React, { useEffect, useRef } from 'react';
import { Todo, TodoStatus, useTodos } from '@/context/TodoContext';
import { ArrowRight, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  todo: Todo;
  position: { x: number; y: number };
  onClose: () => void;
}

const statusOptions: { [key in TodoStatus]: TodoStatus[] } = {
  new: ['ongoing', 'done'],
  ongoing: ['new', 'done'],
  done: ['new', 'ongoing'],
};

const statusLabels: { [key in TodoStatus]: string } = {
  new: 'New',
  ongoing: 'Ongoing',
  done: 'Done',
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ todo, position, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { updateTodoStatus, deleteTodo } = useTodos();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleMove = (newStatus: TodoStatus) => {
    updateTodoStatus(todo.id, newStatus);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTodo(todo.id);
      onClose();
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[150px]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="px-3 py-1 text-xs font-medium text-gray-500 border-b border-gray-100 mb-1">
        Move to
      </div>
      {statusOptions[todo.status].map((status) => (
        <button
          key={status}
          onClick={() => handleMove(status)}
          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
        >
          <ArrowRight className="h-4 w-4 text-gray-400" />
          {statusLabels[status]}
        </button>
      ))}
      <div className="border-t border-gray-100 mt-1 pt-1">
        <button
          onClick={handleDelete}
          className="w-full px-3 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
};
