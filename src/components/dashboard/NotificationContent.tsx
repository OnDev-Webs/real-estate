
import { useState, useEffect } from "react";
import { Bell, Eye, Home, User, MessageSquare, Heart, CheckCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getNotifications, markNotificationAsRead } from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  data?: any;
}

const NotificationContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const fetchedNotifications = await getNotifications();
        setNotifications(fetchedNotifications);
        
        // Check if there are any unread notifications
        const unreadCount = fetchedNotifications.filter(notification => !notification.read).length;
        setHasNewNotifications(unreadCount > 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
    
    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user, toast]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
      
      // Recheck if there are still any unread notifications
      const stillUnreadCount = notifications.filter(notification => 
        notification.id !== notificationId && !notification.read
      ).length;
      
      setHasNewNotifications(stillUnreadCount > 0);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Typically you'd have an API endpoint for this, but for now we'll
      // use individual calls
      const unreadNotifications = notifications.filter(notification => !notification.read);
      for (const notification of unreadNotifications) {
        await markNotificationAsRead(notification.id);
      }
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setHasNewNotifications(false);
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'property':
        return <Home className="h-5 w-5 text-green-500" />;
      case 'user':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'message':
      case 'contact':
        return <MessageSquare className="h-5 w-5 text-yellow-500" />;
      case 'favorite':
        return <Heart className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-estate-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        {hasNewNotifications && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
            <p className="mt-2 text-sm text-gray-500">
              You don't have any notifications yet. They'll appear here when you get them.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    {notification.link ? (
                      <Link to={notification.link} className="block">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.message}
                        </p>
                      </Link>
                    ) : (
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {getRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationContent;
