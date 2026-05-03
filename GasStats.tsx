import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

// We destructure 'route' from the props provided by React Navigation
export default function GasStatsScreen({ route }: any) {
    // Grab the eventId we passed from the previous screen
    const { eventId } = route.params;

    const [event, setEvent] = useState<any>(null);
    const [nextEvent, setNextEvent] = useState<any>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const existingData = await AsyncStorage.getItem("gas_history");

                if (existingData) {
                    const history = JSON.parse(existingData);

                    // 1. Find the index of the current event
                    const currentIndex = history.findIndex(
                        (item: any) => item.id === eventId,
                    );

                    // 2. Get the current event
                    const foundEvent = history[currentIndex];

                    // 3. Get the next event (index + 1)
                    // We check if history[currentIndex - 1] exists to avoid errors
                    const nextEventFound = history[currentIndex - 1]
                        ? history[currentIndex - 1]
                        : null;

                    setEvent(foundEvent);
                    setNextEvent(nextEventFound); // You'll need a new useState for this
                }

                // console.log("ALL SAVED DATA", event);
            } catch (e) {
                console.error("Error loading event details:", e);
            }
        };
        fetchEvent();
    }, [eventId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gas Event Details</Text>
            <Text style={styles.subtitle}>Viewing ID: {eventId}</Text>

            <View style={styles.card}>
                <Text style={styles.text}>
                    Date: {event ? event.date : "N/A"}
                </Text>
                <Text style={styles.text}>
                    Money spent: €{event ? event.money : "N/A"}
                </Text>
                <Text style={styles.text}>
                    Price of gas per litter: €{event ? event.price : "N/A"}
                </Text>
                <Text style={styles.text}>
                    Km of car: {event ? event.km : "N/A"} km
                </Text>
                <Text style={styles.text}>
                    Percentage of tank: {event ? event.percentage : "N/A"}%
                </Text>
                <Text style={styles.text}>
                    Litters added:{" "}
                    {event ? (event.money / event.price).toFixed(2) : "N/A"} L
                </Text>

                <Text style={styles.text}>
                    Difference in price:{" "}
                    {nextEvent
                        ? (event.price - nextEvent.price > 0 ? "+" : "") +
                          (event.price - nextEvent.price).toFixed(2)
                        : "N/A"}{" "}
                    €/L
                </Text>
                <Text style={styles.text}>
                    Difference in percentage since last fill-up:{" "}
                    {nextEvent
                        ? (event.percentage - nextEvent.percentage).toFixed(2)
                        : "N/A"}
                    %
                </Text>

                <Text style={styles.text}>
                    Km driven since last fill-up:{" "}
                    {nextEvent ? (event.km - nextEvent.km).toFixed(0) : "N/A"}{" "}
                    km
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA", // Light professional gray background
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: "#718096",
        marginBottom: 25,
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    // This wraps your data in a nice elevated white box
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4, // Shadow for Android
    },
    text: {
        fontSize: 16,
        color: "#4A5568",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F7", // Divider line between rows
    },
    // Pro-tip: You can apply this to your "Difference" or "KM driven" texts
    // to make the calculated stats look more important.
    highlightText: {
        fontWeight: "700",
        color: "#2196F3",
    },
});
