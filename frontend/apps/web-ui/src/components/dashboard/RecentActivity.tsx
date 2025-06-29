import React from 'react';
import { Card } from '../ui';
import { cn } from '../../utils/cn';

interface ActivityItem {
  id: string;
  type: 'chat' | 'task' | 'integration' | 'file' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'success' | 'error' | 'warning' | 'info';
  metadata?: {
    user?: string;
    duration?: number;
    result?: string;
  };
}

interface RecentActivityProps {
  activities: ActivityItem[];
  maxItems?: number;
  showAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  maxItems = 10,
  showAll = false,
  onViewAll,
  className
}) => {
  const displayedActivities = showAll ? activities : activities.slice(0, maxItems);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'task':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'integration':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'file':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getActivityColor = (type: string, status?: string) => {
    if (status) {
      switch (status) {
        case 'success': return 'text-success-600 bg-success-100';
        case 'error': return 'text-error-600 bg-error-100';
        case 'warning': return 'text-warning-600 bg-warning-100';
        case 'info': return 'text-primary-600 bg-primary-100';
      }
    }

    switch (type) {
      case 'chat': return 'text-primary-600 bg-primary-100';
      case 'task': return 'text-secondary-600 bg-secondary-100';
      case 'integration': return 'text-warning-600 bg-warning-100';
      case 'file': return 'text-neutral-600 bg-neutral-100';
      case 'system': return 'text-neutral-600 bg-neutral-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Recent Activity
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Your latest interactions and updates
          </p>
        </div>
        
        {!showAll && activities.length > maxItems && (
          <button
            onClick={onViewAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium hover-scale"
          >
            View all
          </button>
        )}
      </div>

      <Card>
        <div className="card-body p-0">
          {displayedActivities.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                No recent activity
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Start using the platform to see your activity here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {displayedActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      getActivityColor(activity.type, activity.status)
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {activity.title}
                        </h4>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0 ml-2">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                        {activity.description}
                      </p>
                      
                      {activity.metadata && (
                        <div className="flex items-center space-x-4 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                          {activity.metadata.user && (
                            <span>by {activity.metadata.user}</span>
                          )}
                          {activity.metadata.duration && (
                            <span>{activity.metadata.duration}s</span>
                          )}
                          {activity.metadata.result && (
                            <span className={cn(
                              'px-2 py-1 rounded-full font-medium',
                              activity.status === 'success' ? 'bg-success-100 text-success-700' :
                              activity.status === 'error' ? 'bg-error-100 text-error-700' :
                              'bg-neutral-100 text-neutral-700'
                            )}>
                              {activity.metadata.result}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RecentActivity;