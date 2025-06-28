
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TodoCard } from './TodoCard';
import { AddTodoForm } from './AddTodoForm';
import { Todo, TodoStatus } from '@/context/TodoContext';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: {
    id: TodoStatus;
    title: string;
    color: string;
  };
  todos: Todo[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, todos }) => {
  const [showAddForm, setShowAddForm] = React.useState(false);

  return (
    <div className={`rounded-lg border-2 border-dashed p-4 ${column.color} min-h-[600px]`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          {column.title}
          <span className="bg-white/70 text-sm px-2 py-1 rounded-full">
            {todos.length}
          </span>
        </h2>
        {column.id === 'new' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 bg-white/70 hover:bg-white/90 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      {column.id === 'new' && showAddForm && (
        <div className="mb-4">
          <AddTodoForm onClose={() => setShowAddForm(false)} />
        </div>
      )}

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-white/30' : ''
            }`}
          >
            {todos.map((todo, index) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                index={index}
                columnId={column.id}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
