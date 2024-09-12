import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HealthData = ({ navigation }) => {
  const [hemoglobinRange, setHemoglobinRange] = useState('');
  const [bloodSugarRange, setBloodSugarRange] = useState('');
  const [totalCholesterolRange, setTotalCholesterolRange] = useState('');
  const [hdlRange, setHdlRange] = useState('');
  const [ldlRange, setLdlRange] = useState('');
  const [triglyceridesRange, setTriglyceridesRange] = useState('');

  const handleSubmit = () => {
    // Handle submission logic, validation, and navigation
    navigation.navigate('ResultsPage', {
      hemoglobinRange,
      bloodSugarRange,
      totalCholesterolRange,
      hdlRange,
      ldlRange,
      triglyceridesRange
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Health Data</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hemoglobin Level (g/dL)</Text>
        <Picker
          selectedValue={hemoglobinRange}
          style={styles.picker}
          onValueChange={(itemValue) => setHemoglobinRange(itemValue)}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="12-16 g/dL" value="12-16" />
          <Picker.Item label="Below 12 g/dL" value="below-12" />
          <Picker.Item label="Above 16 g/dL" value="above-16" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fasting Blood Sugar Level (mg/dL)</Text>
        <Picker
          selectedValue={bloodSugarRange}
          style={styles.picker}
          onValueChange={(itemValue) => setBloodSugarRange(itemValue)}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="70-99 mg/dL" value="70-99" />
          <Picker.Item label="100-125 mg/dL" value="100-125" />
          <Picker.Item label="Above 125 mg/dL" value="above-125" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Total Cholesterol (mg/dL)</Text>
        <Picker
          selectedValue={totalCholesterolRange}
          style={styles.picker}
          onValueChange={(itemValue) => setTotalCholesterolRange(itemValue)}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="Less than 200 mg/dL" value="less-200" />
          <Picker.Item label="200-239 mg/dL" value="200-239" />
          <Picker.Item label="240 mg/dL and above" value="240+" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>HDL (Good) Cholesterol (mg/dL)</Text>
        <Picker
          selectedValue={hdlRange}
          style={styles.picker}
          onValueChange={(itemValue) => setHdlRange(itemValue)}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="40-60 mg/dL" value="40-60" />
          <Picker.Item label="Above 60 mg/dL" value="above-60" />
          <Picker.Item label="Below 40 mg/dL" value="below-40" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>LDL (Bad) Cholesterol (mg/dL)</Text>
        <Picker
          selectedValue={ldlRange}
          style={styles.picker}
          onValueChange={(itemValue) => setLdlRange(itemValue)}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="Less than 100 mg/dL" value="less-100" />
          <Picker.Item label="100-129 mg/dL" value="100-129" />
          <Picker.Item label="Above 129 mg/dL" value="above-129" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Triglycerides Level (mg/dL)</Text>
        <Picker
          selectedValue={triglyceridesRange}
          style={styles.picker}
          onValueChange={(itemValue) => setTriglyceridesRange(itemValue)}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="Less than 150 mg/dL" value="less-150" />
          <Picker.Item label="150-199 mg/dL" value="150-199" />
          <Picker.Item label="200 mg/dL and above" value="200+" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Health Data</Text>
        <Icon name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    marginRight: 8,
  },
});

export default HealthData;
