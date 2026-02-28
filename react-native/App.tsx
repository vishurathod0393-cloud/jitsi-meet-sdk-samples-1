// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";
import { enableScreens } from "react-native-screens";

enableScreens();

/* ================= SCREENS ================= */
import LoginScreen from "./screen/DoctorPortalLogin";
import DoctorDashboard from "./screen/DoctorDashboard";
import MyPatientsScreen from "./screen/MyPatientsScreen";
import ChatScreen from "./screen/ChatScreen";
import HistoryScreen from "./screen/HistoryScreen";
import RxScreen from "./screen/RxScreen";
import DirectCallScreen from "./screen/DirectCallScreen";
import OutgoingCallScreen from "./screen/OutgoingCallScreen";

/* ================= NAVIGATORS ================= */
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ================= BOTTOM TABS ================= */
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#00A8E8",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 10,
          backgroundColor: "#ffffff",
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName = "";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Patients") iconName = "users";
          else if (route.name === "Chat") iconName = "message-circle";
          else if (route.name === "History") iconName = "clock";
          else if (route.name === "Rx") iconName = "file-text";

          return (
            <Icon
              name={iconName}
              size={22}
              color={focused ? "#00A8E8" : color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={DoctorDashboard} />
      <Tab.Screen name="Patients" component={MyPatientsScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Rx" component={RxScreen} />
      {/* <Stack.Screen name="OutgoingCallScreen" component={OutgoingCallScreen} /> */}
    </Tab.Navigator>
  );
}

/* ================= MAIN APP ================= */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* Main App */}
        <Stack.Screen name="MainApp" component={BottomTabs} />
        
        {/* Video Call Screen */}
        <Stack.Screen name="DirectCallScreen" component={DirectCallScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
