import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { MealPlanContext } from './MealPlanContext';

const MealPlanningScreen = ({ navigation }) => {
  const { mealPlan, setMealPlan } = useContext(MealPlanContext);

  const getTotalCaloriesOfDay = (day) => {
    const meals = mealPlan[day];
    let totalCalories = 0;
    Object.values(meals).forEach((mealList) => {
      mealList.forEach((meal) => {
        if (meal.food && meal.food.nf_calories) {
          totalCalories += meal.food.nf_calories * meal.quantity;
        }
      });
    });
    return totalCalories;
  };
  const getTotalCalories = (mealList) => {
    let totalCalories = 0;
    mealList.forEach((meal) => {
      if (meal.food && meal.food.nf_calories) {
        totalCalories += meal.food.nf_calories * meal.quantity;
      }
    });
    return totalCalories;
  };

  const isDayEmpty = (meals) => {
    return Object.values(meals).every((mealList) => mealList.length === 0);
  };

  const handleRemoveFromMealPlan = (day, mealType, index) => {
    const updatedMealPlan = { ...mealPlan };
    updatedMealPlan[day][mealType].splice(index, 1);
    setMealPlan(updatedMealPlan);
  };

  const handleAddFood = (day, mealType) => {
    navigation.navigate('Food Database', { selectedDay: day, selectedMeal: mealType });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.mealPlanContainer}>
          {Object.entries(mealPlan).map(([day, meals]) => (
            <View key={day} style={styles.dayContainer}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
              {isDayEmpty(meals) ? (
                <View style={styles.addButtonContainer}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddFood(day, 'Breakfast')}>
                    <Ionicons name="add" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {Object.entries(meals).map(([mealType, mealList]) => (
                    <View key={mealType} style={styles.mealContainer}>
                      <View style={styles.mealHeader}>
                        <Text style={styles.mealTypeText}>{mealType}</Text>
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => handleAddFood(day, mealType)}>
                          <Ionicons name="add" size={14} color="white" />
                        </TouchableOpacity>
                      </View>
                      {mealList.length > 0 ? (
                        mealList.map((meal, index) => (
                          <View key={index} style={styles.mealItem}>
                            <Text style={styles.mealText} numberOfLines={1}>
                              {meal.food.food_name} - {meal.quantity} servings
                            </Text>
                            <TouchableOpacity
                              style={styles.removeButton}
                              onPress={() => handleRemoveFromMealPlan(day, mealType, index)}>
                              <Ionicons name="close" size={14} color="white" />
                            </TouchableOpacity>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.emptyText}>No meals selected</Text>
                      )}
                      {mealList.length > 0 && (
                        <Text style={styles.totalCaloriesText}>
                          Total Calories: {getTotalCalories(mealList)}
                        </Text>
                      )}
                    </View>
                  ))}
                  <Text style={styles.totalCaloriesText}>
                    Total Calories of the Day: {getTotalCaloriesOfDay(day)}
                  </Text>
                </>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  mealPlanContainer: {
    paddingBottom: 16,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  mealContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mealTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealText: {
    fontSize: 14,
    maxWidth: '70%',
  },
  emptyText: {
    fontStyle: 'italic',
    color: 'gray',
  },
  totalCaloriesText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addMealText: {
    marginRight: 8,
    fontSize: 12,
  },
});

export default MealPlanningScreen;
