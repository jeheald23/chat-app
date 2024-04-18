// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'; // Import React

// Create the navigator
const Stack = createNativeStackNavigator();

// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const App = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAbxgrgnJG_7KYpZfsFvSYn31kY9UTnCuI",
    authDomain: "chat-app-d848a.firebaseapp.com",
    projectId: "chat-app-d848a",
    storageBucket: "chat-app-d848a.appspot.com",
    messagingSenderId: "844304330875",
    appId: "1:844304330875:web:2d4a9757e22734be6132de"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
