import { View, Image, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField"; // Your custom form field component
import CustomButton from "../../components/CustomButton"; // Your custom button component
import { images } from "../../constants"; // Path to your images
import { Link, useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig"; // Import auth and Firestore (db) from firebaseConfig
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; // Firestore methods
import Toast from "react-native-toast-message";

const SignUp = () => {
  const router = useRouter();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const create = async () => {
    // Basic input validation
    if (!username || !email || !password) {
      Toast.show({
        type: "error",
        text1: "All fields are required!",
        text2: "Please fill in all fields",
      });
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Add user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
      });

      Toast.show({
        type: "success",
        text1: "Account created successfully!",
        text2: "Welcome to FitBalance360",
      });

      console.log("User created and details saved to Firestore");

      // Navigate to the Sign In page after successful account creation
      router.push("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error creating account",
        text2: error.message,
      });
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4">
          <View className="items-center">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[200px] h-[200px]"
            />
          </View>
          <Text className="text-3xl text-black mt-1 font-psemibold">
            Sign Up
          </Text>

          <FormField
            title="Your Name"
            value={username}
            handleChangeText={setName}
            otherStyles="mt-7"
          />

          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={password}
            handleChangeText={setPassword}
            otherStyles="mt-7"
            secureTextEntry
          />

          <CustomButton
            title="Sign Up"
            handlePress={create}
            containerStyles="mt-7"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-gray-500 font-pregular">
              Have an account?
            </Text>
            <Link href="/sign-in" className="font-semibold text-secondary">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default SignUp;
