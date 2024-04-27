import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
// Import necessary modules and components
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions'; // Importing custom actions component
import MapView from 'react-native-maps';

// Define the Chat component
const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { userID } = route.params;
  const { name, background } = route.params;
  const [messages, setMessages] = useState([]); // State to store messages

  let unsubMessages;

  // Effect hook to load messages and handle disconnection
  useEffect(() => {
    const loadMessages = async () => {
      if (isConnected) {
        if (unsubMessages) unsubMessages();

        navigation.setOptions({ title: name });

        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        unsubMessages = onSnapshot(q, (documentsSnapshot) => {
          let newMessages = [];
          documentsSnapshot.forEach(doc => {
            newMessages.push({
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis())
            });
          });
          cacheMessages(newMessages); // Cache messages for offline use
          setMessages(newMessages);
        });
      } else {
        loadCachedMessages();
      }
    };

    loadMessages();

    return () => {
      if (unsubMessages) unsubMessages(); // Unsubscribe from snapshot listener
    };
  }, [isConnected]);

  // Function to load cached messages when offline
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("messages");
      if (cachedMessages !== null) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to cache messages for offline use
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to send new messages to Firestore
  const onSend = (newMessages = []) => {
    newMessages.forEach(async (message) => {
      try {
        await addDoc(collection(db, "messages"), message);
      } catch (error) {
        console.error("Error adding message: ", error);
      }
    });
  };

  // Render bubble styles for chat messages
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000" // Styling for user's messages
          },
          left: {
            backgroundColor: "#FFF" // Styling for others' messages
          }
        }}
      />
    );
  };

  // Render input toolbar conditionally based on connection status
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Render custom actions component for additional functionality
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  // Render custom view for displaying map view of location messages
  const renderCustomView = (props) => {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

  // Return the chat component UI
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: userID,
          name,
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};

// Styles for the Chat component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Export the Chat component as default
export default Chat;
