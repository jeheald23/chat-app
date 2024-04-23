import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';  
import { getAuth, signInAnonymously } from "firebase/auth"; // Import from Firebase Authentication

const Start = ({ navigation }) => {
  const auth = getAuth(); // Get authentication instance
  
  const [name, setName] = useState(''); // State variable for user's name
  const [background, setBackground] = useState(''); // State variable for background color

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", 
        {name: name,
         background: background,
         userID: result.user.uid });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, please try again later.");
      })
  }

  // Image background for the Start screen
  const image = require('../img/BackgroundImage.png');

  return (
    <View style={styles.container}>
      {/* Image background for the Start screen */}
      <ImageBackground source={image} style={styles.imageBackground} resizeMode='cover'>
        {/* Title of the app */}
        <Text style={styles.title}>Chat App</Text>
        {/* Container for input fields and buttons */}
        <View style={styles.whiteContainer}>
          {/* Input field for user's name */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder='Your name'
            />
          </View>
          {/* Text indicating to choose background color */}
          <Text style={styles.backgroundText}>Choose Background Color</Text>
          {/* Container for selecting background colors */}
          <View style={styles.colorContainer}>
            {/* Color options as touchable components */}
            <TouchableOpacity
              style={[styles.color, { backgroundColor: '#090C08' }]}
              onPress={() => setBackground('#090C08')}
            />
            <TouchableOpacity
              style={[styles.color, { backgroundColor: '#474056' }]}
              onPress={() => setBackground('#474056')}
            />
            <TouchableOpacity
              style={[styles.color, { backgroundColor: '#8A95A5' }]}
              onPress={() => setBackground('#8A95A5')}
            />
            <TouchableOpacity
              style={[styles.color, { backgroundColor: '#B9C6AE' }]}
              onPress={() => setBackground('#B9C6AE')}
            />
          </View>
          {/* Button to start chatting */}
          <TouchableOpacity 
            style={styles.startChattingButton}
            onPress={signInUser} // Use signInUser function to sign in anonymously
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

// Styles for the Start component
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
    height: "500px",
    backgroundColor: "white",
    alignItems: "center",
    marginBottom: 30,
    justifyContent: "space-evenly",
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
    marginLeft: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#757083',
    padding: 18,
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
    marginBottom: 10
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
  }
});

export default Start; // Exporting the Start component
