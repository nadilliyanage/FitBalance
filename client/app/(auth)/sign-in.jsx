import { View, Image, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField"; // Your custom form field component
import CustomButton from "../../components/CustomButton"; // Your custom button component
import { images } from "../../constants"; // Path to your images
import { Link, useRouter } from "expo-router";
import { auth } from "../../firebaseConfig"; // Import auth from firebaseConfig
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-toast-message";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (email === "" || password === "") {
      Toast.show({
        type: "error",
        text1: "All fields are required!",
        text2: "Please fill in all fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      router.replace("/home");
      Toast.show({
        type: "success",
        text1: "Signed in successfully!",
        text2: "Welcome Back to FitBalance360",
      });
    } catch (error) {
      // Check for specific error codes
      if (error.code === "auth/invalid-credential") {
        Toast.show({
          type: "error",
          text1: "Invalid Credential",
          text2: "The email or password is incorrect.",
        });
      } else if (error.code === "auth/invalid-email") {
        Toast.show({
          type: "error",
          text1: "Invalid Email",
          text2: "The email address is not valid.",
        });
      } else {
        // Optionally handle other errors (if necessary)
        console.error("SignIn Error:", error.message);
      }
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
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-10"
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
      <Toast />
    </SafeAreaView>
  );
};

export default SignIn;
