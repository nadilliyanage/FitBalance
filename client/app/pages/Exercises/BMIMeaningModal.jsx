// BMIMeaning.jsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const BMIMeaning = ({ isVisible, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>What is BMI?</Text>
          <Text style={styles.content}>
            Body Mass Index (BMI) is a measure of body fat based on your height and weight. It is calculated by taking your weight in kilograms and dividing it by your height in meters squared (kg/m²).
            {"\n\n"}BMI is used to categorize individuals into weight categories:
            {"\n"}- Normal weight: BMI 18.5 – 24.9
            {"\n"}- Overweight: BMI 25 – 29.9
            {"\n"}- Obesity: BMI ≥ 30
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "purple",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BMIMeaning;
