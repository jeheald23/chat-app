import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Alert, Platform, KeyboardAvoidingView } from 'react-native';  
import { getAuth, signInAnonymously } from "firebase/auth"; 

const Start = ({ navigation }) => {
  const auth = getAuth(); 
  
  const [name, setName] = useState(''); // State variable for user's name 
  const [background, setBackground] = useState('#090C08'); // State variable for background color 

  const signInUser = () => {
    // Check if the name input is empty
    if (!name.trim()) {
      Alert.alert("Please enter your name.");
      return;
    }

    signInAnonymously(auth)
      .then(result => {
        // Navigate to the Chat screen with user data
        navigation.navigate("Chat", 
        {name: name,
         background: background,
         userID: result.user.uid });
        // Show success message
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        // Show error message if sign-in fails
        Alert.alert("Unable to sign in, please try again later.");
      })
  }

  const image = require('../img/BackgroundImage.png'); // Image background for the Start screen

  return (
    <View style={styles.container}>
      {/* Image background for the Start screen */}
      <ImageBackground source={image} style={styles.imageBackground} resizeMode='cover'>
        {/* Title of the app */}
        <Text style={styles.title}>Chat App</Text>
        {/* Container for input fields and buttons */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.whiteContainer}
        >
          {/* Input field for user's name */}
          <View style={styles.inputContainer}>
            {/* Text input field */}
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder='Your name'
              accessibilityLabel="Enter your name" // Accessibility label for screen readers
            />
          </View>
          {/* Text indicating to choose background color */}
          <Text style={styles.backgroundText}>Choose Background Color</Text>
          {/* Container for selecting background colors */}
          <View style={styles.colorContainer}>
            {/* Color options as touchable components */}
            <TouchableOpacity
              style={[styles.color, 
                { backgroundColor: '#090C08' },
                background === '#090C08' ? styles.selectedColor : null
              ]}
              onPress={() => setBackground('#090C08')}
              accessibilityLabel="Black background" // Accessibility label for screen readers
            />
            <TouchableOpacity
              style={[styles.color, 
                { backgroundColor: '#474056' },
                background === '#474056' ? styles.selectedColor : null
              ]}
              onPress={() => setBackground('#474056')}
              accessibilityLabel="Dark gray background" // Accessibility label for screen readers
            />
            <TouchableOpacity
              style={[styles.color, 
                { backgroundColor: '#8A95A5' },
                background === '#8A95A5' ? styles.selectedColor : null
              ]}
              onPress={() => setBackground('#8A95A5')}
              accessibilityLabel="Gray background" // Accessibility label for screen readers
            />
            <TouchableOpacity
              style={[styles.color, 
                { backgroundColor: '#B9C6AE' },
                background === '#B9C6AE' ? styles.selectedColor : null
              ]}
              onPress={() => setBackground('#B9C6AE')}
              accessibilityLabel="Light gray background" // Accessibility label for screen readers
            />
          </View>
          {/* Button to start chatting */}
          <TouchableOpacity 
            style={styles.startChattingButton}
            onPress={signInUser}
            accessibilityLabel="Start Chatting" // Accessibility label for screen readers
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  whiteContainer: {
    height: "44%",
    width: "88%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingBottom: Platform.OS === 'ios' ? 0 : 50 // Adjust paddingBottom for Android
  },
  title: {
    padding: '25%',
    flex: 6,
    fontSize: 45,
    fontWeight: '600',
    color: '#fff',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginLeft: 10,
    width: "88%",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#757083',
    padding: 18,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 10,
    width: "88%",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginLeft: 10,
    marginBottom: 5,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20
  },
  backgroundText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginLeft: 20
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10
  },
  startChattingButton: {
    width: "88%",
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#757083",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: 'red', // Choose a color for the indicator border
  }
});

export default Start;


