import React, {useEffect, useState} from "react";
import { ISighting} from "../../types";
import {View, Text, FlatList, Pressable} from "react-native";
import { useLocalSearchParams } from "expo-router";

const Details = () => {
    const { id } = useLocalSearchParams(); 
    const [sighting, setSighting] = useState<ISighting>();

    useEffect(()=>{
        const loadData = async() => {
        try{
            let result = await fetch(`https://sampleapis.assimilate.be/ufo/sightings/${id}`); //fetch by id
            let json : ISighting = await result.json();
            setSighting(json);
        } catch{Error}{
            console.error("Error fetching sighting:",console.error(Error) // fix correct error handling logic and render
            );
        }
        }
        if(id) loadData();
    },[id]);
    
    return (
        <View>
            <Text>{sighting?.id}</Text>
            <Text>{sighting?.witnessName}</Text>
        </View>
    )

};

export default Details;