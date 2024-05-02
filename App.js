import { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Alert, TextInput, Text, Switch, Dimensions, TouchableOpacity  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import HeaderBar from './components/HeaderBar'; // Import the HeaderBar component

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [newWidth, setNewWidth] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resized, setResized] = useState(false);
  const [originalWidth, setOriginalWidth] = useState('');
  const [originalHeight, setOriginalHeight] = useState('');

  useEffect(() => {
    // Request permission for accessing media library
    requestMediaLibraryPermission();
    console.log(image);
  }, []);

  const requestMediaLibraryPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'This app needs access to your media library to save images.'
      );
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImage({ uri: result.assets[0].uri });
      getImageSize(result.assets[0].uri, assignOrignalValues=true);
      setResized(false); // Reset resized state when a new image is picked
    }
  };

  const getImageSize = async (uri, asignOriginalValues = false) => {
    const { width, height } = await new Promise((resolve) => {
      Image.getSize(uri, (width, height) => {
        resolve({ width: width, height: height });
      });
    });

    console.log('Width:', width, 'Height:', height);

    // Check if width and height are valid
    if (width !== undefined && height !== undefined) {
      setNewWidth(width.toString());
      setNewHeight(height.toString());
      if (asignOriginalValues) {
        setOriginalHeight(height);
        setOriginalWidth(width);
      }
    } else {
      console.warn('Image width or height is undefined');
    }
  };

  const resizeImage = async () => {
    try {
      const manipResult = await manipulateAsync(
        image.uri,
        [{ resize: { width: parseInt(newWidth), height: parseInt(newHeight) } }],
        { compress: 1, format: SaveFormat.PNG }
      );

      const directory = `${FileSystem.documentDirectory}resized_images/`;
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

      const fileUri = `${directory}resized_image.png`;
      await FileSystem.copyAsync({ from: manipResult.uri, to: fileUri });


      // Request device storage access permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await MediaLibrary.saveToLibraryAsync(fileUri);
        setImage({ uri: fileUri }); // Update the image state with the resized image URI
        getImageSize(fileUri, true); // Update image dimensions
        setResized(true);
      }else{
        Alert.alert(
          'Permission Required',
          'This app needs access to your media library to save images.'
        );
      }
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const getImageDimensions = () => {
    const maxWidth = screenWidth * 0.8;
    const maxHeight = screenHeight * 0.4;
    let imageWidth, imageHeight;
  
    if (originalWidth && originalHeight) {
      // Calculate image dimensions while maintaining aspect ratio
      const widthRatio = originalWidth / maxWidth;
      const heightRatio = originalHeight / maxHeight;
      const maxRatio = Math.max(widthRatio, heightRatio);
  
      if (maxRatio <= 1) {
        // Original image fits within maxWidth and maxHeight, no resizing needed
        imageWidth = originalWidth;
        imageHeight = originalHeight;
      } else {
        imageWidth = originalWidth / maxRatio;
        imageHeight = originalHeight / maxRatio;
      }
    }
  
    return { width: imageWidth, height: imageHeight };
  };

  const onNewWidthChange = (text) => {
    setNewWidth(text);
    if (maintainAspectRatio && originalWidth && originalHeight) {
      const newHeight = Math.round((parseInt(text) * originalHeight) / originalWidth);
      setNewHeight(newHeight.toString());
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar />
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>SELECT IMAGE</Text>
      </TouchableOpacity>
      {!image && <Image source={require('./assets/placeholder_img.png')} style={[styles.image, {width: 200, height:200}]} /> }
      {image && <Image source={image} style={[styles.image, getImageDimensions()]} />}
      {!resized && ( // Show inputs, switch, and resize button if not resized
        <View style={styles.inputContainer}>
          <View style={styles.rowContainer}>
            <TextInput
              value={newWidth}
              onChangeText={onNewWidthChange}
              keyboardType="numeric"
              placeholder="Width"
              style={styles.input}
            />
            <Text style={styles.crossText}>x</Text>
            <TextInput
              value={newHeight}
              onChangeText={(text) => setNewHeight(text)}
              keyboardType="numeric"
              placeholder="Height"
              style={styles.input}
              editable={!maintainAspectRatio}
            />
          </View>
          <View style={styles.checkBoxContainer}>
            <Text>Maintain Aspect Ratio</Text>
            <Switch
              value={maintainAspectRatio}
              onValueChange={(value) => {
                setMaintainAspectRatio(value);
                if (!value) {
                  //setNewHeight('');
                } else {
                  if (originalWidth && originalHeight) {
                    const newHeight = Math.round((parseInt(newWidth) * originalHeight) / originalWidth);
                    setNewHeight(newHeight.toString());
                  }
                }
              }}
              thumbColor="#4a148c" // Change the color of the switch's thumb
              trackColor={{ false: "#e7e0ec", true: "#4a148c" }} // Change the color of the switch's track
            />
          </View>
          <TouchableOpacity onPress={resizeImage} style={styles.button}>
            <Text style={styles.buttonText}>RESIZE IMAGE</Text>
          </TouchableOpacity>
        </View>
      )}
      {resized && <Text>Image Resized!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0, // Remove any padding at the top
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content at the top
    paddingTop: 30
  },
  button:{
    width: 200,
    height:40,
    margin:20,
    backgroundColor: "#4a148c",
    color: "white",
    borderRadius: 5,
    alignItems: 'center', // Center the text vertically
    justifyContent: "center",
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center', // Center the text vertically
  },
  image: {
    width: 200,
    margin: 20,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    margin: 5,
    width:100,
  },
  crossText: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});