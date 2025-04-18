import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/services/dashboardService";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Eye, Clock, AlertCircle } from "lucide-react";

interface Notification {
  id: string;
  propertyTitle: string;
  viewedAt: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getDashboardStats();
        const recents = stats.recentProperties || [];
        // Map recentProperties to notification items
        const notes = recents.map(prop => ({
          id: prop.id || prop._id,
          propertyTitle: prop.title,
          viewedAt: prop.updatedAt || prop.createdAt || new Date().toISOString(),
        }));
        setNotifications(notes);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({
          title: "Error",
          description: "Failed to load notifications.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-estate-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Notifications Yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            View events will appear here as soon as clients interact with your listings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button asChild variant="outline">
          <Link to="/dashboard?tab=properties">Manage Properties</Link>
        </Button>
      </header>

      <div className="space-y-4">
        {notifications.map((note) => (
          <Card key={note.id} className="overflow-hidden">
            <CardHeader className="flex items-left justify-between pb-2 mb-3">
              <CardTitle className="flex items-left gap-2 text-base">
                <Eye className="w-5 h-5 text-gray-600" />
                {`Your property “${note.propertyTitle}” was viewed`}
              </CardTitle>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(note.viewedAt), { addSuffix: true })}
              </span>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              <p>
                Someone viewed your listing <strong>{note.propertyTitle}</strong>.
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(new Date(note.viewedAt), { addSuffix: true })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
