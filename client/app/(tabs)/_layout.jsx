import React, { useCallback } from "react";
import { View, Image, Text, BackHandler } from "react-native";
import { Tabs, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2 w-20">
      <Image
        source={icon}
        resizeMode="contain"
        style={{ tintColor: color }}
        className="w-5 h-5"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        const currentRoute =
          navigation.getState().routes[navigation.getState().index].name;

        if (currentRoute !== "home") {
          navigation.navigate("home");
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation])
  );

  return (
    <>
      <Tabs
        initialRouteName="home"
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#7F00FF",
          tabBarInactiveTintColor: "#FFFFFF",
          tabBarStyle: {
            backgroundColor: "#8B6AE7",
            borderTopWidth: 1,
            height: 80,
          },
          tabBarIconStyle: {
            borderRadius: route.name === "home" ? 20 : 0, // Conditional rounded corners for home
          },
          tabBarIcon: ({ color, focused }) => {
            let icon;
            let name;

            switch (route.name) {
              case "Exercises":
                icon = icons.exercises;
                name = "Exercises";
                break;
              case "Relaxations":
                icon = icons.relaxations;
                name = "Relax";
                break;
              case "home":
                icon = icons.home;
                name = "Home";
                break;
              case "Nutrition":
                icon = icons.nutrition;
                name = "Nutrition";
                break;
              case "tips":
                icon = icons.tips;
                name = "Tips";
                break;
              default:
                icon = icons.home;
                name = "Home";
            }

            return (
              <View
                className={`${
                  focused ? "bg-white rounded-lg p-2" : ""
                } items-center justify-center gap-2`}
              >
                <TabIcon
                  icon={icon}
                  color={color}
                  name={name}
                  focused={focused}
                />
              </View>
            );
          },
        })}
      >
        <Tabs.Screen
          name="Exercises"
          options={{
            title: "Exercises",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="Relaxations"
          options={{
            title: "Relaxations",
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="Nutrition"
          options={{
            title: "Nutrition",
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="tips"
          options={{
            title: "Tips",
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
