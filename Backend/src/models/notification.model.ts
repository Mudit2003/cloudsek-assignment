// src/models/notification.model.ts
import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: "7d" } }, // TTL index
});

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
