
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TodoStatus = 'new' | 'ongoing' | 'done';

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (title: string, description: string) => void;
  updateTodoStatus: (id: string, status: TodoStatus) => void;
  updateTodoDueDate: (id: string, dueDate: Date) => void;
  deleteTodo: (id: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (title: string, description: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      status: 'new',
      createdAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const updateTodoStatus = (id: string, status: TodoStatus) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const updatedTodo = { ...todo, status };
        if (status === 'done') {
          updatedTodo.completedAt = new Date();
        }
        return updatedTodo;
      }
      return todo;
    }));
  };

  const updateTodoDueDate = (id: string, dueDate: Date) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, dueDate } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{
      todos,
      addTodo,
      updateTodoStatus,
      updateTodoDueDate,
      deleteTodo,
    }}>
      {children}
    </TodoContext.Provider>
  );
};
