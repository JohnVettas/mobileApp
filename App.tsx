import React from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AddGasScreen from "./addGas";

const Stack = createStackNavigator();

function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => {
                    navigation.navigate("AddGas");
                    console.log("Navigating to AddGasScreen");
                }}
                style={({ pressed }) => [
                    styles.buttonBase,
                    pressed && styles.buttonPressed,
                ]}
            >
                <Text style={styles.buttonText}>Add New Gas Event</Text>
            </Pressable>
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
});
