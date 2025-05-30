import { TaskBoard } from "@/components/TaskBoard";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Collaborative Task Manager</h1>
          <ModeToggle />
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <TaskBoard />
      </main>
      
      <footer className="border-t mt-12">
        <div className="container mx-auto py-4 px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Collaborative Task Manager - Developer Interview Task
        </div>
      </footer>
    </div>
  );
}