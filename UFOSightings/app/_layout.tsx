import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { UFOProvider } from "../ufoContext";

export default function RootLayout() {
  return (
    <UFOProvider>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Map",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            title: "List",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="format-list-bulleted"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: "Report",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="layers-search"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </UFOProvider>
  );
}
