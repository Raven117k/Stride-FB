import Notification from "../../Models/notificationSchema.js";

export const sendAlert = async (io, userId, title, message, type = 'system') => {
  try {
    const note = new Notification({ userId, title, message, type });
    await note.save();

    // Emit real-time event to the specific user's room
    if (io) {
      io.to(userId.toString()).emit("new_notification", note);
    }
    
    return note;
  } catch (err) {
    console.error("Notification trigger failed", err);
    return null;
  }
};

// Batch notification sending for multiple users
export const sendAlertToMultiple = async (io, userIds, title, message, type = 'system') => {
  try {
    const notifications = await Notification.insertMany(
      userIds.map(userId => ({ userId, title, message, type }))
    );

    if (io) {
      notifications.forEach(note => {
        io.to(note.userId.toString()).emit("new_notification", note);
      });
    }
    
    return notifications;
  } catch (err) {
    console.error("Batch notification trigger failed", err);
    return [];
  }
};

export default sendAlert;