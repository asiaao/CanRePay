import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, TextInput, Alert, Keyboard } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = ({ navigation }) => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [editable, setEditable] = useState(false);
  const [provincialRate] = useState(7.2);
  const [federalRate] = useState(0);
  const [paymentPercentage, setPaymentPercentage] = useState(10); // Initial value

  const [loans, setLoans] = useState({
    federal: 24000,
    provincial: 16000,
    payments: [
      { date: '2023-03-15', amount: 1000 },
      { date: '2023-09-01', amount: 1000 }
    ]
  });

  const [income, setIncome] = useState(3000);
  const [expenses, setExpenses] = useState({
    rent: 800,
    utilities: 150,
    groceries: 300,
    transportation: 100
  });

  const [graduationDate, setGraduationDate] = useState(new Date(2027, 5, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const totalLoan = loans.federal + loans.provincial;
  const paymentsMade = loans.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = totalLoan - paymentsMade;

    // Calculate Repayment
  const calculateProjectedTotal = () => {
    // Simplified interest calculation (for demonstration)
    const yearsRemaining = Math.max(0, (graduationDate.getFullYear() + 5) - new Date().getFullYear()); // Assume 5 years after graduation
    const provincialInterest = loans.provincial * (provincialRate / 100) * yearsRemaining;
    return outstanding + provincialInterest;
  };
    // Payment Calc
  const monthlyPaymentCalculation = () => {
    const federalPayment = loans.federal / 120; // 10-year standard plan
    const provincialPayment = (loans.provincial * (provincialRate / 1200)) / (1 - Math.pow(1 + (provincialRate / 1200), -120));
        // Apply user's selected percentage of income.
    const userPayment = income * (paymentPercentage / 100);

    return {
      federal: federalPayment,
      provincial: provincialPayment,
      total: federalPayment + provincialPayment,
      user: userPayment, // The amount based on user's slider choice
    };
  };

  const updateLoan = (type, value) => {
    const numericValue = parseFloat(value) || 0;
    setLoans(prev => ({ ...prev, [type]: numericValue }));
    setLastUpdated(new Date());
  };

    const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || graduationDate;
    setShowDatePicker(Platform.OS === 'ios'); // For iOS, keep the modal open
    setGraduationDate(currentDate);
    setLastUpdated(new Date()); // Update last updated time
  };

  const addPayment = () => {
    Alert.prompt(
      'Add Payment',
      'Enter payment amount:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (amount) => {
            const numericAmount = parseFloat(amount);
            if (!isNaN(numericAmount) && numericAmount > 0) {
              setLoans(prev => ({
                ...prev,
                payments: [...prev.payments, { date: new Date().toISOString().split('T')[0], amount: numericAmount }]
              }));
              setLastUpdated(new Date());
            } else {
              Alert.alert("Invalid Input", "Please enter a valid positive number.");
            }
          }
        }
      ],
      'plain-text'
    );
  };
    const navigateToCanRepay = () => {
    navigation.navigate('CanRepayScreen'); // Replace 'CanRepayScreen' with your actual screen name.
  };

  return (
     <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A254D" />
        <LinearGradient
          colors={['#0A254D', '#1e3c72', '#2a5298']}
          style={styles.background}
          >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.lastUpdated}>Last Updated: {lastUpdated.toLocaleString()}</Text>
                        <TouchableOpacity onPress={() => setEditable(!editable)}>
                        <Ionicons name={editable ? 'lock-open' : 'lock-closed'} size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Loan Summary */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Loan Summary</Text>
                        <LoanItem label="Federal Loans (0%)" value={loans.federal} editable={editable} onChange={(v) => updateLoan('federal', v)} />
                        <LoanItem label={`Provincial Loans (${provincialRate}%)`} value={loans.provincial} editable={editable} onChange={(v) => updateLoan('provincial', v)} color="#e74c3c" />
                        <View style={styles.divider} />
                        <Text style={styles.summaryText}>Total Loans: ${totalLoan.toLocaleString()}</Text>
                        <Text style={styles.summaryText}>Payments Made: ${paymentsMade.toLocaleString()}</Text>
                        <Text style={[styles.summaryText, styles.outstanding]}>Outstanding Balance: ${outstanding.toLocaleString()}</Text>
                    </View>

                    {/* Repayment Projection */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Repayment Projection</Text>
                        <View style={styles.datePickerContainer}>
                        <Text style={styles.label}>Expected Graduation:</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.dateText}>{graduationDate.toLocaleDateString()}</Text>
                            <FontAwesome5 name="calendar-alt" size={20} color="#3498db" style={styles.calendarIcon} />
                        </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                        <DateTimePicker
                            value={graduationDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            />
                        )}

                    <View style={styles.paymentBreakdown}>
                        <Text style={styles.label}>Monthly Payment Options:</Text>
                        <PaymentDetail label="Federal (10 yr)" value={monthlyPaymentCalculation().federal} />
                        <PaymentDetail label="Provincial (10 yr)" value={monthlyPaymentCalculation().provincial} />
                        <PaymentDetail label="Total (Standard)" value={monthlyPaymentCalculation().total} />
                         <PaymentDetail label={`Your Plan (${paymentPercentage}%)`} value={monthlyPaymentCalculation().user} emphasized />
                    </View>
                        <View style={styles.sliderContainer}>
                        <Text style={styles.label}>Adjust Payment Percentage:</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={5}
                            maximumValue={50}
                            step={1}
                            value={paymentPercentage}
                            minimumTrackTintColor="#3498db" // Good practice
                            maximumTrackTintColor="#bdc3c7" // Good practice
                            thumbTintColor="#3498db"
                            onValueChange={(value) => {
                                setPaymentPercentage(value);
                                Keyboard.dismiss();
                            }}
                            />
                         <Text style={styles.sliderLabel}>{paymentPercentage}% of income</Text>
                        </View>
                    </View>

                    {/* Financial Health */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Financial Health</Text>
                        <View style={styles.financialGrid}>
                        <View style={styles.incomeSection}>
                            <Text style={styles.label}>Monthly Income</Text>
                            <TextInput
                            style={styles.currencyInput}
                            value={income.toString()}
                            onChangeText={(v) => setIncome(parseFloat(v) || 0)}
                            keyboardType="numeric"
                            editable={editable}
                            />
                        </View>
                        <View style={styles.expensesSection}>
                            <Text style={styles.label}>Fixed Expenses</Text>
                            {Object.entries(expenses).map(([category, amount]) => (
                            <ExpenseItem key={category} category={category} amount={amount} editable={editable} onExpenseChange={(newAmount) => {
                                const updatedExpenses = { ...expenses, [category]: parseFloat(newAmount) || 0 };
                                setExpenses(updatedExpenses);
                                setLastUpdated(new Date()); // Update on expense change
                            }}/>
                            ))}
                            <Text style={styles.remainingBalance}>Remaining: ${(income - Object.values(expenses).reduce((a, b) => a + b, 0)).toFixed(2)}</Text>
                        </View>
                        </View>
                  </View>
                   <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                        <Text style={styles.cardTitle}>Payment History</Text>
                        <TouchableOpacity onPress={addPayment}>
                            <Ionicons name="add-circle" size={28} color="#3498db" />
                        </TouchableOpacity>
                        </View>
                        {loans.payments.length > 0 ? (
                        loans.payments.map((payment, index) => (
                            <View key={index} style={styles.paymentItem}>
                            <Text style={styles.paymentDate}>{payment.date}</Text>
                            <Text style={styles.paymentAmount}>${payment.amount.toFixed(2)}</Text>
                            </View>
                        ))
                        ) : (
                        <Text style={styles.noPaymentsText}>No payments made yet.</Text>
                        )}
                    </View>

                    {/* CanRepay Button */}
                    <TouchableOpacity style={styles.canRepayButton} onPress={navigateToCanRepay}>
                        <Text style={styles.canRepayButtonText}>Go to CanRepay Calculator</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    </View>
  );
};
const LoanItem = ({ label, value, editable, onChange, color = '#2ecc71' }) => (
  <View style={styles.loanItem}>
    <Text style={[styles.loanLabel, { color }]}>{label}</Text>
    {editable ? (
      <TextInput
        style={[styles.loanInput, { borderColor: color }]}
        value={value.toString()}
        onChangeText={onChange}
        keyboardType="numeric"
      />
    ) : (
      <Text style={styles.loanValue}>${value.toLocaleString()}</Text>
    )}
  </View>
);
const PaymentDetail = ({ label, value, emphasized = false }) => (
  <View style={styles.paymentRow}>
    <Text style={styles.paymentLabel}>{label}:</Text>
    <Text style={[styles.paymentValue, emphasized && styles.emphasizedValue]}>
      ${value.toFixed(2)}
    </Text>
  </View>
);

const ExpenseItem = ({ category, amount, editable, onExpenseChange }) => (
    <View style={styles.expenseRow}>
      <Text style={styles.expenseCategory}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
      {editable ? (
        <TextInput
          style={[styles.expenseInput, { borderColor: '#3498db'}]}
          value={amount.toString()}
          onChangeText={onExpenseChange}
          keyboardType="numeric"
        />
      ) : (
        <Text style={styles.expenseAmount}>${amount.toFixed(2)}</Text>
      )}
    </View>
  );

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  background: {
    flex: 1,
  },
  scrollView: {
    width: '100%',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40, // Ensure space for the button
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  lastUpdated: {
    color: '#ecf0f1',
    fontSize: 14,
    fontFamily: 'Helvetica',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    paddingBottom: 10,
  },
  loanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  loanLabel: {
    color: '#ecf0f1',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  loanInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    width: 100,
    textAlign: 'right',
    fontFamily: 'Helvetica',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Slightly darker
  },
  loanValue: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  divider: {
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#ecf0f1',
    marginVertical: 5,
    fontFamily: 'Helvetica',
  },
  outstanding: {
    color: '#e74c3c',
    fontWeight: '700',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Slightly darker
    padding: 10,
    borderRadius: 8,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Helvetica',
    marginRight: 10,
  },
  calendarIcon: {
    marginLeft: 'auto',
  },
  paymentBreakdown: {
    marginVertical: 15,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  paymentLabel: {
    color: '#ecf0f1',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  paymentValue: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  emphasizedValue: {
    color: '#2ecc71',
    fontWeight: '700',
  },
  sliderContainer: {
    marginVertical: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    color: '#ecf0f1',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Helvetica',
  },
  financialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  incomeSection: {
    width: '48%', // Adjusted for better spacing
  },
  expensesSection: {
    width: '48%', // Adjusted for better spacing
  },
  label: {
    color: '#ecf0f1',
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Helvetica',
  },
  currencyInput: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Helvetica',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 10, // Added margin
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Vertical alignment
    marginVertical: 5,
  },
  expenseCategory: {
    color: '#ecf0f1',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  expenseInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    color: '#fff',
    width: 80,
    textAlign: 'right',
    fontFamily: 'Helvetica',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  expenseAmount: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  remainingBalance: {
    color: '#2ecc71',
    fontWeight: '700',
    marginTop: 10,
    fontFamily: 'Helvetica',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5, // Reduced bottom margin
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  paymentDate: {
    color: '#ecf0f1',
    fontSize: 14,
    fontFamily: 'Helvetica',
  },
  paymentAmount: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Helvetica',
  },
  noPaymentsText: {
    color: '#bdc3c7',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Helvetica',
  },
  canRepayButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20, // Add some space above the button
    alignSelf: 'center', // Center the button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  canRepayButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
});

export default Home;