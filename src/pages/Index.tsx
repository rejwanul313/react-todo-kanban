
import { KanbanBoard } from '@/components/KanbanBoard';
import { TodoProvider } from '@/context/TodoContext';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <KanbanBoard />
        </div>
      </div>
    </TodoProvider>
  );
};

export default Index;
