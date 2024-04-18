import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"; // Import orderBy

const Chat = ({ route, navigation, db }) => {
  const { userID } = route.params;
  // Destructuring 'name' from route params
  const { name, background } = route.params;

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc")); // Use orderBy
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      setMessages(newMessages);
    })
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);

  // Function to handle sending messages
  const onSend = (newMessages) => {
      addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Custom rendering for chat bubbles
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000" // Styling for sender's bubbles
        },
        left: {
          backgroundColor: "#FFF" // Styling for receiver's bubbles
        }
      }}
    />
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {/* GiftedChat component for displaying chat interface */}
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID, // User ID for the current user
          name: name // Name of the current user
        }}
      />
      {/* Conditionally rendering KeyboardAvoidingView for Android */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};

// Styles for the Chat component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up entire available space
  },
});

export default Chat; // Exporting the Chat component

