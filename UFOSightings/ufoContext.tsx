import React, { createContext, useContext, useEffect, useState } from "react";
import { ISighting } from "./types";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const loadData = async () => {
      try {
        let result = await fetch(
          "https://sampleapis.assimilate.be/ufo/sightings"
        );
        if (!result.ok) {
          throw new Error("Failed to fetch data");
        }
        let json: ISighting[] = await result.json();
        setSightings(json);
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
    setSightings((prevSightings) => [...prevSightings, report]);
  };

  return (
    <UFOContext.Provider value={{ sightings, loading, addReport }}>
      {children}
    </UFOContext.Provider>
  );
};

export const useUFO = () => {
  const context = useContext(UFOContext);
  if (!context) {
    throw new Error("useUFO must be used within a UFOProvider");
  }
  return context;
};
