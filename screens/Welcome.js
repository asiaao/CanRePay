import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A254D" />
      <LinearGradient
        colors={['#0A254D', '#1e3c72', '#2a5298']}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              {/* Logo Placeholder (using an icon) */}
              <View style={styles.logoPlaceholder}>
                <FontAwesome5 name="coins" size={100} color="#FDD835" />
              </View>

              <Text style={styles.title}>CanRepay</Text>
              <Text style={styles.subtitle}>Master Your Student Loans</Text>

              {/* Feature Highlights */}
              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <MaterialIcons name="calculate" size={30} color="#2ecc71" />
                  <Text style={styles.featureText}>Personalized Repayment Plans</Text>
                </View>
                <View style={styles.featureItem}>
                  <FontAwesome5 name="piggy-bank" size={26} color="#2ecc71" />
                  <Text style={styles.featureText}>Budgeting Tools & Tips</Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons name="finance" size={30} color="#2ecc71" />
                  <Text style={styles.featureText}>Track Loan Progress</Text>
                </View>
              </View>

              <Text style={styles.bodyText}>
                Navigate the complexities of Canadian student loans with ease. CanRepay provides personalized repayment plans,
                expert insights, and powerful tools to help you achieve financial freedom.
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  background: {
    flex: 1,
    width: '100%',
  },
  content: {
    padding: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75, // Make it circular
    backgroundColor: '#2c3e50', // A contrasting background
    shadowColor: "#000", // Add shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  bodyText: {
    fontSize: 17,
    color: '#ecf0f1',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: 'Helvetica',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  features: {
    marginBottom: 32,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 5, // Add some horizontal padding
  },
  featureText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 12,
    fontFamily: 'Helvetica',
    flexShrink: 1, // Allows text to wrap if it's too long
  },
});