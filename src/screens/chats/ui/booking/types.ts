export type BookingMessageType =
  | "booking_confirmed"
  | "booking_cancelled"
  | "reminder"
  | "notification";

export interface BookingMessage {
  id: string;
  type: BookingMessageType;
  title?: string;
  content: string;
  time: string;
  date?: string;
  hasActionButton?: boolean;
  actionButtonText?: string;
  onActionPress?: () => void;
}

export interface BookingMessagesGroup {
  date: string;
  messages: BookingMessage[];
}

