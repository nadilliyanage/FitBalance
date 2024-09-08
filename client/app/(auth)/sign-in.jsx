import { View, Image, Text, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";

axios.defaults.baseURL = API_BASE_URL;

const SignIn = () => {
  const [state, setState] = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all the fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (data.success) {
        const user = data.user;
        const token = data.token;

        setState({ user, token });
        await AsyncStorage.setItem("@auth", JSON.stringify({ user, token }));

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Signed in successfully",
        });
        router.replace("/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.message || "An error occurred",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Something went wrong",
      });
      console.error("SignIn Error:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <View className="items-center">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[200px] h-[200px]"
            />
          </View>
          <Text className="text-3xl text-black mt-5 font-psemibold">
            Log in
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-10"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-gray-500 font-normal">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="font text-secondary">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
