import React from 'react';
import { Button, Card } from '../ui';
import { cn } from '../../utils/cn';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  shortcut?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  onActionClick?: (actionId: string) => void;
  className?: string;
}

const defaultActions: QuickAction[] = [
  {
    id: 'new-chat',
    title: 'New Chat',
    description: 'Start a conversation with AI',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: 'from-primary-500 to-primary-600',
    action: () => console.log('New chat'),
    shortcut: 'Ctrl+N'
  },
  {
    id: 'schedule-task',
    title: 'Schedule Task',
    description: 'Create and schedule a new task',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-secondary-500 to-secondary-600',
    action: () => console.log('Schedule task'),
    shortcut: 'Ctrl+T'
  },
  {
    id: 'analyze-data',
    title: 'Analyze Data',
    description: 'Upload and analyze your data',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'from-accent-mint to-accent-lime',
    action: () => console.log('Analyze data'),
    shortcut: 'Ctrl+D'
  },
  {
    id: 'voice-command',
    title: 'Voice Command',
    description: 'Use voice to interact with AI',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    color: 'from-accent-coral to-accent-sunrise',
    action: () => console.log('Voice command'),
    shortcut: 'Ctrl+V'
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect your favorite tools',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    color: 'from-warning-500 to-warning-600',
    action: () => console.log('Integrations'),
    shortcut: 'Ctrl+I'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Customize your experience',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'from-neutral-500 to-neutral-600',
    action: () => console.log('Settings'),
    shortcut: 'Ctrl+,'
  }
];

const QuickActions: React.FC<QuickActionsProps> = ({
  actions = defaultActions,
  onActionClick,
  className
}) => {
  const handleActionClick = (action: QuickAction) => {
    action.action();
    onActionClick?.(action.id);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Quick Actions
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Get started with common tasks
          </p>
        </div>
        
        <Button variant="ghost" size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          Customize
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Card
            key={action.id}
            className="hover-lift cursor-pointer group"
            onClick={() => handleActionClick(action)}
          >
            <div className="card-body p-6">
              <div className="flex items-start space-x-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200',
                  `bg-gradient-to-r ${action.color}`
                )}>
                  {action.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {action.title}
                    </h3>
                    {action.shortcut && (
                      <span className="text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded font-mono">
                        {action.shortcut}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-primary-600 transition-colors">
                <span>Click to start</span>
                <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Command Palette Hint */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
        <div className="card-body p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Pro tip: Use the command palette
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Press <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-xs font-mono">Ctrl+K</kbd> to access all actions quickly
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickActions;