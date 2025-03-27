
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Heart,
  MessageSquare,
  DollarSign,
  Eye,
  AlertCircle,
  Calendar,
  Clock,
  MoreHorizontal,
  CheckCircle,
  Home
} from "lucide-react";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  Notification
} from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getUserNotifications();
        // Convert ISO string times to Date objects for display
        const notificationsWithDates = data.map(notification => ({
          ...notification,
          time: new Date(notification.time) 
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [toast]);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== id)
      );
      toast({
        title: "Success",
        description: "Notification deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification.",
        variant: "destructive",
      });
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 60 * 24) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return `${Math.floor(diffInMinutes / (60 * 24))} days ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'property':
        return <Eye className="h-5 w-5 text-green-500" />;
      case 'offer':
        return <DollarSign className="h-5 w-5 text-yellow-500" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'message' && notification.relatedId) {
      navigate('/messages');
    } else if (['property', 'offer', 'alert'].includes(notification.type) && notification.relatedId) {
      navigate(`/property/${notification.relatedId.split('-')[1]}`);
    } else if (notification.type === 'appointment') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with top navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-10 w-10 border-2 border-estate-primary rounded-full border-t-transparent mb-4"></div>
                  <p className="text-gray-600">Loading notifications...</p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <TabsList>
                    <TabsTrigger value="all">
                      All
                      {notifications.length > 0 && (
                        <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                          {notifications.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="unread">
                      Unread
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-estate-primary text-white rounded-full px-2 py-0.5 text-xs">
                          {unreadCount}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  )}
                </div>

                <TabsContent value="all" className="m-0">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-gray-700 font-medium mb-2">No notifications</h3>
                      <p className="text-gray-500 max-w-sm">
                        You'll receive notifications about messages, property updates, and more.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {notifications.map(notification => (
                        <li 
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div 
                              className="ml-4 flex-1 cursor-pointer"
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex justify-between">
                                <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    {formatNotificationTime(notification.time)}
                                  </span>
                                  {!notification.read && (
                                    <span className="h-2 w-2 bg-estate-primary rounded-full"></span>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {notification.message}
                              </p>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>

                <TabsContent value="unread" className="m-0">
                  {unreadCount === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-gray-700 font-medium mb-2">All caught up!</h3>
                      <p className="text-gray-500 max-w-sm">
                        You have no unread notifications.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {notifications
                        .filter(notification => !notification.read)
                        .map(notification => (
                          <li 
                            key={notification.id}
                            className="p-4 hover:bg-gray-50 bg-blue-50/30"
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div 
                                className="ml-4 flex-1 cursor-pointer"
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </p>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">
                                      {formatNotificationTime(notification.time)}
                                    </span>
                                    <span className="h-2 w-2 bg-estate-primary rounded-full"></span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;