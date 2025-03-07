import React, {useEffect, useState} from "react";
import { ISighting} from "../../types";
import {View, Text, StyleSheet, Image} from "react-native";
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
        <View style={styles.card}>
            {sighting? (
                <>
                <Text style={styles.header}>Sighting number: {sighting.id}</Text>
                <Text>
                <Image style={styles.image} source={{uri: sighting.picture}}></Image>
                    <Text style={styles.cardText}>{sighting.status.toUpperCase()}</Text>
                </Text>
                <Text style={styles.cardText}>{sighting.description}</Text>
                <Text style={styles.cardText}>Latitude: {sighting.location.latitude}, Longitude {sighting.location.longitude}</Text>
                <Text style={styles.cardText}>{new Date(sighting.dateTime).toLocaleDateString()}</Text>
                <Text style={styles.cardText}>{sighting.witnessName}</Text>
                <Text style={styles.cardText}>Contact: {sighting.witnessContact}</Text>
                </>
            ) : (
                <>
                <Text>No sighting available.</Text>
                </>
            )}
        </View>
    )
 // maybe add coords as a button feature that takes the user to that poi.
 // or transform coords to a city for readability
};

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
    card: {
        backgroundColor: "white",
        padding: 50,
        marginVertical: 50,
        marginHorizontal: 50,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      cardText: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "semibold",
        paddingVertical: 10
      },
      image: {
        width: 100,
        height: 100,
        resizeMode: "contain",
      }
});

export default Details;