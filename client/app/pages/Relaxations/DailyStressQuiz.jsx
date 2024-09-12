import React, { useState, lazy, Suspense } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import * as Progress from "react-native-progress";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton";

const LazyRelaxations = lazy(() => import("../../(tabs)/Relaxations"));

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

  const calculateStressLevel = () => {
    const totalScore = answers.reduce((acc, curr) => acc + (curr || 0), 0);
    const maxScore = questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    let stressLevel = "Low Stress Day";

    if (totalScore >= 31) {
      stressLevel = "High Stress Day";
    } else if (totalScore >= 21) {
      stressLevel = "Moderate Stress Day";
    } else if (totalScore >= 11) {
      stressLevel = "Mild Stress Day";
    }

    setResult({
      score: totalScore,
      level: stressLevel,
      progress: percentage / 100,
    });
  };

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyRelaxations />
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
                  className="absolute top-10 left-4 z-10 p-2"
                  onPress={() => setBack(true)}
                >
                  <Text className="text-lg font-bold text-purple-500">
                    Back to Relaxation
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
              <View className="flex-1 justify-center mt-5 p-4 rounded-lg bg-gray-100 items-center">
                <Text className="text-lg font-bold text-center mb-4">
                  Stress Rate: {Math.round(result.progress * 100)}%
                </Text>
                <Progress.Bar
                  progress={result.progress}
                  width={200}
                  height={20}
                  color="#6B46C1" // Purple color for progress bar
                  borderRadius={10}
                  unfilledColor="#E2E8F0" // Light gray color for unfilled part
                />
                <Text className="text-xl font-bold text-center mt-4">
                  This is classified as a
                </Text>
                <Text className="text-xl font-bold text-center mt-4">
                  "{result.level}".
                </Text>
                <CustomButton
                  title="Restart Quiz"
                  containerStyles="w-full mt-7"
                  handlePress={() => {
                    setAnswers(Array(questions.length).fill(null));
                    setCurrentQuestionIndex(0);
                    setResult(null);
                  }}
                ></CustomButton>
                <CustomButton
                  title="Back to Relaxations"
                  handlePress={() => setBack(true)}
                  containerStyles="w-full mt-7"
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DailyStressQuiz;
