import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

const CaloricIntakeResult = ({ adjustedCaloricIntake }) => {
  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>Caloric Intake:</Text>
      <Text style={styles.caloricIntake}>{adjustedCaloricIntake}</Text>
    </View>
  );
};

export default function App() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [healthGoal, setHealthGoal] = useState('');
  const [isGenderDropdownVisible, setIsGenderDropdownVisible] = useState(false);
  const [isActivityLevelDropdownVisible, setIsActivityLevelDropdownVisible] = useState(false);
  const [isHealthGoalDropdownVisible, setIsHealthGoalDropdownVisible] = useState(false);
  const [adjustedCaloricIntake, setAdjustedCaloricIntake] = useState('');

  const handleAgeChange = (text) => {
    setAge(text);
  };

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    setIsGenderDropdownVisible(false);
  };

  const handleHeightChange = (text) => {
    setHeight(text);
  };

  const handleWeightChange = (text) => {
    setWeight(text);
  };

  const handleActivityLevelChange = (selectedActivityLevel) => {
    setActivityLevel(selectedActivityLevel);
    setIsActivityLevelDropdownVisible(false);
  };

  const handleHealthGoalChange = (selectedHealthGoal) => {
    setHealthGoal(selectedHealthGoal);
    setIsHealthGoalDropdownVisible(false);
  };

  const calculateBMR = () => {
    let bmr = 0;

    if (gender === 'Male') {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else if (gender === 'Female') {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }

    return bmr.toFixed(0);
  };

  const handleSubmit = () => {
    const bmr = calculateBMR();
    const calor = calculateAdjustedCaloricIntake(bmr, healthGoal, activityLevel);
    setAdjustedCaloricIntake(calor);
  };

  const isSubmitDisabled = !age || !gender || !height || !weight || !activityLevel || !healthGoal;

  const calculateAdjustedCaloricIntake = (bmr, healthGoal, activityLevel) => {
    let adjustedCaloricIntake = 0;
    switch (activityLevel) {
      case 'Sedentary':
        adjustedCaloricIntake = bmr * 1.2;
        break;
      case 'Light Exercise':
        adjustedCaloricIntake = bmr * 1.375;
        break;
      case 'Moderate Exercise':
        adjustedCaloricIntake = bmr * 1.55;
        break;
      case 'Heavy Exercise':
        adjustedCaloricIntake = bmr * 1.725;
        break;
      case 'Extra Active':
        adjustedCaloricIntake = bmr * 1.9;
        break;
      default:
        adjustedCaloricIntake = bmr;
        break;
    }

    switch (healthGoal) {
      case 'Weight Loss':
        adjustedCaloricIntake -= adjustedCaloricIntake * 0.1;
        break;
      case 'Weight Gain':
        adjustedCaloricIntake += adjustedCaloricIntake * 0.1;
        break;
    }

    return adjustedCaloricIntake.toFixed(0);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Age in years"
          onChangeText={handleAgeChange}
          value={age}
          keyboardType="numeric"
        />
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsGenderDropdownVisible(true)}>
            <Text>{gender ? gender : 'Select Gender'}</Text>
          </TouchableOpacity>
          {isGenderDropdownVisible && (
            <Modal animationType="slide" transparent visible={isGenderDropdownVisible}>
              <View style={styles.dropdownModalContainer}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleGenderChange('Male')}>
                  <Text>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleGenderChange('Female')}>
                  <Text>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleGenderChange('Other')}>
                  <Text>Other</Text>
                </TouchableOpacity>
                <Button title="Close" onPress={() => setIsGenderDropdownVisible(false)} />
              </View>
            </Modal>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Height in cm"
          onChangeText={handleHeightChange}
          value={height}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Weight in kg"
          onChangeText={handleWeightChange}
          value={weight}
          keyboardType="numeric"
        />
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsActivityLevelDropdownVisible(true)}>
            <Text>{activityLevel ? activityLevel : 'Select Activity Level'}</Text>
          </TouchableOpacity>
          {isActivityLevelDropdownVisible && (
            <Modal animationType="slide" transparent visible={isActivityLevelDropdownVisible}>
              <View style={styles.dropdownModalContainer}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleActivityLevelChange('Sedentary')}>
                  <Text>Sedentary</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleActivityLevelChange('Light Exercise')}>
                  <Text>Light Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleActivityLevelChange('Moderate Exercise')}>
                  <Text>Moderate Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleActivityLevelChange('Heavy Exercise')}>
                  <Text>Heavy Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleActivityLevelChange('Extra Active')}>
                  <Text>Extra Active</Text>
                </TouchableOpacity>
                <Button title="Close" onPress={() => setIsActivityLevelDropdownVisible(false)} />
              </View>
            </Modal>
          )}
        </View>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsHealthGoalDropdownVisible(true)}>
            <Text>{healthGoal ? healthGoal : 'Select Health Goal'}</Text>
          </TouchableOpacity>
          {isHealthGoalDropdownVisible && (
            <Modal animationType="slide" transparent visible={isHealthGoalDropdownVisible}>
              <View style={styles.dropdownModalContainer}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleHealthGoalChange('Weight Loss')}>
                  <Text>Weight Loss</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleHealthGoalChange('Weight Maintenance')}>
                  <Text>Weight Maintenance</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleHealthGoalChange('Weight Gain')}>
                  <Text>Weight Gain</Text>
                </TouchableOpacity>
                <Button title="Close" onPress={() => setIsHealthGoalDropdownVisible(false)} />
              </View>
            </Modal>
          )}
        </View>
        <TouchableOpacity
          style={[styles.Button, isSubmitDisabled && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitDisabled}>
          <Text style={styles.ButtonText}>Submit</Text>
        </TouchableOpacity>
        {adjustedCaloricIntake !== '' && (
          <CaloricIntakeResult adjustedCaloricIntake={adjustedCaloricIntake} />
        )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  dropdownModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  Button: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  ButtonText: {
    color: 'white',
    fontSize: 16,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  caloricIntake: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
