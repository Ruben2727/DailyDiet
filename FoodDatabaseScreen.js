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
  const isQuantityEntered = !!quantity;

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
          style={[styles.addToMealButton, !selectedFoodData && styles.disabledButton]}
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
                <TouchableOpacity
                  style={[styles.modalButton, !isQuantityEntered && styles.disabledButton]}
                  onPress={handleAddToMealPlan}
                  disabled={!isQuantityEntered}>
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
    backgroundColor: '#F0F0F0',
  },

  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#28a745',
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

  resultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },

  foodItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  selectedFoodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },

  selectedFoodContainer: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },

  addToMealButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToMealButtonText: {
    color: 'white',
  },
  closeModalButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#28a745',
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
  modalContent: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    alignSelf: 'center',
  },
  modalLabel: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  modalQuantity: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 16,
    alignSelf: 'center',
  },
});

export default FoodDatabaseScreen;
