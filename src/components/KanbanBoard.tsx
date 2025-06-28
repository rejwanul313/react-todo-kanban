
import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { useTodos, TodoStatus } from '@/context/TodoContext';

const columns: { id: TodoStatus; title: string; color: string }[] = [
  { id: 'new', title: 'New', color: 'bg-blue-100 border-blue-200' },
  { id: 'ongoing', title: 'Ongoing', color: 'bg-orange-100 border-orange-200' },
  { id: 'done', title: 'Done', color: 'bg-green-100 border-green-200' },
];

export const KanbanBoard = () => {
  const { todos, updateTodoStatus } = useTodos();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TodoStatus;
    updateTodoStatus(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTodos = todos.filter(todo => todo.status === column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              todos={columnTodos}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};
