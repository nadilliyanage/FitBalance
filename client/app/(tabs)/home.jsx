import { View, Image, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useContext } from "react";
import { icons } from "../../constants";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import { AuthContext } from "../../context/authContext";

const Home = () => {
  //global state
  const [state] = useContext(AuthContext);

  const router = useRouter();

  const handleProfileNavigation = () => {
    router.push("../profile");
  };

  return (
    <SafeAreaView className="bg-secondary-100 rounded-b-3xl">
      <View className="my-6 px-4 space-y-6">
        <View className="justify-between items-start flex-row mb-6">
          <TouchableOpacity
            onPress={handleProfileNavigation}
            className="bg-primary rounded-full p-2 absolute right-4"
          >
            <Image
              source={icons.profile}
              resizeMode="contain"
              style={{ width: 24, height: 24, tintColor: "purple" }}
            />
          </TouchableOpacity>
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Welcome Back
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              {state?.user?.name || "Guest"}
            </Text>
          </View>
        </View>
        <SearchInput />
      </View>

      <FlatList
        className="bg-black-200"
        data={[{ id: 1 }]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text className="text-3xl">{item.id}</Text>}
        ListHeaderComponent={() => <View></View>}
      />
    </SafeAreaView>
  );
};

export default Home;
