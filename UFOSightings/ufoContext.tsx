import React, { createContext, useContext, useEffect, useState } from "react";
import { ISighting } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";



interface UFOContextType {
  sightings: ISighting[];
  loading: boolean;
  addReport: (report: ISighting) => void;
}

const UFOContext = createContext<UFOContextType | undefined>(undefined);

export const UFOProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sightings, setSightings] = useState<ISighting[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadData = async () => {
      setLoading(true);
      try {
        const storedData = await AsyncStorage.getItem("sightings");
        let localSightings: ISighting[] = storedData ? JSON.parse(storedData) : [];

        let result = await fetch("https://sampleapis.assimilate.be/ufo/sightings"/*, { signal} */);
        if (!result.ok) {
          throw new Error("Failed to fetch data.");
        }
        let newSightings: ISighting[] = await result.json();
        
        let mergedSightings = mergeData(localSightings, newSightings);

        await AsyncStorage.setItem("sightings", JSON.stringify(mergedSightings));

        setSightings(mergedSightings);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, []);

  const addReport = (report: ISighting) => {
    try{
      setSightings((prevSightings) => {
        const updatedSightings = [...prevSightings, report];

        AsyncStorage.setItem("sightings", JSON.stringify(updatedSightings)).catch(console.error);

        return updatedSightings;
      });
    } catch (error){
      console.error("Failed to save new report:", error);
    }
  };

  return (
    <UFOContext.Provider value={{ sightings, loading, addReport }}>
      {children}
    </UFOContext.Provider>
  );
};

function mergeData(localData: ISighting[], newData: ISighting[]): ISighting[] {
  let localDataMap = new Map(localData.map((item) => [item.id, item])); //TODO understand what the key list is exactly
  let newDataMap = new Map(newData.map((item) => [item.id, item]));

  newDataMap.forEach((newItem, id) => {
    if (!localDataMap.has(id) || isDifferent(newItem, localDataMap.get(id)!)) {
      localDataMap.set(id, newItem);
    }
  });

  return Array.from(localDataMap.values());
}

function isDifferent(obj1: ISighting, obj2: ISighting): boolean {
  return JSON.stringify(obj1) !== JSON.stringify(obj2);
}

export const useUFO = () => {
  const context = useContext(UFOContext);
  if (!context) {
    throw new Error("useUFO must be used within a UFOProvider");
  }
  return context;
};
