import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function FoodDatabaseScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [foodData, setFoodData] = useState(null);

  const handleSearch = () => {
    const endpoint = 'https://trackapi.nutritionix.com/v2/search/item';
    const nixItemId = '513fc9e73fe3ffd40300109f';
    const appId = '73692cb5';
    const appKey = 'e2ad41d5f6891b1286283dc316696bb8';

    fetch(`${endpoint}?nix_item_id=${nixItemId}`, {
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
        if (data && data.foods && data.foods.length > 0) {  
          const foodItem = data.foods[0];
          console.log(foodItem);
          setFoodData(foodItem);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
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
      {foodData && (
        <View style={styles.foodDataContainer}>
          <Text style={styles.foodName}>{foodData.food_name}</Text>
          <Text>Brand: {foodData.brand_name}</Text>
          <Text>Calories: {foodData.nf_calories}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'top',
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 16,
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
  foodDataContainer: {
    marginTop: 16,
  },
  foodName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
});

export default FoodDatabaseScreen;
