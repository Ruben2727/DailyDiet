import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import FoodDatabaseScreen from './FoodDatabaseScreen';
import HealthGoalsScreen from './HealthGoalsScreen';
import HomeScreen from './HomeScreen';
import { MealPlanContext } from './MealPlanContext';
import MealPlanningScreen from './MealPlanningScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const [mealPlan, setMealPlan] = useState({
    Monday: { Breakfast: [], Lunch: [], Dinner: [], Snack: [] },
    Tuesday: { Breakfast: [], Lunch: [], Dinner: [], Snack: [] },
    Wednesday: { Breakfast: [], Lunch: [], Dinner: [], Snack: [] },
    Thursday: { Breakfast: [], Lunch: [], Dinner: [], Snack: [] },
    Friday: { Breakfast: [], Lunch: [], Dinner: [], Snack: [] },
    Saturday: { Breakfast: [], Lunch: [], Dinner: [], Snack: [] },
    Sunday: { Breakfast: [], Lunch: [], Dinner: [], Snack: [] },
  });

  return (
    <MealPlanContext.Provider value={{ mealPlan, setMealPlan }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Health Goals') {
                iconName = focused ? 'ios-heart' : 'ios-heart-outline';
              } else if (route.name === 'Food Database') {
                iconName = focused ? 'ios-restaurant' : 'ios-restaurant-outline';
              } else if (route.name === 'Meal Planning') {
                iconName = focused ? 'ios-calendar' : 'ios-calendar-outline';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#28a745',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              display: 'flex',
            },
          })}>
          <Tab.Screen name="Health Goals" component={HealthGoalsScreen} />
          <Tab.Screen name="Food Database" component={FoodDatabaseScreen} />
          <Tab.Screen name="Meal Planning" component={MealPlanningScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </MealPlanContext.Provider>
  );
};

export default App;
