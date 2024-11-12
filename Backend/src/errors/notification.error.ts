import IError from "../interfaces/error.interface";

export const NotificationCreationError: IError = {
  name: "NotificationCreationError",
  status: 500,
  message: "Error creating notification",
};

export const NotificationRetrievalError: IError = {
  name: "NotificationRetrievalError",
  status: 500,
  message: "Error retrieving notifications",
};

export const NotificationDeletionError: IError = {
  name: "NotificationDeletionError",
  status: 500,
  message: "Error deleting notifications",
};
