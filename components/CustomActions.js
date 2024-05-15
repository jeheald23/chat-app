import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  const actionSheet = useActionSheet();
  const [uploading, setUploading] = useState(false); // State to manage uploading indicator

  const onActionPress = () => {
    // Options for the action sheet
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    // Show the action sheet with options
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        // Handle different button indices
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
          default:
        }
      },
    );
  };

  const generateReference = (uri) => {
    // Generate a unique reference for the uploaded image
    const imageName = uri.split("/")[uri.split("/").length - 1];
    const timeStamp = (new Date()).getTime();
    return `${userID}-${timeStamp}-${imageName}`;
  }

  const uploadAndSendImage = async (imageURI) => {
    setUploading(true); // Start the loading indicator

    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();

    // Upload the image to Firebase Storage and get the download URL
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      // Send the URL to the parent component
      onSend({ image: imageURL });
      setUploading(false); // Stop the loading indicator after uploading
    }).catch(error => {
      console.error("Error uploading image:", error);
      setUploading(false); // Stop the loading indicator if there's an error
    });
  }

  const pickImage = async () => {
    // Function to pick an image from the device's library
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  const takePhoto = async () => {
    // Function to take a photo using the device's camera
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  const getLocation = async () => {
    // Function to get the current device location
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        // Send the location data to the parent component
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions haven't been granted.");
  }

  return (
    <TouchableOpacity 
      accessible={true} 
      accessibilityLabel="More options" 
      accessibilityHint="Choose to send an image or your location." 
      accessibilityRole="button" 
      style={styles.container} 
      onPress={onActionPress}
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        {uploading ? ( // Conditionally render the loading indicator
          <ActivityIndicator size="small" color="#b2b2b2" />
        ) : (
          <Text style={[styles.iconText, iconTextStyle]}>+</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
