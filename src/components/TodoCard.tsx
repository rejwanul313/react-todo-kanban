
import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MoreVertical, Calendar, AlertTriangle } from 'lucide-react';
import { Todo, TodoStatus, useTodos } from '@/context/TodoContext';
import { ContextMenu } from './ContextMenu';
import { DateTimePicker } from './DateTimePicker';

interface TodoCardProps {
  todo: Todo;
  index: number;
  columnId: TodoStatus;
}

const statusColors = {
  new: 'border-blue-300 bg-blue-50',
  ongoing: 'border-orange-300 bg-orange-50',
  done: 'border-green-300 bg-green-50',
};

const statusLabels = {
  new: { text: 'New', color: 'bg-blue-500' },
  ongoing: { text: 'Ongoing', color: 'bg-orange-500' },
  done: { text: 'Done', color: 'bg-green-500' },
};

export const TodoCard: React.FC<TodoCardProps> = ({ todo, index, columnId }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { updateTodoDueDate } = useTodos();

  const isOverdue = todo.dueDate && todo.status === 'ongoing' && new Date() > todo.dueDate;

  useEffect(() => {
    if (isOverdue) {
      const timer = setTimeout(() => {
        alert(`Task "${todo.title}" is overdue!`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOverdue, todo.title]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDateSelect = (date: Date) => {
    updateTodoDueDate(todo.id, date);
    setShowDatePicker(false);
  };

  return (
    <>
      <Draggable draggableId={todo.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-4 rounded-lg border-2 bg-white shadow-sm hover:shadow-md transition-all cursor-grab ${
              statusColors[todo.status]
            } ${snapshot.isDragging ? 'rotate-2 shadow-lg' : ''}`}
            onContextMenu={handleContextMenu}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{todo.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs text-white rounded-full ${statusLabels[todo.status].color}`}>
                    {statusLabels[todo.status].text}
                  </span>
                  {isOverdue && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs font-medium">Overdue</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setContextMenuPosition({ x: e.clientX, y: e.clientY });
                  setShowContextMenu(true);
                }}
                className="p-1 hover:bg-white/70 rounded"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-700 text-sm mb-3">{todo.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created: {todo.createdAt.toLocaleDateString()}</span>
              {todo.status === 'ongoing' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDatePicker(true);
                  }}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  <Calendar className="h-3 w-3" />
                  {todo.dueDate ? `Due: ${todo.dueDate.toLocaleDateString()}` : 'Set due date'}
                </button>
              )}
              {todo.completedAt && (
                <span>Completed: {todo.completedAt.toLocaleDateString()}</span>
              )}
            </div>
          </div>
        )}
      </Draggable>

      {showContextMenu && (
        <ContextMenu
          todo={todo}
          position={contextMenuPosition}
          onClose={() => setShowContextMenu(false)}
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          onSelect={handleDateSelect}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </>
  );
};
