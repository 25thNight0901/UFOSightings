import React, {useEffect, useState} from "react";
import { ISighting} from "../../types";
import {View, Text, StyleSheet, Image, ScrollView} from "react-native";
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
        <ScrollView>
        <View style={styles.card}>
            {sighting? (
                <>
                <Text style={styles.header}>Sighting number: {sighting.id}</Text>
                <Image style={styles.image} source={{uri: sighting.picture}}></Image>
                <Text style={styles.cardText}>{sighting.description}</Text>
                { sighting.status == "confirmed"  ? 
                    <Text style={styles.cardTextConfirmed}><b>Status: </b>{sighting.status.charAt(0).toUpperCase() + sighting.status.slice(1, sighting.status.length)}</Text>
                : 
                    <Text style={styles.cardTextUnconfirmed}>{sighting.status.charAt(0).toUpperCase() + sighting.status.slice(1, sighting.status.length)}</Text>
                }
                <Text style={styles.cardText}><b>Latitude:</b> {sighting.location.latitude}</Text>
                <Text style={styles.cardText}><b>Longitude:</b> {sighting.location.longitude}</Text>
                <Text style={styles.cardText}><b>Date:</b> {new Date(sighting.dateTime).toLocaleDateString()}</Text>
                <Text style={styles.cardText}><b>Name:</b>{sighting.witnessName}</Text>
                <Text style={styles.cardText}><b>Contact: </b>{sighting.witnessContact}</Text>
                </>
            ) : (
                <>
                <Text>No sighting available.</Text>
                </>
            )}
        </View>
        </ScrollView>
    )
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
        shadowRadius: 4
      },
      cardTextConfirmed: {
        fontSize: 20,
        fontWeight: "semibold",
        paddingVertical: 10,
        color: "green"
      },
      cardTextUnconfirmed: {
        fontSize: 20,
        fontWeight: "semibold",
        paddingVertical: 10,
        color: "red"
      },
      cardText: {
        fontSize: 20,
        fontWeight: "semibold",
        paddingVertical: 10,
      },
      image: {
        width: 300,
        height: 300,
        resizeMode: "contain",
        alignSelf: "center"
      }
});

export default Details;