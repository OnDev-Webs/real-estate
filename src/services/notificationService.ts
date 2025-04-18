
import { authenticatedRequest } from "./utils/apiHelpers";

/**
 * Get all user notifications
 */
export const getUserNotifications = async () => {
  try {
    const response = await authenticatedRequest("/notifications", "GET");
    console.log("Notifications API response:", response);
    return response.notifications || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await authenticatedRequest(`/notifications/${notificationId}/read`, "PUT");
    return response.notification;
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
    const response = await authenticatedRequest("/notifications/read-all", "PUT");
    return response.notifications;
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
    const response = await authenticatedRequest(`/notifications/${notificationId}`, "DELETE");
    return response;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

/**
 * Create notification (admin only)
 */
export const createNotification = async (title: string, message: string, userIds: string[], type: string = "admin-notification") => {
  try {
    const response = await authenticatedRequest("/notifications", "POST", {
      title,
      message,
      userIds,
      type
    });
    return response.notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
