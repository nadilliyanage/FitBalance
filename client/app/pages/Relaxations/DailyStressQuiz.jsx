import React, { useState, lazy, Suspense } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Svg, Circle } from "react-native-svg"; 

const LazyRelaxations = lazy(() => import("../../(tabs)/Relaxations"));
const LazyRecommendations = lazy(() => import("./Recommendations"));

const questions = [
  "1. Did you feel overwhelmed by your tasks today?",
  "2. Did you have trouble concentrating today?",
  "3. Did you experience any physical symptoms like headaches or stomach discomfort today?",
  "4. Did you find yourself getting easily irritated or frustrated today?",
  "5. Did you feel tense or anxious at any point today?",
  "6. Did you have difficulty relaxing after your day ended?",
  "7. Did you withdraw from any social activities today because of stress?",
  "8. Did you have any trouble sleeping last night due to stress?",
  "9. Did you feel like you had too much on your plate today?",
  "10. Did you feel like you were losing control of things today?",
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "A little", value: 1 },
  { label: "Somewhat", value: 2 },
  { label: "Quite a bit", value: 3 },
  { label: "Extremely", value: 4 },
];

const DailyStressQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [back, setBack] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleAnswer = (value) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      calculateStressLevel();
    }
  };

  const calculateStressLevel = async () => {
    const totalScore = answers.reduce((acc, curr) => acc + (curr || 0), 0);
    const maxScore = questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    let stressLevel = "Low Stress";

    if (totalScore >= 31) {
      stressLevel = "High Stress";
    } else if (totalScore >= 21) {
      stressLevel = "Moderate Stress";
    } else if (totalScore >= 11) {
      stressLevel = "Mid Stress";
    }

    const newResult = {
      score: totalScore,
      level: stressLevel,
      progress: percentage / 100,
    };

    setResult(newResult);

    // Save stress rate to AsyncStorage
    await AsyncStorage.setItem(
      "stressRate",
      JSON.stringify({ level: newResult.level, progress: newResult.progress })
    );
  };

  const getProgressColor = (level) => {
    switch (level) {
      case "High Stress":
        return "red";
      case "Moderate Stress":
        return "orange";
      case "Mid Stress":
        return "yellow";
      case "Low Stress":
        return "green";
      default:
        return "gray";
    }
  };

  const ArcProgressBar = ({ progress, level }) => {
    const strokeWidth = 20;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - circumference * progress;

    return (
      <View
        style={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg height="160" width="160">
          <Circle
            cx="80"
            cy="80"
            r={radius}
            stroke="white"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx="40"
            cy="80"
            r={radius}
            stroke={getProgressColor(level)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            rotation="-90"
            origin="60, 60"
          />
        </Svg>
        {/* Text in the center of the circle */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 40,
              fontWeight: "bold",
              color: getProgressColor(level),
            }}
          >
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>
    );
  };

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyRelaxations />
      </Suspense>
    );
  }

  if (showRecommendations) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyRecommendations stressLevel={result?.level} />
      </Suspense>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <View className="flex-1 p-4 justify-center">
            {!result ? (
              <View className="flex-1 justify-center">
                <TouchableOpacity
                  className="absolute top-10 "
                  onPress={() => setBack(true)}
                >
                  <Text className="text-lg font-bold text-purple-500 p-2">
                    <Ionicons name="arrow-back-circle-outline" size={34} />
                  </Text>
                </TouchableOpacity>
                <Text className="text-xl text-center mb-5 font-bold">
                  {questions[currentQuestionIndex]}
                </Text>
                <View className="flex-col items-stretch">
                  {options.map((option, i) => (
                    <TouchableOpacity
                      key={i}
                      className={`w-full p-3 mb-2 border rounded ${
                        selectedAnswer === option.value
                          ? "bg-purple-500"
                          : "border-gray-300"
                      }`}
                      onPress={() => handleAnswer(option.value)}
                    >
                      <Text
                        className={`text-lg text-center ${
                          selectedAnswer === option.value
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {selectedAnswer !== null && (
                    <TouchableOpacity
                      className="w-full p-3 mt-4 bg-purple-500 rounded"
                      onPress={handleNext}
                    >
                      <Text className="text-lg text-white text-center">
                        Next
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              <View className="flex-1 justify-center mt-5 p-4 rounded-lg w-fit items-center">
                <View className="bg-secondary-100 px-16 py-8 rounded-lg">
                  <Text className="text-2xl font-bold text-center mb-8 text-white">
                    Stress Rate
                  </Text>
                  <ArcProgressBar
                    progress={result.progress}
                    level={result.level}
                  />
                  <Text className="text-lg font-semibold text-center mt-4 text-white ">
                    Today is
                  </Text>
                  <Text className="text-lg font-semibold text-center text-white">
                    "{result.level}" Day.
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-full mt-10 p-2 bg-purple-500 rounded-lg"
                  onPress={() => setShowRecommendations(true)}
                >
                  <Text className="text-center text-white text-lg font-bold">
                    Recommendations
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-full mt-2 p-2 bg-purple-500 rounded-lg"
                  onPress={() => {
                    setAnswers(Array(questions.length).fill(null));
                    setCurrentQuestionIndex(0);
                    setResult(null);
                  }}
                >
                  <Text className="text-center text-white text-lg font-bold">
                    Restart Quiz
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-full mt-2 p-2 bg-purple-500 rounded-lg"
                  onPress={() => setBack(true)}
                >
                  <Text className="text-center text-white text-lg font-bold">
                    Back to Relaxations
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DailyStressQuiz;
