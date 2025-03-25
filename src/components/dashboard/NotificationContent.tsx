
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Calendar, 
  Heart, 
  Home, 
  MessageSquare, 
  Settings, 
  User, 
  Check, 
  AlertCircle, 
  Info
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "message" | "property" | "system" | "appointment";
}

const NotificationContent = () => {
  // Mock notification data - would come from API in a real app
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Message",
      message: "John Smith sent you a message about the Modern Apartment",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      type: "message"
    },
    {
      id: "2",
      title: "Property Update",
      message: "Your property 'Beach House' has received 5 new views",
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      type: "property"
    },
    {
      id: "3",
      title: "Appointment Scheduled",
      message: "Sarah Johnson has scheduled a viewing for tomorrow at 3PM",
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      type: "appointment"
    },
    {
      id: "4",
      title: "System Notification",
      message: "Your account information has been successfully updated",
      timestamp: new Date(Date.now() - 172800000),
      read: true,
      type: "system"
    },
    {
      id: "5",
      title: "Property Liked",
      message: "Robert Davis liked your Modern Apartment listing",
      timestamp: new Date(Date.now() - 259200000),
      read: true,
      type: "property"
    }
  ]);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "property":
        return <Home className="h-5 w-5 text-green-500" />;
      case "appointment":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "system":
        return <Settings className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Card className="h-[75vh]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            {unreadCount} unread
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ScrollArea className="h-[calc(75vh-140px)]">
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      markAsRead={markAsRead} 
                      icon={getNotificationIcon(notification.type)}
                    />
                  ))
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <Bell className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread">
            <ScrollArea className="h-[calc(75vh-140px)]">
              <div className="space-y-4">
                {notifications.filter(n => !n.read).length > 0 ? (
                  notifications
                    .filter(n => !n.read)
                    .map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                        markAsRead={markAsRead} 
                        icon={getNotificationIcon(notification.type)}
                      />
                    ))
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <Check className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                    <p>No unread notifications</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="messages">
            <ScrollArea className="h-[calc(75vh-140px)]">
              <div className="space-y-4">
                {notifications.filter(n => n.type === "message").length > 0 ? (
                  notifications
                    .filter(n => n.type === "message")
                    .map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                        markAsRead={markAsRead} 
                        icon={getNotificationIcon(notification.type)}
                      />
                    ))
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <MessageSquare className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                    <p>No message notifications</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="properties">
            <ScrollArea className="h-[calc(75vh-140px)]">
              <div className="space-y-4">
                {notifications.filter(n => n.type === "property").length > 0 ? (
                  notifications
                    .filter(n => n.type === "property")
                    .map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                        markAsRead={markAsRead} 
                        icon={getNotificationIcon(notification.type)}
                      />
                    ))
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <Home className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                    <p>No property notifications</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface NotificationItemProps {
  notification: Notification;
  markAsRead: (id: string) => void;
  icon: React.ReactNode;
}

const NotificationItem = ({ notification, markAsRead, icon }: NotificationItemProps) => {
  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors
        ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}
      onClick={() => !notification.read && markAsRead(notification.id)}
    >
      <div className="flex items-start space-x-3">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className={`font-medium ${notification.read ? '' : 'text-blue-600'}`}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500">
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        </div>
      </div>
    </div>
  );
};

// Helper function to format timestamps
const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than a minute ago
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than an hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Default to date
  return date.toLocaleDateString();
};

export default NotificationContent;
