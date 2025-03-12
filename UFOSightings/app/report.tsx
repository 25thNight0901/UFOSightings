import { useEffect, useState, useContext } from "react";
import * as Location from "expo-location";
import { Alert, View, StyleSheet, Text, TextInput, Button } from "react-native";
import { ILocation } from "../types";

const report = () => {
  const [witnessName, setWitnessName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState<ILocation | null>(null);
  const [timestamp, setTimestamp] = useState("");

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
    Alert.alert("Submitted", "Your report has been recorded.");
    console.log({ witnessName, description, email, location, timestamp });
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

      {location && (
        <Text style={styles.info}>
          Location: {location.latitude}, {location.longitude}
        </Text>
      )}
      <Text style={styles.info}>Time: {timestamp}</Text>

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
});
export default report;
