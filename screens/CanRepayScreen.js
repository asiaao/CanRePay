import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { BarChart } from 'react-native-chart-kit'; // Import BarChart


const CanRepayScreen = ({ navigation }) => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [customMonthlyPayment, setCustomMonthlyPayment] = useState(''); // New state
  const [paymentPercentage, setPaymentPercentage] = useState(10);

  const [repaymentYears, setRepaymentYears] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);  //Keep for consistency

    //Networth
    const [expectedMonthlyIncome, setExpectedMonthlyIncome] = useState('');
    const [currentSavings, setCurrentSavings] = useState('');
    const [carValue, setCarValue] = useState('');
    const [investmentBalance, setInvestmentBalance] = useState('');
    const [federalLoanBalance, setFederalLoanBalance] = useState('');
    const [provincialLoanBalance, setProvincialLoanBalance] = useState('');
    const [netWorth, setNetWorth] = useState(null); // State for calculated net worth


  // Interest Rates- Updated in October
  const [federalInterestRate] = useState(0); // Federal rate
  const [provincialInterestRate] = useState(7.2); // Alberta provincial rate

    const calculateRepayment = () => {
        const income = parseFloat(monthlyIncome);
        const loan = parseFloat(loanAmount);
        const rate = parseFloat(interestRate);

        if (isNaN(income) || income <= 0 || isNaN(loan) || loan <= 0 || isNaN(rate) || rate < 0) {
            Alert.alert("Input Error", "Please enter valid positive numbers for income and loan.  Interest rate should be 0 or more.");
            return;
        }

        // Use custom monthly payment if provided, otherwise use calculated percentage of income
        const monthlyPayment = customMonthlyPayment ? parseFloat(customMonthlyPayment) : income * (paymentPercentage/100);

        if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
            Alert.alert("Payment Error", "Please enter a valid custom monthly payment or provide a valid monthly income.");
            return;
        }
      const monthlyInterestRate = (rate/100) / 12;
      const numPayments = Math.log(monthlyPayment / (monthlyPayment - loan * monthlyInterestRate)) / Math.log(1+monthlyInterestRate)
      const months = numPayments;

        if (!isFinite(months)) { // Check for Infinity/NaN
            Alert.alert("Repayment Error", "With the given inputs, the loan cannot be repaid.  Consider increasing your monthly payment.");
            return;
        }

        const years = (months / 12).toFixed(1);
        const totalPaid = monthlyPayment * months;
        const interestPaid = (totalPaid - loan).toFixed(2);

      setRepaymentYears(years);
      setTotalInterest(interestPaid);

        const simulatedProgress = 0;
        setProgressPercent(simulatedProgress);
    };

    //Networth Calc
    const calculateNetWorth = () => {
    const savings = parseFloat(currentSavings) || 0;
    const car = parseFloat(carValue) || 0;
    const investments = parseFloat(investmentBalance) || 0;
    const federalLoan = parseFloat(federalLoanBalance) || 0;
    const provincialLoan = parseFloat(provincialLoanBalance) || 0;

    const totalAssets = savings + car + investments;
    const totalLiabilities = federalLoan + provincialLoan;
    const calculatedNetWorth = totalAssets - totalLiabilities;

        setNetWorth(calculatedNetWorth);
    };

    //Data for bar graph
     const netWorthData = {
        labels: ["Assets", "Liabilities"],
        datasets: [
          {
            data: [
                (parseFloat(currentSavings) || 0) + (parseFloat(carValue) || 0) + (parseFloat(investmentBalance) || 0),
                (parseFloat(federalLoanBalance) || 0) + (parseFloat(provincialLoanBalance) || 0)
            ],
            colors: [
                (opacity = 1) => `#2ecc71`,  // Green for Assets
                (opacity = 1) => `#e74c3c`,  // Red for Liabilities
              ]
          }
        ]
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
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoPlaceholder}>
              <FontAwesome5 name="coins" size={60} color="#FDD835" />
            </View>
            <Text style={styles.header}>CanRepay Calculator</Text>
            <Text style={styles.subHeader}>
              Plan, Predict, and Prosper
            </Text>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Monthly Income ($):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g., 3000"
                placeholderTextColor="#95a5a6"
                value={monthlyIncome}
                onChangeText={setMonthlyIncome}
              />
              <Text style={styles.inputLabel}>Total Loan Amount ($):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g., 40000"
                placeholderTextColor="#95a5a6"
                value={loanAmount}
                onChangeText={setLoanAmount}
              />
              <Text style={styles.inputLabel}>Annual Interest Rate (%):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g., 5"
                placeholderTextColor="#95a5a6"
                value={interestRate}
                onChangeText={setInterestRate}
              />
                {/* Interest Rate Information */}
                <View style={styles.interestRateInfo}>
                    <Text style={styles.infoTextBold}>Current Interest Rates (Alberta):</Text>
                    <Text style={styles.infoText}>Federal: {federalInterestRate}%</Text>
                    <Text style={styles.infoText}>Provincial (Alberta): {provincialInterestRate}%</Text>
                    <Text style={[styles.infoText, {fontSize: 12, color: '#bdc3c7'}]}>
                        *Note: Interest rates are subject to change. Please refer to official sources for the most up-to-date information.
                    </Text>
                </View>

               <View style={styles.sliderContainer}>
                        <Text style={styles.label}>Adjust Payment Percentage:</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={5}
                            maximumValue={50}
                            step={1}
                            value={paymentPercentage}
                            minimumTrackTintColor="#3498db"
                            maximumTrackTintColor="#bdc3c7"
                            thumbTintColor="#3498db"
                            onValueChange={(value) => {
                                setPaymentPercentage(value);
                                Keyboard.dismiss();
                            }}
                            />
                         <Text style={styles.sliderLabel}>{paymentPercentage}% of income</Text>
                </View>

              <TouchableOpacity
                style={styles.calcButton}
                onPress={calculateRepayment}
              >
                <Text style={styles.buttonText}>Calculate</Text>
              </TouchableOpacity>
            </View>
            {repaymentYears && totalInterest && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Summary</Text>
                    <Text style={styles.infoText}>
                        Monthly Payment: ${ (monthlyIncome * paymentPercentage/100).toFixed(2) }
                    </Text>
                    <Text style={styles.infoText}>
                        Estimated Repayment Duration: {repaymentYears} years
                    </Text>
                    <Text style={styles.infoText}>
                        Estimated Total Interest Paid: ${totalInterest}
                    </Text>
                    </View>
            )}

            {/* Graph Visualization - Keep consistent */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Repayment Progress (Simulated)</Text>
              <View style={styles.graphContainer}>
                <View style={[styles.graphBar, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.graphLabel}>{progressPercent}% completed</Text>
            </View>

             {/* Net Worth Calculator */}
             <View style={styles.card}>
                    <Text style={styles.cardTitle}>Net Worth Calculator</Text>
                    <Text style={styles.infoText}>
                        Use this to get a snapshot of your current financial standing.
                    </Text>
                    <View style={styles.netWorthInputContainer}>
                        <Text style={styles.inputLabel}>Expected Monthly Income ($):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="e.g., 4000"
                            placeholderTextColor="#95a5a6"
                            value={expectedMonthlyIncome}
                            onChangeText={setExpectedMonthlyIncome}
                        />
                        <Text style={styles.inputLabel}>Current Savings ($):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="e.g., 5000"
                            placeholderTextColor="#95a5a6"
                            value={currentSavings}
                            onChangeText={setCurrentSavings}
                        />
                        <Text style={styles.inputLabel}>Car Value ($):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="e.g., 10000"
                            placeholderTextColor="#95a5a6"
                            value={carValue}
                            onChangeText={setCarValue}
                        />
                        <Text style={styles.inputLabel}>Investment Account Balance ($):</Text>
                         <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="e.g., 2000"
                            placeholderTextColor="#95a5a6"
                            value={investmentBalance}
                            onChangeText={setInvestmentBalance}
                        />
                        <Text style={styles.inputLabel}>Federal Loan Balance ($):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="e.g., 15000"
                            placeholderTextColor="#95a5a6"
                            value={federalLoanBalance}
                            onChangeText={setFederalLoanBalance}
                        />
                        <Text style={styles.inputLabel}>Provincial Loan Balance ($):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="e.g., 10000"
                            placeholderTextColor="#95a5a6"
                            value={provincialLoanBalance}
                            onChangeText={setProvincialLoanBalance}
                         />
                    </View>

                    <TouchableOpacity style={styles.calcButton} onPress={calculateNetWorth}>
                        <Text style={styles.buttonText}>Calculate Net Worth</Text>
                    </TouchableOpacity>

                   {netWorth !== null && (
                        <View style={styles.netWorthResult}>
                            <Text style={styles.netWorthText}>
                                Your Estimated Net Worth: ${netWorth.toFixed(2)}
                            </Text>
                             {/* Bar Chart */}
                            <BarChart
                                data={netWorthData}
                                width={300}
                                height={220}
                                yAxisLabel="$"
                                chartConfig={{
                                    backgroundColor: '#1e2923',
                                    backgroundGradientFrom: '#1e2923',
                                    backgroundGradientTo: '#1e2923',
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                }}
                                verticalLabelRotation={0} // Adjust as needed
                                style={styles.chart}

                            />
                        </View>
                    )}
                </View>

            {/* Informational Section */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Federal vs. Provincial Loans</Text>
              <View style={styles.infoContainer}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={24}
                  color="#3498db"
                />
                <Text style={styles.infoText}>
                  Federal and provincial loans have key differences. Federal
                  loans often have more flexible repayment options, including
                  income-driven repayment plans. Provincial loans may have
                  higher interest rates and less flexible terms.
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <FontAwesome5 name="lightbulb" size={24} color="#f1c40f" />
                <Text style={styles.tipText}>
                  <Text style={{ fontWeight: 'bold' }}>Tip:</Text> Always
                  prioritize paying down loans with the highest interest rates
                  first to save money in the long run. Consider consolidating
                  your loans if it simplifies repayment and lowers your overall
                  interest rate.
                </Text>
              </View>
            </View>

            {/* Niche Problem Section */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Unexpected Expenses Planner
              </Text>
                <MaterialCommunityIcons name="piggy-bank" size={24} color="#3498db" style={styles.iconMargin}/>
              <Text style={styles.infoText}>
                Life happens! Use this tool to see how unexpected expenses (car
                repairs, medical bills, etc.) might impact your loan repayment
                timeline.
              </Text>

              {/* You'd add input fields and logic here to handle this */}
            </View>

            {/* Navigation Back Button */}
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default CanRepayScreen;

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
    width: '100%',
  },
  content: {
    padding: 20,
    alignItems: 'center', // Center content horizontally
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold',
  },
  subHeader: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%', // Make cards full width
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10, // Add some space
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    paddingBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#ecf0f1',
    marginBottom: 5,
    fontFamily: 'Helvetica',
    marginLeft: 10, // Add some space
  },
    infoTextBold: {
    fontSize: 16,
    color: '#ecf0f1',
    marginBottom: 5,
    fontFamily: 'Helvetica',
    marginLeft: 10, // Add some space
    fontWeight: 'bold'
  },
    infoContainer:{
        flexDirection: 'row',
        alignItems: 'flex-start', //For when theres alot of text
        marginBottom: 10,
    },
  tipText: {
    fontSize: 16,
    color: '#ecf0f1',
    fontStyle: 'italic',
    marginTop: 10,
    fontFamily: 'Helvetica',
      marginLeft: 10,
  },
  graphContainer: {
    backgroundColor: '#bdc3c7',
    borderRadius: 5,
    height: 20,
    marginVertical: 10,
    overflow: 'hidden',
  },
  graphBar: {
    height: '100%',
    backgroundColor: '#2ecc71',
  },
  graphLabel: {
    fontSize: 14,
    color: '#ecf0f1',
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  calcButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  backButton: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    fontFamily: 'Helvetica',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    fontFamily: 'Helvetica',
    width: '100%', // Full width
  },
    sliderContainer: {
    marginVertical: 15,
    width: '100%',
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
      label: {
        color: '#ecf0f1',
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Helvetica',
    },
    iconMargin: {
    marginBottom: 5
  },
    //NetWorth Styles
     netWorthInputContainer: {
        marginBottom: 15,
    },
    netWorthResult: {
        marginTop: 10,
        alignItems: 'center',
    },
    netWorthText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 10,
        fontFamily: 'Helvetica',
    },
    chart: {
    marginVertical: 8,
    borderRadius: 16
  },
    interestRateInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Slightly darker background
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  }
});
