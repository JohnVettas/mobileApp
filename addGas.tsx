import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";

export default function AddGasScreen() {
    const navigation = useNavigation();
    const [money, setMoney] = useState("");
    const [price, setPrice] = useState("");
    const [km, setKm] = useState("");
    const [percentage, setPercentage] = useState("");

    const handleSubmit = async () => {
        // 1. Create the new entry with a timestamp
		if (!money || !price || !km || !percentage) {
			alert("Please fill in all fields");
			console.log("ALL SAVED DATA", await AsyncStorage.getItem("gas_history"));
			return;
		}
        const newEvent = {
            money,
            price,
            km,
            percentage,
            date: new Date().toLocaleString(), // Captures current Date and Time as a string
            id: Date.now().toString(), // Unique ID for lists
        };

        try {
            // 2. Get the existing array from storage
            const existingData = await AsyncStorage.getItem("gas_history");

            // 3. If it exists, parse it; if not, start a new array
            const history = existingData ? JSON.parse(existingData) : [];

            // 4. Add the new event to the array
            history.push(newEvent);

            // 5. Save the updated array back to storage
            await AsyncStorage.setItem("gas_history", JSON.stringify(history));

            alert("Gas event saved to history!");

			
            navigation.goBack();
        } catch (e) {
            console.error("Error saving history", e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Set money spent of gas: </Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 50"
                keyboardType="numeric"
                value={money}
                onChangeText={setMoney}
            />

            <Text style={styles.label}>Set price of gas per liter: </Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 1.90"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
            />
            <Text style={styles.label}>Set Km of car: </Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 100.000"
                keyboardType="numeric"
                value={km}
                onChangeText={setKm}
            />
            <Text style={styles.label}>
                Percentage (%) of gas tank after adding gas:{" "}
            </Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 45"
                keyboardType="numeric"
                value={percentage}
                onChangeText={setPercentage}
            />
            <Pressable style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.saveButtonText}>Save Event</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 10,
        borderColor: "#ddd",
        borderWidth: 3,
        padding: 20,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "center",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#4CAF50", // Green for "Save"
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    saveButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
