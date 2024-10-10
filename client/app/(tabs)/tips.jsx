import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import TipsForm from '../pages/Tips/TipsForm';

const Tips = () => {
  const [tipsForm, setTipsForm] = useState(false);
  const [seeMore,setSeeMore] = useState(false);

  if (tipsForm) {
    return <TipsForm />;
  }

  return (
    <View className="p-4 font-pbold bg-white flex-1">
      <Text className="text-4xl font-pbold text-center mb-4 text-black mt-16">
        Health Articles and Tips
      </Text>
      <Text className="text-xl font-psemibold text-left mb-6 text-black mt-10">
        Common Health Tips
      </Text>
      <ScrollView className="mb-4">
        <View className="mb-4 bg-purple-100 p-4 rounded-xl">
          <Text className="text-base mb-2 text-black font-pregular">• Stay hydrated</Text>
          <Text className="text-base mb-2 text-black font-pregular">
            • Eat a balanced diet
          </Text>
          <Text className="text-base mb-2 text-black font-pregular">
            • Exercise regularly
          </Text>
          <Text className="text-base mb-2 text-black font-pregular">• Get enough sleep</Text>
          <Text className="text-base mb-2 text-black font-pregular">• Manage stress</Text>
          <Text className="text-base mb-2 text-black font-pregular">
            • Avoid smoking and limit alcohol
          </Text>
          <Text className="text-base mb-2 text-black font-pregular">
            • Regular health checkups
          </Text>
          <Text className="text-base mb-2 text-black font-pregular">
            • Maintain healthy weight
          </Text>
          <Text className="text-base mb-2 text-black font-pregular">
            • Stay mentally active
          </Text>
          {!seeMore && (
            <TouchableOpacity onPress={() => setSeeMore(true)}>
              <Text className="text-blue-500 font-psemibold">See More</Text>
            </TouchableOpacity>
          )}

          {seeMore && (
            <>
              <Text className="text-base mb-2 text-black font-pregular">
                • Limit sugar intake
              </Text>
              <Text className="text-base mb-2 text-black font-pregular">
                • Practice mindfulness
              </Text>
              <Text className="text-base mb-2 text-black font-pregular">
                • Get regular sun exposure
              </Text>
              <Text className="text-base mb-2 text-black font-pregular">
                • Stay socially connected
              </Text>
              <TouchableOpacity onPress={() => setSeeMore(false)}>
                <Text className="text-blue-500 font-psemibold">Show Less</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="bg-secondary-300 p-4 rounded-lg"
        onPress={() => setTipsForm(true)}
      >
        <Text className="text-center text-white font-psemibold">
          Start for Specific Tips
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Tips;
