import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AddNewDonationAccountDetailsScreen from '../../../pages/Accounts/AddNew/DonationAccount/AddNewDonationAccountDetailsScreen'
import NewHexaAccountDetailsScreen from '../../../pages/Accounts/AddNew/HexaAccount/NewHexaAccountDetailsScreen'
import NewAccountSelectionContainerScreen from '../../../pages/Accounts/AddNew/NewAccountSelectionContainerScreen'
import NewRampAccountDetailsScreen from '../../../pages/Accounts/AddNew/RampAccount/NewRampAccountDetailsScreen'
import NewSwanAccountDetailsScreen from '../../../pages/Accounts/AddNew/SwanAccount/NewSwanAccountDetailsScreen'
import TransactionDetailsContainerScreen from '../../../pages/Accounts/Transactions/TransactionDetailsContainerScreen'
import AccountDetailsStack from '../accounts/AccountDetailsStack'

const Stack = createNativeStackNavigator()
export default function AddNewAccountStack() {
  return (
    <Stack.Navigator
      initialRouteName='AccountSelectionList'
    >
      <Stack.Screen name="AccountSelectionList" component={NewAccountSelectionContainerScreen} options={{
        header: null
      }} />
      <Stack.Screen name="NewHexaAccountDetails" component={NewHexaAccountDetailsScreen} options={{
        title: 'Setup New Account'
      }} />
      <Stack.Screen name="AccountDetails" component={AccountDetailsStack} options={{
        header: null
      }} />
      <Stack.Screen name="NewRampAccountDetails" component={NewRampAccountDetailsScreen} options={{
        title: 'Setup Ramp Account'
      }} />
      <Stack.Screen name="NewSwanAccountDetails" component={NewSwanAccountDetailsScreen} options={{
        title: 'Setup Swan Account'
      }} />
      <Stack.Screen name="AddNewDonationAccountDetails" component={AddNewDonationAccountDetailsScreen} options={{
        header: null
      }} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetailsContainerScreen} options={{
        title: 'TransactionDetails'
      }} />
    </Stack.Navigator>
  )
}

