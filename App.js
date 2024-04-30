import { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Alert, TextInput, Text, Switch, Dimensions  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

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

      await MediaLibrary.saveToLibraryAsync(fileUri);
      setImage({ uri: fileUri }); // Update the image state with the resized image URI
      getImageSize(fileUri, true); // Update image dimensions
      setResized(true);
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

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={pickImage} style={styles.button} />
      {image && <Image source={{ uri: image.uri }} style={[styles.image, getImageDimensions()]} />}
      {!resized && ( // Show inputs, switch, and resize button if not resized
        <View style={styles.inputContainer}>
          <View style={styles.rowContainer}>
            <TextInput
              value={newWidth}
              onChangeText={(text) => setNewWidth(text)}
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
                  setNewHeight('');
                } else {
                  if (originalWidth && originalHeight) {
                    const newHeight = Math.round((parseInt(newWidth) * originalHeight) / originalWidth);
                    setNewHeight(newHeight.toString());
                  }
                }
              }}
            />
          </View>
          <Button title="Resize" onPress={resizeImage} />
        </View>
      )}
      {resized && <Text>Image Resized!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    width: 200,
    height:50,
    margin:20
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
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginRight: 5,
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