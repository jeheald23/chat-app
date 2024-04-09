import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  // Destructuring 'name' from route params
  const { name } = route.params;
  
  // State to manage chat messages
  const [messages, setMessages] = useState([]);
  
  // useEffect to set navigation options and initial messages
  useEffect(() => {
    // Setting the title of the chat screen
    navigation.setOptions({ title: name });
    
    // Setting initial messages
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []); // Empty dependency array to run the effect only once on component mount

  // Function to handle sending messages
  const onSend = (messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
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
    <View style={styles.container}>
      {/* GiftedChat component for displaying chat interface */}
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1 // User ID for the current user
        }}
      />
      {/* Conditionally rendering KeyboardAvoidingView for Android */}
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
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
