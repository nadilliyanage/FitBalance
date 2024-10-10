import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
  } from "react-native";
  import React, { useState, Suspense, lazy } from "react";
  import { FontAwesome5 } from "@expo/vector-icons";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { BlurView } from "expo-blur";
  
  const LazyNutrition = lazy(() => import("../../(tabs)/Nutrition"));
  
  const HealthyFoodSuggestions = () => {
    const [back, setBack] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
  
    const handleCategoryPress = (category) => {
      setSelectedCategory(category);
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
      setSelectedCategory(null);
    };
  
    const categories = {
      FruitsAndVegetables: [
        "Leafy Greens:  Spinach, Kale, Swiss chard, Collard greens",
        "Berries:  Blueberries, Strawberries, Raspberries, Blackberries",
        "Citrus Fruits:  Oranges, Grapefruits, Lemons",
        "Cruciferous Vegetables:  Broccoli, Cauliflower, Brussels sprouts",
        "Root Vegetables:  Carrots, Sweet Potatoes, Beets",
      ],
      WholeGrains: [
        "Quinoa:  High in protein and gluten-free.",
        "Oats:  Rich in fiber, helps reduce cholesterol levels.",
        "Brown Rice:  Packed with fiber, vitamins, and minerals.",
        "Barley:  Good for heart health and digestion.",
      ],
      HealthyFats: [
        "Avocados:  Packed with monounsaturated fats and fiber.",
        "Nuts and Seeds:  Almonds, Walnuts, Flaxseeds, Chia Seeds.",
        "Olive Oil:  Rich in monounsaturated fats and antioxidants.",
        "Fatty Fish:  Salmon, Mackerel, Sardines, Tuna.",
      ],
      ProteinSources: [
        "Legumes:  Lentils, Chickpeas, Black Beans.",
        "Eggs:  A high-quality protein source.",
        "Tofu and Tempeh:  Rich in protein, calcium, and iron.",
        "Lean Poultry:  Skinless chicken and turkey.",
      ],
      DairyAlternatives: [
        "Greek Yogurt:  Higher in protein, rich in probiotics.",
        "Low-fat Milk:  A good source of calcium and protein.",
        "Plant-Based Milk:  Almond, Soy, and Oat milk.",
      ],
    };
  
    if (back) {
      return (
        <Suspense fallback={<Text>Loading...</Text>}>
          <LazyNutrition />
        </Suspense>
      );
    }
  
    return (
      <SafeAreaView className="bg-gray-50 flex-1 pt-4 px-4"
      >
        <View className="flex-row items-center justify-center mb-5">
          <TouchableOpacity
            style={{ position: "absolute", left: 10 }}
            onPress={() => setBack(true)}
          >
            <FontAwesome5 name="arrow-left" size={20} color="purple" />
          </TouchableOpacity>
          
        </View>
  
  
          <View className="bg-secondary-300 p-5 rounded-lg mb-16 mt-5">
            <Text className="text-white text-2xl font-bold text-center">
              Healthy Food Suggestions
            </Text>
            <Text className="text-white text-2xl font-bold text-center">
              for a Healthy Life
            </Text>
          </View>
  
          {/* Main Food Categories Section */}
          <View className="mb-5">
            
            {Object.keys(categories).map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategoryPress(category)}
                className="flex-row justify-between items-center  bg-white shadow-xl shadow-black p-6 rounded-lg mb-4"
              >
                <Text className="font-bold text-xl text-secondary-300">
                  {category.replace(/([A-Z])/g, ' $1')}
                </Text>
                <FontAwesome5 name="chevron-right" size={20} color="purple" />
              </TouchableOpacity>
            ))}
          </View>
  
          {/* Modal for Subcategories */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          ><BlurView
          intensity={180} // Adjust the intensity of the blur
          style={{ flex: 1 }} // Make sure it covers the entire modal
        >
            <View className="flex-1 justify-center items-center bg-black/40">
              <View className="bg-white rounded-lg p-5 w-80">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-3xl text-secondary-300">Subcategories</Text>
                  {/* Close Icon */}
                  <TouchableOpacity onPress={closeModal}>
                    <FontAwesome5 name="times" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                {selectedCategory &&
                  categories[selectedCategory].map((item, index) => (
                    <Text key={index} className="font-semibold text-lg text-black-100 mb-3">
                      {item}
                    </Text>
                  ))}
              </View>
            </View>
            </BlurView>
          </Modal>
        
      
      </SafeAreaView>
    );
  };
  
  export default HealthyFoodSuggestions;
  