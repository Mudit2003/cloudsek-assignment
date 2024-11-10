import { Notification } from "../models/notification.model";

export const createNotification = async (
  title: string,
  userId: string,
  content: string
) => {
  const notification = new Notification({ title, userId, content });
  return await notification.save();
};

export const getNotificationsForUser = async (userId: string) => {
  return await Notification.find({ userId });
};

export const markNotificationsAsRead = async (userId: string) => {
  return await Notification.deleteMany({ userId });
};
