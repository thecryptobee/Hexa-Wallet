import React from "react";
import { colors } from "../constants/Constants";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

// import { SvgIcon } from "@up-shared/components";
// //localization
// import { localization } from "HexaWallet/src/app/manage/Localization/i18n";

//TODO: RestoreAndWalletSetupScreen
//import { OnBoarding } from "hexaCompLanch";
import { OnBoarding } from "hexaCompLanch";

import { PasscodeConfirm, Passcode } from "hexaCompPasscode";


//  Restore And Wallet Setup
import {
  RestoreAndReoverWallet, WalletSetup,
  PermissionAndroid
} from "hexaCompRestoreAndWalletSetup";



//  Restore Wallet using Mnemonic
import { RestoreWalletUsingMnemonic } from "hexaCompRestoreWalletUsingMnemonic";

//  Restore Wallet using Trusted Contact
import {
  RestoreWalletUsingTrustedContact, RestoreAllContactList,
  RestoreSelectedContactsList, RestoreWalletUsingTrustedContactQueAndAnw,
  RestoreTrustedContactsShare, RestoreTrustedContactsQRCodeScanScreen,
  Restore3SelfShare, Restore3SelfSahreQRCodeScanner, Restore4And5SelfShare,
  Restore4And5SelfShareQRCodeScanner
} from "hexaCompRestoreWalletUsingTrustedContact";

//  More
import { More, ContactSharedSecretList, TrustedPartySelfShareQRCode, TrsutedPartyQRCode } from "hexaCompTabbarMore";

// TODO: QrcodeScan  
import { QrCodeScanner } from "hexaCompTabbarQrCodeScanner";

//  TODO: Wallet  
import { Wallet } from "hexaCompTabbarWallet";

//  TODO: All Transaction     
import { AllTransaction } from "hexaCompTabbarAllTransaction";

// TODO: Backup your Wallet 
import {
  AllContactList, SecretSharing, TrustedContact, ShareSecretViaQR,
  SelectContactListAssociatePerson, TrustedContactAcceptOtp
} from "hexaCompBackUpYourWallet";

// TODO: Settings    
import { Settings, AdvancedSettings, MnemonicDisplay } from "hexaCompSettings";

// TODO: Backup Wallet Mnemonic Screen
import { BackupWalletMnemonic, BackupWalletMnemonicConfirmMnemonic } from "hexaCompBackupWalletMnemonic";

// TODO: Common Screen   
import { QRCode, OTP, QRCodeScan, OTPBackupShareStore } from "hexaCompCommon";

// TODO: Backup Secure Account
import { BackupSecureAccount } from "hexaCompBackupSecureAccount";



// TODO: Health of the App
import {
  HealthOfTheApp, BackupSecretQuestions, BackupSecureTwoFactorAuto,
  HealthCheckMnemonic, SelfShareUsingWalletQRCode, SelfShareSharing, ConfirmSelfShareQRScanner
} from "hexaCompHealthOfTheApp";


// TODO: Payment Screen
import { ReceivePayment, SendPayment, ConfirmAndSendPayment, SendPaymentAddressScan } from "hexaCompPayment";


// TODO: Account Transaction Screen
import { Transaction } from "hexaCompTransaction";



//TODO: StackNavigator:ONBoarding
const OnBoardingStackNavigator = createStackNavigator(
  {
    OnBoarding: {
      screen: OnBoarding,
      navigationOptions: { header: null }
    }
  },
  {
    initialRouteName: "OnBoarding"
  }
);


// //TODO: StackNavigator
// const AccountSSNavigator = createStackNavigator(
//   {
//     AccountSS1: {
//       screen: AccountSS1,
//       navigationOptions: { header: null }
//     },
//     AccountSS2: {
//       screen: AccountSS2,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "AccountSS1"
//   }
// );

// const ContactSSNavigator = createStackNavigator(
//   {
//     ContactSS1: {
//       screen: ContactSS1,
//       navigationOptions: { header: null }
//     },
//     ContactSS2: {
//       screen: ContactSS2,
//       navigationOptions: { header: null }
//     },
//     ContactSS3: {
//       screen: ContactSS3,
//       navigationOptions: { header: null }
//     }
//   },
//   { initialRouteName: "ContactSS1" }
// );




// const RestoreWalletUsingMnemonicStackNavigator = createStackNavigator(
//   {
//     RestoreWalletUsingMnemonicScrren: {
//       screen: RestoreWalletUsingMnemonicScrren,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "RestoreWalletUsingMnemonicScrren"
//   }
// );

// const RestoreWalletUsingTrustedContactStackNavigator = createStackNavigator(
//   {
//     RestoreWalletUsingTrustedContactScreen: {
//       screen: RestoreWalletUsingTrustedContactScreen,
//       navigationOptions: { header: null }
//     },
//     RestoreSelectedContactsListScreen: {
//       screen: RestoreSelectedContactsListScreen,
//       navigationOptions: { header: null }
//     },
//     RestoreAllContactListScreen: {
//       screen: RestoreAllContactListScreen,
//       navigationOptions: { header: null }
//     },
//     RestoreTrustedContactsShareScreen: {
//       screen: RestoreTrustedContactsShareScreen,
//       navigationOptions: { header: null }
//     },
//     RestoreTrustedContactsQRCodeScanScreen: {
//       screen: RestoreTrustedContactsQRCodeScanScreen,
//       navigationOptions: { header: null }
//     },
//     Restore3SelfShareScreen: {
//       screen: Restore3SelfShareScreen,
//       navigationOptions: { header: null }
//     },
//     Restore3SelfSahreQRCodeScannerScreen: {
//       screen: Restore3SelfSahreQRCodeScannerScreen,
//       navigationOptions: { header: null }
//     },
//     Restore4And5SelfShareScreen: {
//       screen: Restore4And5SelfShareScreen,
//       navigationOptions: { header: null }
//     },
//     Restore4And5SelfShareQRCodeScanner: {
//       screen: Restore4And5SelfShareQRCodeScanner,
//       navigationOptions: { header: null }
//     },
//     RestoreWalletUsingTrustedContactQueAndAnwScreen: {
//       screen: RestoreWalletUsingTrustedContactQueAndAnwScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "RestoreSelectedContactsListScreen"
//   }
// );


// const RestoreWalletUsingTrustedContactAndroidStackNavigator = createStackNavigator(
//   {
//     PermissionAndroidScreen: {
//       screen: PermissionAndroidScreen,
//       navigationOptions: { header: null }
//     },
//     RestoreWalletUsingTrustedContactScreen: {
//       screen: RestoreWalletUsingTrustedContactScreen,
//       navigationOptions: { header: null }
//     },
//     RestoreSelectedContactsListScreen: {
//       screen: RestoreSelectedContactsListScreen,
//       navigationOptions: { header: null }
//     },
//     RestoreAllContactListScreen: {
//       screen: RestoreAllContactListScreen,
//       navigationOptions: { header: null }
//     },
//     RestoreTrustedContactsShareScreen: {
//       screen: RestoreTrustedContactsShareScreen,
//       navigationOptions: { header: null }
//     },
//     RestoreTrustedContactsQRCodeScanScreen: {
//       screen: RestoreTrustedContactsQRCodeScanScreen,
//       navigationOptions: { header: null }
//     },
//     Restore3SelfShareScreen: {
//       screen: Restore3SelfShareScreen,
//       navigationOptions: { header: null }
//     },
//     Restore3SelfSahreQRCodeScannerScreen: {
//       screen: Restore3SelfSahreQRCodeScannerScreen,
//       navigationOptions: { header: null }
//     },
//     Restore4And5SelfShareScreen: {
//       screen: Restore4And5SelfShareScreen,
//       navigationOptions: { header: null }
//     },
//     Restore4And5SelfShareQRCodeScanner: {
//       screen: Restore4And5SelfShareQRCodeScanner,
//       navigationOptions: { header: null }
//     },
//     RestoreWalletUsingTrustedContactQueAndAnwScreen: {
//       screen: RestoreWalletUsingTrustedContactQueAndAnwScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "PermissionAndroidScreen"
//   }
// );


// const RestoreAndWalletSetupStackNavigator = createStackNavigator(
//   {
//     RestoreAndReoverWalletScreen: {
//       screen: RestoreAndReoverWalletScreen,
//       navigationOptions: { header: null }
//     },
//     WalletSetupScreens: {
//       screen: WalletSetupScreens,
//       navigationOptions: { header: null }
//     },
//     PermissionAndroidScreen: {
//       screen: PermissionAndroidScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "RestoreAndReoverWalletScreen"
//   }
// );

// const TrustedPartyShareSecretStackNavigator = createStackNavigator(
//   {
//     ContactSharedSecretList: {
//       screen: ContactSharedSecretList,
//       navigationOptions: {
//         header: null,
//         tabBarVisible: false
//       }
//     },
//     TrustedPartySelfShareQRCode: {
//       screen: TrustedPartySelfShareQRCode,
//       navigationOptions: { header: null }
//     },
//     TrsutedPartyQRCodeScreen: {
//       screen: TrsutedPartyQRCodeScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "ContactSharedSecretList"
//   }
// );

// //TODO: FirstTimeWalletSetupStackNavigatorRouter
// const BackUpYourWalletStackNavigatorRouter = createStackNavigator(
//   {
//     AllContactListScreen: {
//       screen: AllContactListScreen,
//       navigationOptions: { header: null }
//     },
//     SecretSharingScreen: {
//       screen: SecretSharingScreen,
//       navigationOptions: { header: null }
//     },
//     TrustedContactScreen: {
//       screen: TrustedContactScreen,
//       navigationOptions: { header: null }
//     },
//     ShareSecretViaQRScreen: {
//       screen: ShareSecretViaQRScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "AllContactListScreen"
//   }
// );

// const BackUpYourWalletSecoundTimeStackNavigatorRouter = createStackNavigator(
//   {
//     SecretSharingScreen: {
//       screen: SecretSharingScreen,
//       navigationOptions: { header: null }
//     },
//     TrustedContactScreen: {
//       screen: TrustedContactScreen,
//       navigationOptions: { header: null }
//     },
//     ShareSecretViaQRScreen: {
//       screen: ShareSecretViaQRScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "SecretSharingScreen"
//   }
// );

// const TrustedContactStackNavigator = createStackNavigator(
//   {
//     TrustedContactScreen: {
//       screen: TrustedContactScreen,
//       navigationOptions: { header: null }
//     },
//     ShareSecretViaQRScreen: {
//       screen: ShareSecretViaQRScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "TrustedContactScreen"
//   }
// );

// const BackupTrustedPartrySecretStoreStackNavigator = createStackNavigator(
//   {
//     SelectContactListAssociatePerson: {
//       screen: SelectContactListAssociatePerson,
//       navigationOptions: { header: null }
//     },
//     TrustedContactAcceptOtpScreen: {
//       screen: TrustedContactAcceptOtpScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "SelectContactListAssociatePerson"
//   }
// );

// //TODO: SettingsScreen
// const SettingsStackNavigator = createStackNavigator(
//   {
//     SettingsScreen: {
//       screen: SettingsScreen,
//       navigationOptions: { header: null }
//     },
//     BackupWalletMnemonicScreen: {
//       screen: BackupWalletMnemonicScreen,
//       navigationOptions: { header: null }
//     },
//     BackupWalletMnemonicConfirmMnemonicScreen: {
//       screen: BackupWalletMnemonicConfirmMnemonicScreen,
//       navigationOptions: { header: null }
//     },
//     AdvancedSettingsScreen: {
//       screen: AdvancedSettingsScreen,
//       navigationOptions: { header: null }
//     },
//     MnemonicDisplayScreen: {
//       screen: MnemonicDisplayScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "AdvancedSettingsScreen"
//   }
// );

// //TODO: HealthOfTheScreen Stack Navigator
// const HealthOfTheAppStackNavigator = createStackNavigator(
//   {
//     HealthOfTheAppScreen: {
//       screen: HealthOfTheAppScreen,
//       navigationOptions: { header: null }
//     },
//     BackupSecretQuestionsScreen: {
//       screen: BackupSecretQuestionsScreen,
//       navigationOptions: { header: null }
//     },
//     BackupSecureTwoFactorAutoScreen: {
//       screen: BackupSecureTwoFactorAutoScreen,
//       navigationOptions: { header: null }
//     },
//     HealthCheckMnemonicScreen: {
//       screen: HealthCheckMnemonicScreen,
//       navigationOptions: { header: null }
//     },
//     SelfShareUsingWalletQRCode: {
//       screen: SelfShareUsingWalletQRCode,
//       navigationOptions: { header: null }
//     },
//     SelfShareSharingScreen: {
//       screen: SelfShareSharingScreen,
//       navigationOptions: { header: null }
//     },
//     ConfirmSelfShareQRScannerScreen: {
//       screen: ConfirmSelfShareQRScannerScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "HealthOfTheAppScreen"
//   }
// );

// //TODO: Backup Secure Account Stack Navigator

// const BackupSecureAccountWithPdfStackNavigator = createStackNavigator(
//   {
//     BackupSecureAccountScreen: {
//       screen: BackupSecureAccountScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "BackupSecureAccountScreen"
//   }
// );

// //TODO: Restore Secure Account Stack Navigator
// const ResotreSecureAccountStackNavigator = createStackNavigator(
//   {
//     RestoreSecureAccountScreen: {
//       screen: RestoreSecureAccountScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "RestoreSecureAccountScreen"
//   }
// );

// //TODO: Payment Navigation
// //Receive Payment Stack Navigator
// const ReceivePaymentStackNavigator = createStackNavigator(
//   {
//     ReceivePaymentScreen: {
//       screen: ReceivePaymentScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "ReceivePaymentScreen"
//   }
// );

// //Send Payment Stack Navigator
// const SendPaymentStackNavigator = createStackNavigator(
//   {
//     SendPaymentScreen: {
//       screen: SendPaymentScreen,
//       navigationOptions: { header: null }
//     },
//     ConfirmAndSendPaymentScreen: {
//       screen: ConfirmAndSendPaymentScreen,
//       navigationOptions: { header: null }
//     },
//     SendPaymentAddressScanScreen: {
//       screen: SendPaymentAddressScanScreen,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "SendPaymentScreen"
//   }
// );

// //TODO: Account Transaction StackNavigator
// const AccountTransactionStackNavigator = createStackNavigator(
//   {
//     TransactionScreen: {
//       screen: TransactionScreen,
//       navigationOptions: { header: null }
//     },
//     RecieveNavigation: {
//       screen: ReceivePaymentStackNavigator,
//       navigationOptions: { header: null }
//     },
//     SendPaymentNavigation: {
//       screen: SendPaymentStackNavigator,
//       navigationOptions: { header: null }
//     }
//   },
//   {
//     initialRouteName: "TransactionScreen"
//   }
// );

// //TODO: TabNavigator
// //TODO: TabNavigator:TabNavigator
// const TabNavigator = createBottomTabNavigator(
//   {
//     WalletScreen: {
//       screen: WalletScreen, //PaymentScreen,
//       navigationOptions: {
//         tabBarLabel: "Wallet", //localization("TabBarItem.Payment"),
//         drawerLockMode: "locked-open",
//         tabBarIcon: ( { tintColor } ) => (
//           <SvgIcon name="wallet" color={ tintColor } size={ 22 } />
//         )
//       }
//     },
//     AllTransactionScreen: {
//       screen: AllTransactionScreen,
//       navigationOptions: {
//         tabBarLabel: "Transaction", //localization("TabBarItem.Analytics"),
//         tabBarIcon: ( { tintColor } ) => (
//           <SvgIcon name="icon_transactions" color={ tintColor } size={ 22 } />
//         )
//       }
//     },
//     QrCodeScannerScreen: {
//       screen: QrCodeScannerScreen,
//       navigationOptions: {
//         tabBarLabel: "QR", //localization("TabBarItem.Accounts"),
//         tabBarIcon: ( { tintColor } ) => (
//           <SvgIcon name="qr-codes" color={ tintColor } size={ 22 } />
//         )
//       }
//     },

//     More: {
//       screen: MoreScreen,
//       navigationOptions: {
//         tabBarLabel: "More", //localization("TabBarItem.More"),
//         tabBarIcon: ( { tintColor } ) => (
//           <SvgIcon name="more-icon" color={ tintColor } size={ 22 } />
//         )
//       }
//     }
//   },
//   {
//     initialRouteName: "WalletScreen",
//     tabBarOptions: {
//       showLabel: true,
//       //swipeEnabled: true,
//       showIcon: true,
//       activeTintColor: colors.appColor,
//       labelStyle: {
//         fontSize: 11,
//         fontFamily: "FiraSans-Medium"
//       },
//       style: {
//         backgroundColor: "#ffffff"
//       },
//       tabStyle: {}
//     }
//   }
// );

//TODO: RootNavigator
//TODO: RootNavigator:createRootNavigator
export const createRootNavigator = (
  signedIn = false,
  screenName = "PasscodeScreen"
) => {
  return createStackNavigator(
    {
      OnBoardingNavigator: {
        screen: OnBoardingStackNavigator,
        navigationOptions: { header: null }
      },
      PasscodeConfirmScreen: {
        screen: PasscodeConfirm,
        navigationOptions: { header: null }
      },
      PasscodeScreen: {
        screen: Passcode,
        navigationOptions: { header: null }
      },
      // AccountSSNavigator: {
      //   screen: AccountSSNavigator,
      //   navigationOptions: { header: null }
      // },
      // ContactSSNavigator: {
      //   screen: ContactSSNavigator,
      //   navigationOptions: { header: null }
      // },
      // RestoreAndWalletSetupNavigator: {
      //   screen: RestoreAndWalletSetupStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // RestoreWalletUsingMnemonicNavigator: {
      //   screen: RestoreWalletUsingMnemonicStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // RestoreWalletUsingTrustedContactNavigator: {
      //   screen: RestoreWalletUsingTrustedContactStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // RestoreWalletUsingTrustedContactAndroidNavigator: {
      //   screen: RestoreWalletUsingTrustedContactAndroidStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // TabbarBottom: {
      //   screen: TabNavigator,
      //   navigationOptions: { header: null }
      // },
      // BackUpYourWalletNavigator: {
      //   screen: BackUpYourWalletStackNavigatorRouter,
      //   navigationOptions: { header: null }
      // },
      // BackUpYourWalletSecoundTimeNavigator: {
      //   screen: BackUpYourWalletSecoundTimeStackNavigatorRouter,
      //   navigationOptions: { header: null }
      // },
      // BackupTrustedPartrySecretNavigator: {
      //   screen: BackupTrustedPartrySecretStoreStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // //also use deepling url navigaton
      // TrustedPartyShareSecretNavigator: {
      //   screen: TrustedPartyShareSecretStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // //TODO: Common Screens
      // OTPScreenNavigator: {
      //   screen: OTPScreen,
      //   navigationOptions: { header: null }
      // },
      // OTPBackupShareStoreNavigator: {
      //   screen: OTPBackupShareStore,
      //   navigationOptions: { header: null }
      // },
      // //TODO: Settings
      // SettingsNavigator: {
      //   screen: SettingsStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // //TODO: HealthOfTheApp
      // HealthOfTheAppNavigator: {
      //   screen: HealthOfTheAppStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // TrustedContactNavigator: {
      //   screen: TrustedContactStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // //TODO: Backup Secure Account
      // BackupSecureAccountWithPdfNavigator: {
      //   screen: BackupSecureAccountWithPdfStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // //TODO: Restore Secure Account
      // ResotreSecureAccountNavigator: {
      //   screen: ResotreSecureAccountStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // //TODO: Payment Navigation
      // //ReceivePayment
      // ReceivePaymentNavigator: {
      //   screen: ReceivePaymentStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // //SentPayment
      // SendPaymentNavigator: {
      //   screen: SendPaymentStackNavigator,
      //   navigationOptions: { header: null }
      // },
      // //TODO: Transaction Navigation
      // AccountTransactionNavigator: {
      //   screen: AccountTransactionStackNavigator,
      //   navigationOptions: { header: null }
      // }
    },
    {
      //initialRouteName: signedIn ? "OnBoardingNavigator" : PasscodeConfirmScreen
      initialRouteName: signedIn ? "OnBoardingNavigator" : screenName //"TabbarBottom" //
    }
  );
};
