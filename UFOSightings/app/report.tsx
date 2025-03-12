import { useEffect, useState, useContext } from "react";
import * as Location from "expo-location";
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Switch,
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
      picture: "",
      status: statusConfirmed ? "confirmed" : "unconfirmed",
      dateTime: timestamp,
      witnessContact: email,
    };
    addReport(newReport);

    setWitnessName("");
    setDescription("");
    setEmail("");
    setStatusConfirmed(false);
    Alert.alert("Success", "Your report has been submitted.");
  };

  return (
    <View style={styles.container}>
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
});
export default report;
