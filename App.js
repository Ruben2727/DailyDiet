import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import FoodDatabaseScreen from './FoodDatabaseScreen';
import HealthGoalsScreen from './HealthGoalsScreen';
import MealPlanningScreen from './MealPlanningScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Health Goals" component={HealthGoalsScreen} />
        <Tab.Screen name="Food Database" component={FoodDatabaseScreen} />
        <Tab.Screen name="Meal Planning" component={MealPlanningScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default App;
