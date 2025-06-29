import React, { useState } from 'react';
import { Container } from '../../components/ui';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentActivity from '../../components/dashboard/RecentActivity';
import ChatInterface from '../../components/chat/ChatInterface';

// Mock data
const mockActivities = [
  {
    id: '1',
    type: 'chat' as const,
    title: 'AI Conversation Started',
    description: 'Started a new conversation about project planning',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    status: 'success' as const,
    metadata: { duration: 45, result: 'Completed' }
  },
  {
    id: '2',
    type: 'task' as const,
    title: 'Task Created',
    description: 'Created "Review quarterly reports" with high priority',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    status: 'success' as const,
    metadata: { user: 'You' }
  },
  {
    id: '3',
    type: 'integration' as const,
    title: 'Gmail Connected',
    description: 'Successfully connected Gmail account for email automation',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'success' as const,
    metadata: { result: 'Active' }
  },
  {
    id: '4',
    type: 'file' as const,
    title: 'Document Analyzed',
    description: 'Analyzed "Marketing Strategy 2024.pdf" and extracted key insights',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'success' as const,
    metadata: { duration: 12, result: '15 insights found' }
  },
  {
    id: '5',
    type: 'system' as const,
    title: 'Profile Updated',
    description: 'Updated AI personality settings to "Professional & Focused"',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'info' as const,
    metadata: { user: 'You' }
  }
];

const mockMessages = [
  {
    id: '1',
    role: 'assistant' as const,
    content: 'Hello! I\'m your AI assistant. I can help you with tasks, answer questions, analyze data, and much more. What would you like to work on today?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    metadata: {
      suggestions: [
        'Help me plan my day',
        'Analyze this document',
        'Create a task list',
        'Schedule a meeting'
      ]
    }
  }
];

const DashboardPage: React.FC = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date(),
      status: 'sent' as const
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `I understand you want to "${content}". Let me help you with that. Here's what I can do:\n\n1. Break down the task into manageable steps\n2. Provide relevant resources and information\n3. Set up reminders and follow-ups\n\nWould you like me to proceed with any of these options?`,
        timestamp: new Date(),
        metadata: {
          actions: [
            { label: 'Create Task', action: 'create-task', icon: '📝' },
            { label: 'Set Reminder', action: 'set-reminder', icon: '⏰' },
            { label: 'Find Resources', action: 'find-resources', icon: '🔍' }
          ]
        }
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'new-chat':
        setShowChat(true);
        break;
      case 'schedule-task':
        // Navigate to task manager
        console.log('Navigate to task manager');
        break;
      case 'analyze-data':
        // Open file upload
        console.log('Open file upload');
        break;
      case 'voice-command':
        // Start voice recording
        console.log('Start voice recording');
        break;
      case 'integrations':
        // Navigate to integrations
        console.log('Navigate to integrations');
        break;
      case 'settings':
        // Navigate to settings
        console.log('Navigate to settings');
        break;
    }
  };

  if (showChat) {
    return (
      <div className="h-screen flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  AI Assistant
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Ready to help with your tasks
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            suggestions={[
              'Help me write an email',
              'Plan my day',
              'Analyze this data',
              'Create a presentation'
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg-light dark:bg-gradient-bg-dark">
      <Container className="py-8">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-display font-bold gradient-text">
              Welcome back!
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Your AI-powered workspace is ready. Start a conversation, manage tasks, 
              or explore integrations to boost your productivity.
            </p>
          </div>

          {/* Quick Actions */}
          <QuickActions onActionClick={handleQuickAction} />

          {/* Recent Activity */}
          <RecentActivity 
            activities={mockActivities}
            maxItems={5}
            onViewAll={() => console.log('View all activities')}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card hover-lift">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  24
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Conversations this week
                </p>
              </div>
            </div>

            <div className="card hover-lift">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-gradient-secondary rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  12
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Tasks completed
                </p>
              </div>
            </div>

            <div className="card hover-lift">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  8.5h
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Time saved this week
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DashboardPage;