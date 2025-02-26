import React, {useEffect, useState} from "react";
import { ISighting} from "../types";
import {View, Text, FlatList, Pressable} from "react-native";
import Constants from "expo-constants";
import { ScrollView } from "react-native-gesture-handler";

const Details = () => {
    const [results, setResults] = useState<ISighting[]>([]);

    useEffect(()=>{
       const loadData = async() => {
        let result = await fetch("https://sampleapis.assimilate.be/ufo/sightings"); //fetch by id
        let json : ISighting[] = await result.json();

        setResults(json);
        }
        loadData();
    },[]);
    
    return (
        <View>
        </View>
    )

};

export default Details;