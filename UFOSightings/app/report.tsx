import { useState, useRef, useEffect } from "react";
import * as Location from "expo-location";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Switch,
  Image,
  TouchableOpacity,
} from "react-native";
import { ILocation, ISighting } from "../types";
import { useUFO } from "../ufoContext";

const report = () => {
  const { addReport, sightings } = useUFO();
  const [witnessName, setWitnessName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState<ILocation | null>(null);
  const [timestamp, setTimestamp] = useState("");
  const [statusConfirmed, setStatusConfirmed] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access in settings.");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setTimestamp(new Date().toISOString());
    })();
  }, []);

  const takePicture = async () => {
    if (!permission?.granted) {
      requestPermission();
      return;
    }
    const photo = await ref.current?.takePictureAsync();
    setImageUri(photo?.uri || null);
    setIsCameraOpen(false);
  };

  const handleSubmit = () => {
    if (!witnessName || !description || !email) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const newReport: ISighting = {
      id: sightings.length + 1,
      witnessName,
      location: location
        ? { latitude: location.latitude, longitude: location.longitude }
        : { latitude: 0, longitude: 0 },
      description: description,
      picture: imageUri || "",
      status: statusConfirmed ? "confirmed" : "unconfirmed",
      dateTime: timestamp,
      witnessContact: email,
    };
    addReport(newReport);

    setWitnessName("");
    setDescription("");
    setEmail("");
    setStatusConfirmed(false);
    setImageUri("");
    Alert.alert("Success", "Your report has been submitted.");
  };

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <CameraView
          ref={ref}
          style={styles.camera}
          mode="picture"
          facing="back"
          mute={false}
        >
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsCameraOpen(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </CameraView>
      ) : (
        <View style={styles.cameraContainer}>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <View style={styles.buttonContainer}>
                <Button
                  title="Retake Picture"
                  onPress={() => setIsCameraOpen(true)}
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() => setIsCameraOpen(true)}
            >
              <Text style={styles.imagePlaceholderText}>
                Tap to add picture
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <Text style={styles.label}>Witness Name:</Text>
      <TextInput
        style={styles.input}
        value={witnessName}
        onChangeText={setWitnessName}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Status:</Text>
        <Text>{statusConfirmed ? "Confirmed" : "Unconfirmed"}</Text>
        <Switch
          value={statusConfirmed}
          onValueChange={setStatusConfirmed}
        ></Switch>
      </View>

      <Button title="Submit Report" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  info: {
    marginTop: 10,
    fontSize: 14,
    color: "gray",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  cameraContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 300,
    height: 300,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  imagePlaceholderText: {
    textAlign: "center",
    color: "#ccc",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },

  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
  },

  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default report;
