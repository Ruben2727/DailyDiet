import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';

import FoodDatabaseScreen from './FoodDatabaseScreen';
import HealthGoalsScreen from './HealthGoalsScreen';
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
        <Tab.Navigator>
          <Tab.Screen name="Health Goals" component={HealthGoalsScreen} />
          <Tab.Screen name="Food Database" component={FoodDatabaseScreen} />
          <Tab.Screen name="Meal Planning" component={MealPlanningScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </MealPlanContext.Provider>
  );
};

export default App;