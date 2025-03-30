
import { authenticatedRequest } from "./utils/apiHelpers";

/**
 * Get user notifications
 */
export const getNotifications = async () => {
  try {
    const response = await authenticatedRequest("/notifications");
    return response.notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await authenticatedRequest(
      `/notifications/${notificationId}/read`,
      "PUT"
    );
    return response;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await authenticatedRequest(
      "/notifications/read-all",
      "PUT"
    );
    return response;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await authenticatedRequest(
      `/notifications/${notificationId}`,
      "DELETE"
    );
    return response;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
