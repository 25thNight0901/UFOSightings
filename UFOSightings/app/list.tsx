import React, { useEffect, useState } from "react";
import { ISighting } from "../types";
import { View, Text, FlatList, Pressable } from "react-native";
import Constants from "expo-constants";
import { Link } from "expo-router";
import { useUFO } from "../ufoContext";

const List = () => {
  const { sightings, loading } = useUFO();

  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        paddingTop: Constants.statusBarHeight,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: 700 }}>List of sightings</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ddd",
          padding: 10,
        }}
      >
        <Text style={{ flex: 1, fontWeight: "bold" }}>ID</Text>
        <Text style={{ flex: 1, fontWeight: "bold" }}>Witness</Text>
        <Text style={{ flex: 1, fontWeight: "bold" }}>Status</Text>
        <Text style={{ flex: 1, fontWeight: "bold" }}>Date/Time</Text>
      </View>
      <FlatList
        data={sightings}
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
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <Text style={{ flex: 1 }}>{item.id}</Text>
          <Text style={{ flex: 1 }}>{item.witnessName}</Text>
          <Text style={{ flex: 1 }}>{item.status}</Text>
          <Text style={{ flex: 1 }}>{item.dateTime.toString()}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default List;
