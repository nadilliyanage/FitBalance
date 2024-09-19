import React, { useCallback } from "react";
import { View, Image, Text, BackHandler } from "react-native";
import { Tabs, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // Import this
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2 ">
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
        // Get the current route
        const currentRoute =
          navigation.getState().routes[navigation.getState().index].name;

        if (currentRoute !== "home") {
          // Navigate to the "home" tab if not already on it
          navigation.navigate("home");
          return true; // Prevent the default back button behavior
        }
        // Exit the app if already on the home tab (you can customize this logic)
        return false; // Let the default back button behavior (exit app)
      };

      // Add the event listener
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Cleanup the event listener when the component unmounts
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation])
  );

  return (
    <>
      <Tabs
        initialRouteName="home" // Set the initial route to home
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#800080",
          tabBarInactiveTintColor: "#FFFFFF",
          tabBarStyle: {
            backgroundColor: "#8B6AE7",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 80,
          },
        }}
      >
        <Tabs.Screen
          name="Exercises"
          options={{
            title: "Exercises",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.exercises}
                color={color}
                name="Exercises"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Relaxations"
          options={{
            title: "Relaxations",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.relaxations}
                color={color}
                name="Relaxations"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="Nutrition"
          options={{
            title: "Nutrition",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.nutrition}
                color={color}
                name="Nutrition"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="tips"
          options={{
            title: "Tips",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.tips}
                color={color}
                name="Tips"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
