import React, { useEffect, useState } from "react";
import { ISighting } from "../types";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Link } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

const List = () => {
  const [results, setResults] = useState<ISighting[]>([]);

  useEffect(() => {
    const loadData = async () => {
      let result = await fetch(
        "https://sampleapis.assimilate.be/ufo/sightings"
      );
      let json: ISighting[] = await result.json();

      setResults(json);
    };
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>List of sightings</Text>
      <FlatList
        data={results}
        renderItem={({ item }) => <PersonComponent item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const PersonComponent = ({ item }: { item: ISighting }) => {
  return (
    <View>
      <Link
        href={{
          pathname: "/details/[id]",
          params: { id: item.id },
        }}
        asChild
      >
        <Pressable style={styles.card}>
          <Text>Name: {item.witnessName}</Text>
          <Text>Status: {item.status}</Text>
          <Text>Date/Time: {new Date(item.dateTime).toLocaleString()}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  }
});

export default List;
