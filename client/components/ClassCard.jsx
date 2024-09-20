import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

const ClassCard = ({
  Name,
  instructor,
  description,
  level,
  duration,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        borderRadius: 10,
        marginBottom: 40,
        overflow: "hidden",
        elevation: 5,
      }}
      onPress={onPress}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={image}
          style={{
            width: "100%",
            height: 160,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            backgroundColor: "white",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}
        >
          <Text style={{ color: "#8B6AE7", fontWeight: "bold" }}>{level}</Text>
        </View>
      </View>
      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937" }}>
            {Name}
          </Text>
          <Text style={{ color: "#6B7280", fontWeight: "600" }}>
            Instructor: {instructor}
          </Text>
        </View>
        <Text style={{ color: "#374151", marginTop: 8 }}>{description}</Text>
        <Text style={{ color: "#6B7280", marginTop: 8 }}>
          Duration: {duration}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

ClassCard.propTypes = {
  Name: PropTypes.string.isRequired,
  instructor: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  image: PropTypes.any.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ClassCard;
