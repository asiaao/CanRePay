import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    let isValid = true;
    setEmailError('');

    if (!validateEmail(email)) {
      setEmailError('Invalid email format'); // More concise error
      isValid = false;
    }

    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Home');
    }, 1500);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A254D" />
        <LinearGradient
          colors={['#0A254D', '#1e3c72', '#2a5298']}
          style={styles.background}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.content}>
                <View style={styles.logoPlaceholder}>
                  <FontAwesome5 name="coins" size={80} color="#FDD835" />
                </View>

                <Text style={styles.title}>Login to CanRepay</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      emailError ? styles.inputError : null,
                    ]}
                    placeholder="Email"
                    placeholderTextColor="#bdc3c7"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={() => {
                      if (email && !validateEmail(email)) {
                        setEmailError('Invalid email format'); // Concise error
                      } else {
                        setEmailError('');
                      }
                    }}
                  />
                  {/* Error Message Below Input */}
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#bdc3c7"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <FontAwesome5
                      name={isPasswordVisible ? 'eye' : 'eye-slash'}
                      size={20}
                      color="#bdc3c7"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Loading...' : 'Login'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { /* Handle forgot password */ }}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

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
    width: 120,
    height: 120,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    backgroundColor: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 30,
    fontFamily: 'Helvetica-Bold',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20, // Keep some bottom margin
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    width: '100%',
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 1,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    fontFamily: 'Helvetica',
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginTop: 5, // Add top margin
    marginBottom: 0, // Reduce bottom margin
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
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
  forgotPassword: {
    color: '#bdc3c7',
    marginTop: 15,
    fontFamily: 'Helvetica',
  },
});