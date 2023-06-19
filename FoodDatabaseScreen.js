import { Picker } from '@react-native-picker/picker';
import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';

import { MealPlanContext } from './MealPlanContext';

function FoodDatabaseScreen() {
  const { mealPlan, setMealPlan } = useContext(MealPlanContext);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [searchQuery, setSearchQuery] = useState('');
  const [foodDataList, setFoodDataList] = useState([]);
  const [selectedFoodData, setSelectedFoodData] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [quantity, setQuantity] = useState('');
  const quantityInputRef = useRef(null);

  const handleSearch = () => {
    const endpoint = 'https://trackapi.nutritionix.com/v2/search/instant';
    const appId = '73692cb5';
    const appKey = '675436548ed44b83cf6af4a1bfe51486';

    fetch(`${endpoint}?query=${searchQuery}`, {
      headers: {
        'x-app-id': appId,
        'x-app-key': appKey,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then((data) => {
        if (data && data.branded && data.branded.length > 0) {
          setFoodDataList(data.branded);
        } else if (data && data.common && data.common.length > 0) {
          setFoodDataList(setFoodDataList.concat(data.common));
          console.log(data.common);
        } else if (data && data.self && data.self.length > 0) {
          setFoodDataList(setFoodDataList.concat(data.self));
          console.log(data.self);
        } else {
          setFoodDataList([]);
          setError('Food not found in the database.');
        }
      })
      .catch((error) => {
        console.error(error);
        setFoodDataList([]);
        setError('An error occurred. Please try again later.');
      });
  };

  const handleAddToMealPlan = () => {
    if (selectedFoodData) {
      const updatedMealPlan = { ...mealPlan };
      updatedMealPlan[selectedDay][selectedMeal].push({
        food: selectedFoodData,
        quantity: parseFloat(quantity),
      });
      setMealPlan(updatedMealPlan);
      setSelectedMeal('Breakfast');
      setQuantity('');
      setSelectedFoodData(null);
      setShowModal(false);
    }
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter food name"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {foodDataList.length > 0 && (
          <ScrollView style={styles.scrollView}>
            <View style={styles.foodDataContainer}>
              <Text style={styles.resultsText}>Search Results:</Text>
              {foodDataList.map((foodData) => (
                <TouchableOpacity
                  key={foodData.food_name}
                  style={styles.foodItem}
                  onPress={() => setSelectedFoodData(foodData)}>
                  <Text style={styles.foodName}>{foodData.food_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
        {selectedFoodData != null && (
          <View style={styles.selectedFoodContainer}>
            <Text style={styles.selectedFoodText}>Selected Food:</Text>
            <Text style={styles.selectedFoodName}>{selectedFoodData.food_name}</Text>
            <Text style={styles.selectedFoodCalories}>
              Calories: {Math.round(selectedFoodData.nf_calories)}
            </Text>
            <Text style={styles.selectedFoodQuantity}>
              Serving quantity: {selectedFoodData.serving_qty} {selectedFoodData.serving_unit}
            </Text>
            {selectedFoodData.photo && selectedFoodData.photo.thumb && (
              <Image
                source={{ uri: selectedFoodData.photo.thumb }}
                style={styles.selectedFoodImage}
              />
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.addToMealButton}
          onPress={() => setShowModal(true)}
          disabled={!selectedFoodData}>
          <Text style={styles.addToMealButtonText}>Add to Meal Plan</Text>
        </TouchableOpacity>

        <Modal visible={showModal} animationType="slide">
          <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add to Meal Plan</Text>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Serving:</Text>

                <TextInput
                  ref={quantityInputRef}
                  style={styles.modalInput}
                  placeholder="Enter quantity"
                  placeholderTextColor="#ccc"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
                {selectedFoodData != null && (
                  <Text style={styles.modalQuantity}>
                    Serving = {selectedFoodData.serving_qty * quantity}{' '}
                    {selectedFoodData.serving_unit}
                  </Text>
                )}
                <Text style={styles.modalLabel}>Meal:</Text>
                <Picker
                  selectedValue={selectedMeal}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedMeal(itemValue)}>
                  <Picker.Item label="Breakfast" value="Breakfast" />
                  <Picker.Item label="Lunch" value="Lunch" />
                  <Picker.Item label="Dinner" value="Dinner" />
                  <Picker.Item label="Snack" value="Snack" />
                </Picker>
                <Text style={styles.modalLabel}>Day:</Text>
                <Picker
                  selectedValue={selectedDay}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedDay(itemValue)}>
                  <Picker.Item label="Monday" value="Monday" />
                  <Picker.Item label="Tuesday" value="Tuesday" />
                  <Picker.Item label="Wednesday" value="Wednesday" />
                  <Picker.Item label="Thursday" value="Thursday" />
                  <Picker.Item label="Friday" value="Friday" />
                  <Picker.Item label="Saturday" value="Saturday" />
                  <Picker.Item label="Sunday" value="Sunday" />
                </Picker>
                <TouchableOpacity style={styles.modalButton} onPress={handleAddToMealPlan}>
                  <Text style={styles.modalButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowModal(false)}>
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  foodDataContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  foodItem: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
  },
  selectedFoodContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedFoodText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedFoodName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  selectedFoodCalories: {
    fontSize: 16,
    marginBottom: 8,
    color: 'gray',
  },
  selectedFoodQuantity: {
    fontSize: 14,
    color: 'gray',
  },
  selectedFoodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  addToMealButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addToMealButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalContent: {
    width: '100%',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalQuantity: {
    fontSize: 16,
    marginBottom: 8,
    color: 'gray',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  picker: {
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 16,
  },
});

export default FoodDatabaseScreen;
