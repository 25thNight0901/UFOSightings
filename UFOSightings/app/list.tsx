import React, {useEffect, useState} from "react";
import { ISighting} from "../types";
import {View, Button, Text, ActivityIndicator, FlatList} from "react-native";
import Constants from "expo-constants";

const List = () => {
    const [results, setResults] = useState<ISighting[]>([]);

    useEffect(()=>{
       const loadData = async() => {
        let result = await fetch("https://sampleapis.assimilate.be/ufo/sightings");
        let json : ISighting[] = await result.json();

        setResults(json);
        }
        loadData();
    },[]);
    
    return (
        <View style={{flexDirection: "column", flex: 1, paddingTop: Constants.statusBarHeight}}>
            <FlatList
                data={results}
                renderItem={({item}) => <PersonComponent item={item}/>}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    )

};


const PersonComponent = ({item} : {item: ISighting}) => {
    return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={{flex: 1}}>{item.id}</Text>
        </View>
    )
}

export default List;
