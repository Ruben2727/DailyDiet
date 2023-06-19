import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

const MealPlanContext = createContext();

const MealPlanProvider = ({ children }) => {
    const [mealPlan, setMealPlan] = useState({});

    useEffect(() => {
        AsyncStorage.getItem('mealPlan')
            .then((storedMealPlan) => {
                if (storedMealPlan) {
                    setMealPlan(JSON.parse(storedMealPlan));
                }
            })
            .catch((error) => {
                console.error('Error retrieving meal plan:', error);
            });
    }, []);

    const updateMealPlan = (newMealPlan) => {
        AsyncStorage.setItem('mealPlan', JSON.stringify(newMealPlan))
            .then(() => {
                setMealPlan(newMealPlan);
            })
            .catch((error) => {
                console.error('Error saving meal plan:', error);
            });
    };

    return (
        <MealPlanContext.Provider value={{ mealPlan, updateMealPlan }}>
            {children}
        </MealPlanContext.Provider>
    );
};

export { MealPlanContext, MealPlanProvider };