import React, { useState } from 'react';
import { Button, Card, Input } from '../ui';
import { cn } from '../../utils/cn';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  subtasks?: Task[];
  progress?: number;
  assignee?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TaskManagerProps {
  tasks: Task[];
  onCreateTask: (task: Partial<Task>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  view?: 'list' | 'kanban' | 'timeline';
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  view = 'list'
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<{
    status?: string;
    priority?: string;
    search?: string;
  }>({});

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending'
  });

  const handleCreateTask = () => {
    if (newTask.title?.trim()) {
      onCreateTask({
        ...newTask,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending'
      });
      setShowCreateForm(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-error-500 text-white';
      case 'high': return 'bg-warning-500 text-white';
      case 'medium': return 'bg-primary-500 text-white';
      case 'low': return 'bg-neutral-400 text-white';
      default: return 'bg-neutral-400 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-800 border-success-200';
      case 'in-progress': return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'blocked': return 'bg-error-100 text-error-800 border-error-200';
      case 'pending': return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const renderTaskCard = (task: Task) => (
    <Card
      key={task.id}
      className="hover-lift cursor-pointer"
      onClick={() => setSelectedTask(task)}
    >
      <div className="card-body">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
            {task.title}
          </h3>
          <div className="flex items-center space-x-2 ml-3">
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              getPriorityColor(task.priority)
            )}>
              {task.priority}
            </span>
            <span className={cn(
              'px-2 py-1 rounded-lg text-xs font-medium border',
              getStatusColor(task.status)
            )}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center text-xs text-neutral-600 dark:text-neutral-400">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{task.subtasks.length} subtasks</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>
            Created {task.createdAt.toLocaleDateString()}
          </span>
          {task.dueDate && (
            <span className={cn(
              'font-medium',
              task.dueDate < new Date() ? 'text-error-600' : 'text-neutral-600'
            )}>
              Due {task.dueDate.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Card>
  );

  const renderCreateTaskForm = () => (
    <Card className="mb-6">
      <div className="card-body">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Create New Task
        </h3>
        
        <div className="space-y-4">
          <Input
            placeholder="Task title"
            value={newTask.title || ''}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          
          <textarea
            placeholder="Task description (optional)"
            value={newTask.description || ''}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="input min-h-[80px] resize-none"
            rows={3}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Priority
              </label>
              <select
                value={newTask.priority || 'medium'}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Due Date
              </label>
              <Input
                type="date"
                onChange={(e) => setNewTask({ 
                  ...newTask, 
                  dueDate: e.target.value ? new Date(e.target.value) : undefined 
                })}
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleCreateTask}
              disabled={!newTask.title?.trim()}
              className="btn-primary"
            >
              Create Task
            </Button>
            <Button
              onClick={() => setShowCreateForm(false)}
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Task Manager
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your tasks and track progress
          </p>
        </div>
        
        <Button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search tasks..."
              value={filter.search || ''}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            
            <select
              value={filter.status || ''}
              onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
              className="input"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
            
            <select
              value={filter.priority || ''}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value || undefined })}
              className="input"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            
            <div className="flex space-x-2">
              <Button
                variant={view === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => {/* setView('list') */}}
              >
                List
              </Button>
              <Button
                variant={view === 'kanban' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => {/* setView('kanban') */}}
              >
                Kanban
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Create Task Form */}
      {showCreateForm && renderCreateTaskForm()}

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <Card>
          <div className="card-body text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              No tasks found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Create your first task to get started with task management.
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Create Task
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(renderTaskCard)}
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">Task Details</h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {selectedTask.title}
                  </h4>
                  {selectedTask.description && (
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {selectedTask.description}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Status
                    </label>
                    <span className={cn(
                      'inline-block px-3 py-1 rounded-lg text-sm font-medium border',
                      getStatusColor(selectedTask.status)
                    )}>
                      {selectedTask.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Priority
                    </label>
                    <span className={cn(
                      'inline-block px-3 py-1 rounded-full text-sm font-medium',
                      getPriorityColor(selectedTask.priority)
                    )}>
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>
                
                {selectedTask.progress !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Progress: {selectedTask.progress}%
                    </label>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                      <div
                        className="bg-gradient-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${selectedTask.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <Button
                onClick={() => onUpdateTask(selectedTask.id, { 
                  status: selectedTask.status === 'completed' ? 'pending' : 'completed' 
                })}
                variant={selectedTask.status === 'completed' ? 'secondary' : 'primary'}
              >
                {selectedTask.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
              <Button
                onClick={() => {
                  onDeleteTask(selectedTask.id);
                  setSelectedTask(null);
                }}
                variant="destructive"
              >
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;