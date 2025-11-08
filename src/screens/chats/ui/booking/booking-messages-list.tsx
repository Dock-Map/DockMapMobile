import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { BookingMessageComponent } from "./booking-message";
import { DateSeparator } from "./date-separator";
import { BookingMessagesGroup } from "./types";

interface BookingMessagesListProps {
  messagesGroups: BookingMessagesGroup[];
  newMessagesCount?: number;
}

export function BookingMessagesList({
  messagesGroups,
  newMessagesCount = 0,
}: BookingMessagesListProps) {
  const formatDate = (date: string): string => {
    const today = new Date();
    const messageDate = new Date(date);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      messageDate.toDateString() === today.toDateString()
    ) {
      return "Сегодня";
    }
    if (
      messageDate.toDateString() === yesterday.toDateString()
    ) {
      return "Вчера";
    }

    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    return `${messageDate.getDate()} ${months[messageDate.getMonth()]}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {messagesGroups.map((group, groupIndex) => {
          const isFirstGroup = groupIndex === 0;
          const isNewMessagesGroup = isFirstGroup && newMessagesCount > 0;
          
          return (
            <View key={group.date}>
              {isNewMessagesGroup && (
                <DateSeparator date="Новые сообщения" isNewMessages={true} />
              )}
              {!isNewMessagesGroup && (
                <DateSeparator date={formatDate(group.date)} />
              )}
              {group.messages.map((message) => (
                <BookingMessageComponent key={message.id} message={message} />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 80,
  },
});

