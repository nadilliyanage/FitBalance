import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const FoodLogScreen = ({ route }) => {
  const { foodLog } = route.params; // Get the food log from the route params

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Log</Text>
      <FlatList
        data={foodLog}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name} - {item.weight}g</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 18,
  },
});

export default FoodLogScreen;
