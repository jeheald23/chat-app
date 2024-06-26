// Import necessary modules and components
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from "@react-native-community/netinfo";
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { Alert } from "react-native";
import { getStorage } from "firebase/storage";

// Import screens
import Start from './components/Start';
import Chat from './components/Chat';

// Create a stack navigator
const Stack = createNativeStackNavigator();

// Define the main App component
const App = () => {
  // Get the network connection status
  const connectionStatus = useNetInfo();

  //Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAbxgrgnJG_7KYpZfsFvSYn31kY9UTnCuI",
    authDomain: "chat-app-d848a.firebaseapp.com",
    projectId: "chat-app-d848a",
    storageBucket: "chat-app-d848a.appspot.com",
    messagingSenderId: "844304330875",
    appId: "1:844304330875:web:2d4a9757e22734be6132de"
  };

  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);

  // Initialize Firestore database
  const db = getFirestore(app);

  // Initialize Firebase Storage handler
  const storage = getStorage(app);

  // Effect hook to handle network connection changes
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db); // Disable network connection when offline
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db); // Enable network connection when online
    }
  }, [connectionStatus.isConnected]);

  // Render the navigation container and stack navigator
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {props => <Chat
          isConnected={connectionStatus.isConnected} // Pass connection status as prop to Chat
          db={db} // Pass Firestore database instance as prop to Chat
          storage={storage} // Pass Firebase Storage instance as prop to Chat
          {...props}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Export the main App component as default
export default App;





