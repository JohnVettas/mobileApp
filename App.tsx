import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AddGasScreen from "./addGas";
import GasStatsScreen from "./GasStats";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

function HomeScreen({ navigation }: any) {
    const [history, setHistory] = useState([]);

    const deleteEvent = (id: string) => {
        Alert.alert(
            "Delete Event",
            "Are you sure you want to remove this gas record?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const data =
                                await AsyncStorage.getItem("gas_history");
                            if (data) {
                                const history = JSON.parse(data);
                                // Filter out the item with the matching ID
                                const updatedHistory = history.filter(
                                    (item: any) => item.id !== id,
                                );
                                // Save updated list back to storage
                                await AsyncStorage.setItem(
                                    "gas_history",
                                    JSON.stringify(updatedHistory),
                                );
                                // Refresh the UI
                                setHistory(updatedHistory.reverse());
                            }
                        } catch (e) {
                            console.error("Failed to delete", e);
                        }
                    },
                },
            ],
        );
    };

    const loadHistory = async () => {
        try {
            const data = await AsyncStorage.getItem("gas_history");
            if (data !== null) {
                // Parse and reverse so the newest events are at the top
                setHistory(JSON.parse(data).reverse());
            }
        } catch (e) {
            console.error("Failed to load gas history", e);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            loadHistory();
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => navigation.navigate("AddGas")}
                style={({ pressed }) => [
                    styles.buttonBase,
                    pressed && styles.buttonPressed,
                ]}
            >
                <Text style={styles.buttonText}>Add New Gas Event</Text>
            </Pressable>

            <FlatList
                data={history}
                keyExtractor={(item: any) => item.id}
                style={{ width: "100%", marginTop: 20 }}
                renderItem={({ item }) => {
                    const [datePart, timePart] = item.date.split(", ");

                    return (
                        <Pressable
                            // This triggers the delete logic you wrote
                            onLongPress={() => deleteEvent(item.id)}
                            // Provides visual feedback when long-pressing
							onPress={() => navigation.navigate("GasStats", { eventId: item.id })}
							// This style change gives a visual cue that the item is being pressed
                            style={({ pressed }) => [
                                styles.row,
                                { opacity: pressed ? 0.5 : 1 },
                            ]}
                        >
                            {/* LEFT SIDE: Date & Time */}
                            <View style={styles.leftContainer}>
                                <Text style={styles.dateBig}>{datePart}</Text>
                                <Text style={styles.timeSmall}>{timePart}</Text>
                            </View>

                            {/* RIGHT SIDE: Data Box */}
                            <View style={styles.dataBox}>
                                <Text style={styles.dataLabel}>
                                    Spent:{" "}
                                    <Text style={styles.dataValue}>
                                        ${item.money}
                                    </Text>
                                </Text>
                                <Text style={styles.dataLabel}>
                                    Price:{" "}
                                    <Text style={styles.dataValue}>
                                        ${item.price}/L
                                    </Text>
                                </Text>
                                <Text style={styles.dataLabel}>
                                    Km:{" "}
                                    <Text style={styles.dataValue}>
                                        {item.km} km
                                    </Text>
                                </Text>
                                <Text style={styles.dataLabel}>
                                    Tank:{" "}
                                    <Text style={styles.dataValue}>
                                        {item.percentage}%
                                    </Text>
                                </Text>
                            </View>
                        </Pressable>
                    );
                }}
            />
            <StatusBar style="auto" />
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddGas" component={AddGasScreen} />
				<Stack.Screen name="GasStats" component={GasStatsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingTop: 20,
    },
    buttonBase: {
        backgroundColor: "#2196F3",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        elevation: 5,
    },
    buttonPressed: {
        backgroundColor: "#1976D2",
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    row: {
        flexDirection: "row",
        paddingHorizontal: 15,
        marginVertical: 10,
        alignItems: "center", 
    },
    leftContainer: {
        flex: 1, 
        paddingRight: 10,
    },
    dateBig: {
        fontSize: 18,
        fontWeight: "900", // Extra bold
        color: "#333",
        textAlign: "right",
    },
    timeSmall: {
        fontSize: 12,
        color: "#666",
        textAlign: "right",
    },
    dataBox: {
        flex: 2, // Takes up the remaining space
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#2196F3",
        borderRadius: 12,
        padding: 12,
    },
    dataLabel: {
        fontSize: 13,
        color: "#777",
        marginBottom: 2,
    },
    dataValue: {
        color: "#000",
        fontWeight: "600",
    },
});
