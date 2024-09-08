// import React from 'react';
// import { View, Text } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import { Dimensions } from 'react-native';

// export default function ProgressTrackerScreen() {
//   return (
//     <View className="p-4">
//       <Text className="text-xl font-bold mb-4">Disease Progress Tracker</Text>
//       <LineChart
//         data={{
//           labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20'],
//           datasets: [
//             {
//               data: [20, 45, 28, 80, 99],
//             },
//           ],
//         }}
//         width={Dimensions.get('window').width - 30} // from react-native
//         height={220}
//         yAxisLabel=""
//         chartConfig={{
//           backgroundColor: '#e26a00',
//           backgroundGradientFrom: '#fb8c00',
//           backgroundGradientTo: '#ffa726',
//           decimalPlaces: 2,
//           color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//           style: {
//             borderRadius: 16,
//           },
//         }}
//         style={{
//           marginVertical: 8,
//           borderRadius: 16,
//         }}
//       />
//     </View>
//   );
// }
