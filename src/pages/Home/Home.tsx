import React, { createRef, PureComponent } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  ImageBackground,
  Platform,
  AsyncStorage,
  Linking,
  Alert,
  Image,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
import TransparentHeaderModal from '../../components/TransparentHeaderModal';
import CustodianRequestRejectedModalContents from '../../components/CustodianRequestRejectedModalContents';
import SmallHeaderModal from '../../components/SmallHeaderModal';
import AddModalContents from '../../components/AddModalContents';
import { AppState } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import RNBottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Colors from '../../common/Colors';
import ButtonStyles from '../../common/Styles/ButtonStyles';
import {
  TEST_ACCOUNT,
  REGULAR_ACCOUNT,
  SECURE_ACCOUNT,
  TRUSTED_CONTACTS,
  FAST_BITCOINS,
  DONATION_ACCOUNT,
  SUB_PRIMARY_ACCOUNT,
} from '../../common/constants/serviceTypes';
import { connect } from 'react-redux';
import {
  downloadMShare,
  initHealthCheck,
  uploadRequestedShare,
} from '../../store/actions/sss';
import { createRandomString } from '../../common/CommonFunctions/timeFormatter';
import { updateAddressBookLocally } from '../../store/actions/trustedContacts';
import {
  approveTrustedContact,
  fetchEphemeralChannel,
  fetchTrustedChannel,
  clearPaymentDetails,
} from '../../store/actions/trustedContacts';
import {
  updateFCMTokens,
  fetchNotifications,
  notificationsUpdated,
} from '../../store/actions/notifications';
import { storeFbtcData } from '../../store/actions/fbtc';
import {
  setCurrencyCode,
  setCurrencyToggleValue,
  setCardData,
} from '../../store/actions/preferences';
import { getCurrencyImageByRegion } from '../../common/CommonFunctions/index';
import ErrorModalContents from '../../components/ErrorModalContents';
import ModalHeader from '../../components/ModalHeader';
import Toast from '../../components/Toast';
import firebase from 'react-native-firebase';
import NotificationListContent from '../../components/NotificationListContent';
import { timeFormatter } from '../../common/CommonFunctions/timeFormatter';
import Config from 'react-native-config';
import RelayServices from '../../bitcoin/services/RelayService';
import AddContactAddressBook from '../Contacts/AddContactAddressBook';
import config from '../../bitcoin/HexaConfig';
import TrustedContactsService from '../../bitcoin/services/TrustedContactsService';
import HomeList from '../../components/home/home-list';
import HomeHeader from '../../components/home/home-header';
import idx from 'idx';
import CustomBottomTabs, {
  BottomTab, TAB_BAR_HEIGHT,
} from '../../components/home/custom-bottom-tabs';
import { initialCardData, closingCardData } from '../../stubs/initialCardData';
import {
  fetchDerivativeAccBalTx,
  addTransferDetails,
} from '../../store/actions/accounts';
import { trustedChannelActions } from '../../bitcoin/utilities/Interface';
import moment from 'moment';
import { withNavigationFocus } from 'react-navigation';
import CustodianRequestModalContents from '../../components/CustodianRequestModalContents';
import semver from 'semver';
import {
  updatePreference,
  setFCMToken,
  setSecondaryDeviceAddress,
} from '../../store/actions/preferences';
import Bitcoin from '../../bitcoin/utilities/accounts/Bitcoin';
import Loader from '../../components/loader';
import TrustedContactRequestContent from './TrustedContactRequestContent';
import BottomSheetBackground from '../../components/bottom-sheets/BottomSheetBackground';
import BottomSheetHeader from '../Accounts/BottomSheetHeader';
import BottomSheetHandle from '../../components/bottom-sheets/BottomSheetHandle';
import { Button } from 'react-native-elements';
import checkAppVersionCompatibility from '../../utils/CheckAppVersionCompatibility';

export const BOTTOM_SHEET_OPENING_ON_LAUNCH_DELAY = 500; // milliseconds


const getIconByAccountType = (type) => {
  if (type == 'saving') {
    return require('../../assets/images/icons/icon_regular.png');
  } else if (type == 'regular' || type === REGULAR_ACCOUNT) {
    return require('../../assets/images/icons/icon_regular.png');
  } else if (type == 'secure' || type === SECURE_ACCOUNT) {
    return require('../../assets/images/icons/icon_secureaccount.png');
  } else if (type == 'test' || type === TEST_ACCOUNT) {
    return require('../../assets/images/icons/icon_test.png');
  } else if (type === DONATION_ACCOUNT) {
    return require('../../assets/images/icons/icon_donation_hexa.png');
  } else {
    return require('../../assets/images/icons/icon_test.png');
  }
};

export enum BottomSheetState {
  Closed,
  Open,
}

interface HomeStateTypes {
  notificationLoading: boolean;
  notificationData?: any[];
  cardData?: any[];
  switchOn: boolean;
  CurrencyCode: string;
  balances: any;
  selectedBottomTab: BottomTab | null;

  /// TODO: remove the `new` prefix when all bottom sheets are refactored to use the `@gorhom/bottom-sheet` library
  newBottomSheetState: BottomSheetState;

  secondaryDeviceOtp: any;
  currencyCode: string;
  errorMessageHeader: string;
  errorMessage: string;
  buttonText: string;
  selectedContact: any[];
  notificationDataChange: boolean;
  appState: string;
  fbBTCAccount: any;
  trustedContactRequest: any;
  recoveryRequest: any;
  custodyRequest: any;
  isLoadContacts: boolean;
  lastActiveTime: string;
  isLoading: boolean;
  isBalanceLoading: boolean;
}

interface HomePropsTypes {
  navigation: any;
  notificationList: any[];
  exchangeRates: any[];
  accounts: any[];
  walletName: string;
  UNDER_CUSTODY: any;
  fetchNotifications: any;
  updateFCMTokens: any;
  downloadMShare: any;
  approveTrustedContact: any;
  fetchTrustedChannel: any;
  fetchEphemeralChannel: any;
  uploadRequestedShare: any;
  s3Service: any;
  initHealthCheck: any;
  overallHealth: any;
  fetchDerivativeAccBalTx: any;
  addTransferDetails: any;
  paymentDetails: any;
  clearPaymentDetails: any;
  trustedContacts: TrustedContactsService;
  isFocused: boolean;
  notificationListNew: any;
  notificationsUpdated: any;
  FBTCAccountData: any;
  storeFbtcData: any;
  setCurrencyCode: any;
  currencyCode: any;
  setCurrencyToggleValue: any;
  currencyToggleValue: any;
  updatePreference: any;
  fcmTokenValue: any;
  setFCMToken: any;
  setSecondaryDeviceAddress: any;
  secondaryDeviceAddressValue: any;
  releaseCasesValue: any;
  setCardData: any;
  cardDataProps: any;
}

class Home extends PureComponent<HomePropsTypes, HomeStateTypes> {
  focusListener: any;
  appStateListener: any;
  firebaseNotificationListener: any;
  notificationOpenedListener: any;

  openBottomSheetOnLaunchTimeout: null | ReturnType<typeof setTimeout>;

  addTabBarBottomSheetRef = createRef<RNBottomSheet>();

  // TODO: Completely replace `BottomSheet` with `RNBottomSheet` a la the refs above (https://trello.com/c/boUNRk6t)
  trustedContactRequestBottomSheetRef = createRef<BottomSheet>();
  custodianRequestBottomSheetRef = createRef<BottomSheet>();
  errorBottomSheetRef = createRef<BottomSheet>();
  addContactAddressBookBottomSheetRef = createRef<BottomSheet>();
  notificationsListBottomSheetRef = createRef<BottomSheet>();
  custodianRequestRejectedBottomSheetRef = createRef<BottomSheet>();

  static whyDidYouRender = true;

  constructor(props) {
    super(props);

    this.focusListener = null;
    this.appStateListener = null;
    this.openBottomSheetOnLaunchTimeout = null;

    this.state = {
      notificationData: [],
      cardData: [],
      switchOn: false,
      CurrencyCode: 'USD',
      balances: {},
      selectedBottomTab: null,
      newBottomSheetState: BottomSheetState.Closed,
      secondaryDeviceOtp: {},
      currencyCode: 'USD',
      errorMessageHeader: '',
      errorMessage: '',
      buttonText: '',
      selectedContact: [],
      notificationDataChange: false,
      appState: '',
      fbBTCAccount: {},
      trustedContactRequest: null,
      recoveryRequest: null,
      custodyRequest: null,
      isLoadContacts: false,
      lastActiveTime: moment().toISOString(),
      notificationLoading: true,
      isLoading: false,
      isBalanceLoading: true,
    };
  }

  onPressNotifications = async () => {
    let notificationList = JSON.parse(
      await AsyncStorage.getItem('notificationList'),
    );
    let tmpList = [];
    if (notificationList) {
      for (let i = 0; i < notificationList.length; i++) {
        const element = notificationList[i];
        let obj = {
          ...element,
          read: element.isMandatory ? false : true,
        };
        tmpList.push(obj);
      }
    }
    await AsyncStorage.setItem('notificationList', JSON.stringify(tmpList));
    tmpList.sort(function (left, right) {
      return moment.utc(right.date).unix() - moment.utc(left.date).unix();
    });
    this.setState({
      notificationData: tmpList,
      notificationDataChange: !this.state.notificationDataChange,
    });
    setTimeout(() => {
      this.setState({ notificationLoading: false });
    }, 500);

    this.notificationsListBottomSheetRef.current?.snapTo(1);
  };

  onSwitchToggle = (switchOn) => {
    this.setState({
      switchOn,
    });
  };

  processQRData = async (qrData) => {
    const { accounts, addTransferDetails, navigation } = this.props;

    const network = Bitcoin.networkType(qrData);
    if (network) {
      const serviceType =
        network === 'MAINNET' ? REGULAR_ACCOUNT : TEST_ACCOUNT; // default service type

      const service = accounts[serviceType].service;
      const { type } = service.addressDiff(qrData);
      if (type) {
        let item;
        switch (type) {
          case 'address':
            const recipientAddress = qrData;
            item = {
              id: recipientAddress,
            };

            addTransferDetails(serviceType, {
              selectedContact: item,
            });
            navigation.navigate('SendToContact', {
              selectedContact: item,
              serviceType,
            });
            break;

          case 'paymentURI':
            let address, options, donationId;
            try {
              const res = service.decodePaymentURI(qrData);
              address = res.address;
              options = res.options;

              // checking for donationId to send note
              if (options && options.message) {
                const rawMessage = options.message;
                donationId = rawMessage.split(':').pop().trim();
              }
            } catch (err) {
              Alert.alert('Unable to decode payment URI');
              return;
            }

            item = {
              id: address,
            };

            addTransferDetails(serviceType, {
              selectedContact: item,
            });

            navigation.navigate('SendToContact', {
              selectedContact: item,
              serviceType,
              bitcoinAmount: options.amount
                ? `${Math.round(options.amount * 1e8)}`
                : '',
              donationId,
            });
            break;

          default:
            Toast('Invalid QR');
            break;
        }

        return;
      }
    }

    try {
      const scannedData = JSON.parse(qrData);

      if (scannedData.ver) {
        const isAppVersionCompatible = await checkAppVersionCompatibility({
          relayCheckMethod: scannedData.type,
          version: scannedData.ver,
        });

        if (!isAppVersionCompatible) {
          return;
        }
      }

      switch (scannedData.type) {
        case 'trustedGuardian':
          const trustedGuardianRequest = {
            isGuardian: scannedData.isGuardian,
            approvedTC: scannedData.approvedTC,
            requester: scannedData.requester,
            publicKey: scannedData.publicKey,
            info: scannedData.info,
            uploadedAt: scannedData.uploadedAt,
            type: scannedData.type,
            isQR: true,
            version: scannedData.ver,
          };
          this.setState(
            {
              isLoading: false,
              secondaryDeviceOtp: trustedGuardianRequest,
              trustedContactRequest: trustedGuardianRequest,
              recoveryRequest: null,
              isLoadContacts: true,
            },
            () => {
              navigation.goBack();

              this.openBottomSheetOnLaunch(this.trustedContactRequestBottomSheetRef);
            },
          );

          break;

        case 'secondaryDeviceGuardian':
          const secondaryDeviceGuardianRequest = {
            isGuardian: scannedData.isGuardian,
            requester: scannedData.requester,
            publicKey: scannedData.publicKey,
            info: scannedData.info,
            uploadedAt: scannedData.uploadedAt,
            type: scannedData.type,
            isQR: true,
            version: scannedData.ver,
          };

          this.setState(
            {
              isLoading: false,
              secondaryDeviceOtp: secondaryDeviceGuardianRequest,
              trustedContactRequest: secondaryDeviceGuardianRequest,
              recoveryRequest: null,
            },
            () => {
              this.openBottomSheetOnLaunch(this.trustedContactRequestBottomSheetRef);
            },
          );

          break;

        case 'trustedContactQR':
          const tcRequest = {
            requester: scannedData.requester,
            publicKey: scannedData.publicKey,
            info: scannedData.info,
            type: scannedData.type,
            isQR: true,
            version: scannedData.ver,
          };

          this.setState(
            {
              isLoading: false,
              secondaryDeviceOtp: tcRequest,
              trustedContactRequest: tcRequest,
              recoveryRequest: null,
            },
            () => {
              this.openBottomSheetOnLaunch(this.trustedContactRequestBottomSheetRef);
            },
          );

          break;

        case 'paymentTrustedContactQR':
          const paymentTCRequest = {
            isPaymentRequest: true,
            requester: scannedData.requester,
            publicKey: scannedData.publicKey,
            info: scannedData.info,
            type: scannedData.type,
            isQR: true,
            version: scannedData.ver,
          };

          this.setState(
            {
              isLoading: false,
              secondaryDeviceOtp: paymentTCRequest,
              trustedContactRequest: paymentTCRequest,
              recoveryRequest: null,
            },
            () => {
              this.openBottomSheetOnLaunch(this.trustedContactRequestBottomSheetRef);
            },
          );

          break;

        case 'recoveryQR':
          const recoveryRequest = {
            isRecovery: true,
            requester: scannedData.requester,
            publicKey: scannedData.KEY,
            isQR: true,
          };
          this.setState(
            {
              isLoading: false,
              recoveryRequest: recoveryRequest,
              trustedContactRequest: null,
            },
            () => {
              this.openBottomSheetOnLaunch(this.trustedContactRequestBottomSheetRef);
            },
          );
          break;

        case 'ReverseRecoveryQR':
          Alert.alert(
            'Restoration QR Identified',
            'Restoration QR only works during restoration mode',
          );
          break;

        default:
          break;
      }
    } catch (err) {
      console.log(err);
      Toast('Invalid QR');
    }
  };

  setAccountCardData = (newCardData) => {
    let newArrayFinal = [];
    let tempArray = [];
    for (let a = 0; a < newCardData.length; a++) {
      tempArray.push(newCardData[a]);
      if (
        tempArray.length == 2 ||
        newCardData[newCardData.length - 1].id == tempArray[0].id
      ) {
        newArrayFinal.push(tempArray);
        tempArray = [];
      }
    }
    if (newArrayFinal) {
      this.setState({
        cardData: newArrayFinal,
      });
    }
  };

  updateAccountCardData = () => {
    let { accounts } = this.props;
    const defaultCardData = initialCardData;
    let idIndex = initialCardData.length;
    const allCards = [];
    const additionalCardData = [];
    for (const serviceType of [REGULAR_ACCOUNT, SECURE_ACCOUNT]) {
      const derivativeAccounts =
        accounts[serviceType].service[
          serviceType === SECURE_ACCOUNT ? 'secureHDWallet' : 'hdWallet'
        ].derivativeAccounts;

      for (const carouselAcc of config.EJECTED_ACCOUNTS) {
        if (!derivativeAccounts[carouselAcc]) continue;

        for (
          let index = 1;
          index <= derivativeAccounts[carouselAcc].instance.using;
          index++
        ) {
          const account = derivativeAccounts[carouselAcc][index];
          idIndex++;

          let title = '';
          switch (carouselAcc) {
            case DONATION_ACCOUNT:
              title = account.subject ? account.subject : 'Donation Account';
              break;

            case SUB_PRIMARY_ACCOUNT:
              if (serviceType === REGULAR_ACCOUNT)
                title = account.accountName
                  ? account.accountName
                  : 'Checking Account';
              else if (serviceType === SECURE_ACCOUNT)
                title = account.accountName
                  ? account.accountName
                  : 'Savings Account';
              break;
          }

          const carouselInstance = {
            id: idIndex,
            title,
            unit: 'sats',
            amount: account.balances
              ? account.balances.balance + account.balances.unconfirmedBalance
              : 0,
            account:
              carouselAcc === DONATION_ACCOUNT
                ? `Accept bitcoin`
                : serviceType === REGULAR_ACCOUNT
                  ? 'User Checking Account'
                  : 'User Savings Account',
            accountType: serviceType,
            subType: carouselAcc,
            bitcoinicon: require('../../assets/images/icons/icon_bitcoin_test.png'),
          };
          additionalCardData.push(carouselInstance);
        }
      }
    }

    allCards.push(...defaultCardData, ...additionalCardData);
    this.props.setCardData(allCards);
    this.setAccountCardData([
      ...defaultCardData,
      ...additionalCardData,
      ...closingCardData,
    ]);
  };

  scheduleNotification = async () => {
    const channelId = new firebase.notifications.Android.Channel(
      'Default',
      'Default',
      firebase.notifications.Android.Importance.High,
    );
    firebase.notifications().android.createChannel(channelId);
    const notification = new firebase.notifications.Notification()
      .setTitle('We have not seen you in a while!')
      .setBody(
        'Opening your app regularly ensures you get all the notifications and security updates',
      )
      .setNotificationId('1')
      .setSound('default')
      .setData({
        title: 'We have not seen you in a while!',
        body:
          'Opening your app regularly ensures you get all the notifications and security updates',
      })
      .android.setChannelId('reminder')
      .android.setPriority(firebase.notifications.Android.Priority.High);

    // Schedule the notification for 2hours on development and 2 weeks on Production in the future
    const date = new Date();
    date.setHours(date.getHours() + Number(Config.NOTIFICATION_HOUR));

    // //console.log('DATE', date, Config.NOTIFICATION_HOUR, date.getTime());
    await firebase
      .notifications()
      .scheduleNotification(notification, {
        fireDate: date.getTime(),
        //repeatInterval: 'hour',
      })
      .then(() => { })
      .catch(
        (err) => { }, //console.log('err', err)
      );
    firebase
      .notifications()
      .getScheduledNotifications()
      .then((notifications) => {
        //console.log('logging notifications', notifications);
      });
  };

  onAppStateChange = async (nextAppState) => {
    const { appState } = this.state;
    try {
      if (appState === nextAppState) return;
      this.setState(
        {
          appState: nextAppState,
        },
        async () => {
          if (nextAppState === 'active') {
            this.scheduleNotification();
          }
          if (nextAppState === 'inactive' || nextAppState == 'background') {
            this.props.updatePreference({
              key: 'hasShownNoInternetWarning',
              value: false,
            });
          }
        },
      );
    } catch (error) { }
  };

  componentDidMount = () => {
    this.closeBottomSheet();
    this.updateAccountCardData();
    this.getBalances();

    this.appStateListener = AppState.addEventListener(
      'change',
      this.onAppStateChange,
    );

    this.bootStrapNotifications();
    this.setUpFocusListener();
    this.getNewTransactionNotifications();

    // health check
    const { s3Service, initHealthCheck } = this.props;
    const { healthCheckInitialized } = s3Service.sss;
    if (!healthCheckInitialized) {
      initHealthCheck();
    }

    Linking.addEventListener('url', this.handleDeepLinkEvent);

    Linking
      .getInitialURL()
      .then(this.handleDeepLinking);

    // call this once deeplink is detected aswell
    this.handleDeepLinkModal();
  };

  getNewTransactionNotifications = async () => {
    const { notificationListNew } = this.props;
    let newTransactions = [];
    const { accounts, fetchDerivativeAccBalTx } = this.props;
    const regularAccount = accounts[REGULAR_ACCOUNT].service.hdWallet;
    const secureAccount = accounts[SECURE_ACCOUNT].service.secureHDWallet;

    let newTransactionsRegular =
      regularAccount.derivativeAccounts[FAST_BITCOINS][1] &&
      regularAccount.derivativeAccounts[FAST_BITCOINS][1].newTransactions;
    let newTransactionsSecure =
      secureAccount.derivativeAccounts[FAST_BITCOINS][1] &&
      secureAccount.derivativeAccounts[FAST_BITCOINS][1].newTransactions;

    if (newTransactionsRegular && newTransactionsRegular.length)
      newTransactions.push(...newTransactionsRegular);
    if (newTransactionsSecure && newTransactionsSecure.length)
      newTransactions.push(...newTransactionsSecure);

    if (newTransactions.length) {
      // let asyncNotification = notificationListNew;
      let asyncNotification = JSON.parse(
        await AsyncStorage.getItem('notificationList'),
      );
      let asyncNotificationList = [];
      if (asyncNotification.length) {
        asyncNotificationList = [];
        for (let i = 0; i < asyncNotification.length; i++) {
          asyncNotificationList.push(asyncNotification[i]);
        }
      }

      for (let i = 0; i < newTransactions.length; i++) {
        let present = false;
        for (const tx of asyncNotificationList) {
          if (
            tx.notificationsData &&
            newTransactions[i].txid === tx.notificationsData.txid
          )
            present = true;
        }
        if (present) continue;

        let obj = {
          type: 'contact',
          isMandatory: false,
          read: false,
          title: 'Alert from FastBitcoins',
          time: timeFormatter(moment(new Date()), moment(new Date()).valueOf()),
          date: new Date(),
          info: 'You have a new transaction',
          notificationId: createRandomString(17),
          notificationsData: newTransactions[i],
        };
        asyncNotificationList.push(obj);
        let notificationDetails = {
          id: obj.notificationId,
          title: obj.title,
          body: obj.info,
        };
        this.localNotification(notificationDetails);
      }
      //this.props.notificationsUpdated(asyncNotificationList);
      await AsyncStorage.setItem(
        'notificationList',
        JSON.stringify(asyncNotificationList),
      );
      asyncNotificationList.sort(function (left, right) {
        return moment.utc(right.date).unix() - moment.utc(left.date).unix();
      });
      setTimeout(() => {
        this.setState({
          notificationData: asyncNotificationList,
          notificationDataChange: !this.state.notificationDataChange,
        });
      }, 2);
    }
  };

  localNotification = async (notificationDetails) => {
    const notification = new firebase.notifications.Notification()
      .setTitle(notificationDetails.title)
      .setBody(notificationDetails.body)
      .setNotificationId(notificationDetails.id)
      .setSound('default')
      .setData({
        title: notificationDetails.title,
        body: notificationDetails.body,
      })
      .android.setChannelId('reminder')
      .android.setPriority(firebase.notifications.Android.Priority.High);
    // Schedule the notification for 2hours on development and 2 weeks on Production in the future
    const date = new Date();
    date.setSeconds(date.getSeconds() + 1);
    await firebase
      .notifications()
      .scheduleNotification(notification, {
        fireDate: date.getTime(),
      })
      .then(() => { })
      .catch((err) => { });
    firebase
      .notifications()
      .getScheduledNotifications()
      .then((notifications) => { });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.notificationList !== this.props.notificationList ||
      prevProps.releaseCasesValue !== this.props.releaseCasesValue
    ) {
      this.setupNotificationList();
    }

    if (prevProps.accounts !== this.props.accounts) {
      this.getBalances();
      this.getNewTransactionNotifications();
      this.updateAccountCardData();
    }

    if (prevProps.fcmTokenValue !== this.props.fcmTokenValue) {
      this.storeFCMToken();
    }

    if (
      prevProps.secondaryDeviceAddressValue !==
      this.props.secondaryDeviceAddressValue
    ) {
      this.setSecondaryDeviceAddresses();
    }

    if (this.props.paymentDetails !== null && this.props.paymentDetails) {
      const serviceType = REGULAR_ACCOUNT;
      const {
        paymentDetails,
        accounts,
        navigation,
        addTransferDetails,
        clearPaymentDetails,
      } = this.props;
      const { balances } = this.state;
      let { address, paymentURI } = paymentDetails;
      let options: any = {};
      if (paymentURI) {
        try {
          const details = accounts[serviceType].service.decodePaymentURI(
            paymentURI,
          );
          address = details.address;
          options = details.options;
        } catch (err) {
          Alert.alert('Unable to decode payment URI');
          return;
        }
      }

      const item = {
        id: address,
      };

      addTransferDetails(serviceType, {
        selectedContact: item,
      });

      clearPaymentDetails();

      navigation.navigate('SendToContact', {
        selectedContact: item,
        serviceType,
        bitcoinAmount: options.amount
          ? `${Math.round(options.amount * 1e8)}`
          : '',
      });
    }
  };

  handleDeepLinkModal = () => {
    const custodyRequest = this.props.navigation.getParam('custodyRequest');
    const recoveryRequest = this.props.navigation.getParam('recoveryRequest');
    const trustedContactRequest = this.props.navigation.getParam(
      'trustedContactRequest',
    );
    const userKey = this.props.navigation.getParam('userKey');

    if (custodyRequest) {
      this.setState(
        {
          custodyRequest,
        },
        () => {
          this.openBottomSheetOnLaunch(this.custodianRequestBottomSheetRef);
        },
      );
    } else if (recoveryRequest || trustedContactRequest) {
      this.setState(
        {
          recoveryRequest,
          trustedContactRequest,
        },
        () => {
          this.openBottomSheetOnLaunch(this.trustedContactRequestBottomSheetRef);
        },
      );
    } else if (userKey) {
      this.props.navigation.navigate('PairNewWallet', { userKey });
    }
  };

  cleanupListeners() {
    if (typeof this.focusListener === 'function') {
      this.props.navigation.removeListener('didFocus', this.focusListener);
    }

    if (typeof this.appStateListener === 'function') {
      AppState.removeEventListener('change', this.appStateListener);
    }

    Linking.removeEventListener('url', this.handleDeepLinkEvent);

    clearTimeout(this.openBottomSheetOnLaunchTimeout);
  }

  componentWillUnmount() {
    this.cleanupListeners();
  }

  openBottomSheetOnLaunch(ref: React.RefObject<BottomSheet>) {
    this.openBottomSheetOnLaunchTimeout = setTimeout(() => {
      ref.current?.snapTo(1);
    }, BOTTOM_SHEET_OPENING_ON_LAUNCH_DELAY);
  }

  handleDeepLinkEvent = async ({ url }) => {
    const { navigation, isFocused } = this.props;
    // if user is in any other screen before opening
    // deep link , we will navigate user to home first
    if (!isFocused) {
      navigation.navigate('Home');
    }

    console.log('Home::handleDeepLinkEvent::URL: ', url);

    this.handleDeepLinking(url);
  }

  handleDeepLinking = async (url: string) => {
    console.log("Home::handleDeepLinking::URL: " + url);

    const splits = url.split('/');

    if (splits[5] === 'sss') {
      const requester = splits[4];

      if (splits[6] === 'ek') {
        const custodyRequest = {
          requester,
          ek: splits[7],
          uploadedAt: splits[8],
        };

        this.setState(
          {
            custodyRequest,
          },
          () => {
            this.openBottomSheetOnLaunch(this.custodianRequestBottomSheetRef);
          },
        );
      } else if (splits[6] === 'rk') {
        const recoveryRequest = { requester, rk: splits[7] };

        this.setState(
          {
            recoveryRequest,
            trustedContactRequest: null,
          },
          () => {
            this.openBottomSheetOnLaunch(this.trustedContactRequestBottomSheetRef);
          },
        );
      }
    } else if (['tc', 'tcg', 'atcg', 'ptc'].includes(splits[4])) {
      if (splits[3] !== config.APP_STAGE) {
        Alert.alert(
          'Invalid deeplink',
          `Following deeplink could not be processed by Hexa:${config.APP_STAGE.toUpperCase()}, use Hexa:${splits[3]
          }`,
        );
      } else {
        const version = splits.pop().slice(1);

        if (version) {
          const isAppVersionCompatible = await checkAppVersionCompatibility({
            relayCheckMethod: splits[4],
            version,
          });

          if (!isAppVersionCompatible) {
            return;
          }
        }

        const trustedContactRequest = {
          isGuardian: ['tcg', 'atcg'].includes(splits[4]),
          approvedTC: splits[4] === 'atcg' ? true : false,
          isPaymentRequest: splits[4] === 'ptc' ? true : false,
          requester: splits[5],
          encryptedKey: splits[6],
          hintType: splits[7],
          hint: splits[8],
          uploadedAt: splits[9],
          version,
        };

        this.setState(
          {
            trustedContactRequest,
            recoveryRequest: null,
          },
          () => {
            this.openBottomSheetOnLaunch(this.trustedContactRequestBottomSheetRef);
          }
        );
      }
    } else if (splits[4] === 'rk') {
      const recoveryRequest = {
        isRecovery: true,
        requester: splits[5],
        encryptedKey: splits[6],
        hintType: splits[7],
        hint: splits[8],
      };

      this.setState(
        {
          recoveryRequest,
          trustedContactRequest: null,
        },
        () => {
          this.openBottomSheetOnLaunch(this.trustedContactRequestBottomSheetRef);
        },
      );
    } else if (splits[4] === 'rrk') {
      Alert.alert(
        'Restoration link Identified',
        'Restoration links only works during restoration mode',
      );
    }

    if (url.includes('fastbitcoins')) {
      const userKey = url.substr(url.lastIndexOf('/') + 1);
      this.props.navigation.navigate('PairNewWallet', { userKey });
    }
  };

  setUpFocusListener = () => {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('didFocus', () => {
      this.setCurrencyCodeFromAsync();
      this.getAssociatedContact();
      this.checkFastBitcoin();
      this.props.fetchNotifications();
      this.setState({
        lastActiveTime: moment().toISOString(),
      });
    });

    this.getAssociatedContact();
    this.setCurrencyCodeFromAsync();
    this.checkFastBitcoin();
  };


  checkFastBitcoin = async () => {
    const { FBTCAccountData } = this.props;

    let getFBTCAccount = FBTCAccountData || {};

    this.setState({ fbBTCAccount: getFBTCAccount });
  };

  setSecondaryDeviceAddresses = async () => {
    let secondaryDeviceOtpTemp = this.props.secondaryDeviceAddressValue;

    if (!secondaryDeviceOtpTemp) {
      secondaryDeviceOtpTemp = [];
    }
    if (
      secondaryDeviceOtpTemp.findIndex(
        (value) => value.otp == (this.state.secondaryDeviceOtp as any).otp,
      ) == -1
    ) {
      secondaryDeviceOtpTemp.push(this.state.secondaryDeviceOtp);
      this.props.setSecondaryDeviceAddress(secondaryDeviceOtpTemp);
    }
  };

  getAssociatedContact = async () => {
    // TODO -- need to check this
    let AssociatedContact = JSON.parse(
      await AsyncStorage.getItem('AssociatedContacts'),
    );
    this.setSecondaryDeviceAddresses();
  };

  setCurrencyCodeFromAsync = async () => {
    const { currencyCode, currencyToggleValue } = this.props;
    let currencyCodeTmp = currencyCode;
    if (!currencyCodeTmp) {
      currencyCodeTmp = await AsyncStorage.getItem('currencyCode');
    }
    if (!currencyCodeTmp) {
      this.props.setCurrencyCode(RNLocalize.getCurrencies()[0]);
      this.setState({
        currencyCode: RNLocalize.getCurrencies()[0],
      });
    } else {
      this.setState({
        currencyCode: currencyCodeTmp,
      });
    }
    let currencyToggleValueTmp = currencyToggleValue;
    if (!currencyToggleValueTmp) {
      currencyToggleValueTmp = await AsyncStorage.getItem(
        'currencyToggleValue',
      );
    }
    this.setState({
      switchOn: currencyToggleValueTmp ? true : false,
    });
  };

  bootStrapNotifications = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (!enabled) {
      await firebase
        .messaging()
        .requestPermission()
        .then(() => {
          // User has authorized
          this.createNotificationListeners();
          this.storeFCMToken();
          this.scheduleNotification();
        })
        .catch((error) => {
          // User has rejected permissions
          //console.log(
          // 'PERMISSION REQUEST :: notification permission rejected',
          //  error,
          //);
        });
    } else {
      this.createNotificationListeners();
      this.storeFCMToken();
      this.scheduleNotification();
    }
  };

  storeFCMToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    let fcmArray = [fcmToken];
    let fcmTokenFromAsync = this.props.fcmTokenValue;
    if (fcmTokenFromAsync && fcmTokenFromAsync != fcmToken) {
      this.props.setFCMToken(fcmToken);
      //TODO: Remove setItem
      await AsyncStorage.setItem('fcmToken', fcmToken);
      this.props.updateFCMTokens(fcmArray);
    } else if (!fcmTokenFromAsync) {
      this.props.setFCMToken(fcmToken);
      //TODO: Remove setItem
      await AsyncStorage.setItem('fcmToken', fcmToken);
      this.props.updateFCMTokens(fcmArray);
    }
  };

  onNotificationArrives = async (notification) => {
    this.props.fetchNotifications();
    const { title, body } = notification;
    const deviceTrayNotification = new firebase.notifications.Notification()
      .setTitle(title)
      .setBody(body)
      .setNotificationId(notification.notificationId)
      .setSound('default')
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .android.setChannelId(
        notification.android.channelId
          ? notification.android.channelId
          : 'foregroundNotification',
      ) // previously created
      .android.setAutoCancel(true); // To remove notification when tapped on it

    const channelId = new firebase.notifications.Android.Channel(
      notification.android.channelId,
      notification.android.channelId ? 'Reminder' : 'ForegroundNotification',
      firebase.notifications.Android.Importance.High,
    );
    firebase.notifications().android.createChannel(channelId);
    firebase.notifications().displayNotification(deviceTrayNotification);
  };

  createNotificationListeners = async () => {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.firebaseNotificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        this.onNotificationArrives(notification);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(async (notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.props.fetchNotifications();
        this.onNotificationOpen(notificationOpen.notification);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;

      this.props.fetchNotifications();
      this.onNotificationOpen(notificationOpen.notification);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    firebase.messaging().onMessage((message) => {
      //process data message
    });
  };

  onNotificationOpen = async (item) => {
    let content = JSON.parse(item._data.content);
    const { notificationListNew } = this.props;
    // let asyncNotificationList = notificationListNew;
    let asyncNotificationList = JSON.parse(
      await AsyncStorage.getItem('notificationList'),
    );
    if (!asyncNotificationList) {
      asyncNotificationList = [];
    }
    let readStatus = true;
    if (content.notificationType == 'release') {
      let releaseCases = this.props.releaseCasesValue;
      //JSON.parse(await AsyncStorage.getItem('releaseCases'));
      if (releaseCases.ignoreClick) {
        readStatus = true;
      } else if (releaseCases.remindMeLaterClick) {
        readStatus = false;
      } else {
        readStatus = false;
      }
    }
    let obj = {
      type: content.notificationType,
      isMandatory: false,
      read: readStatus,
      title: item.title,
      time: timeFormatter(moment(new Date()), moment(new Date()).valueOf()),
      date: new Date(),
      info: item.body,
      notificationId: content.notificationId,
    };
    asyncNotificationList.push(obj);
    // this.props.notificationsUpdated(asyncNotificationList);

    await AsyncStorage.setItem(
      'notificationList',
      JSON.stringify(asyncNotificationList),
    );
    asyncNotificationList.sort(function (left, right) {
      return moment.utc(right.date).unix() - moment.utc(left.date).unix();
    });
    this.setState({
      notificationData: asyncNotificationList,
      notificationDataChange: !this.state.notificationDataChange,
    });
    this.onPressNotifications();
  };

  getBalances = () => {
    const { accounts } = this.props;

    let testBalance = accounts[TEST_ACCOUNT].service
      ? accounts[TEST_ACCOUNT].service.hdWallet.balances.balance +
      accounts[TEST_ACCOUNT].service.hdWallet.balances.unconfirmedBalance
      : 0;

    const testTransactions = accounts[TEST_ACCOUNT].service
      ? accounts[TEST_ACCOUNT].service.hdWallet.transactions.transactionDetails
      : [];

    if (!testTransactions.length) testBalance = 10000; // hardcoding t-balance (till t-faucet saga syncs)

    let regularBalance = accounts[REGULAR_ACCOUNT].service
      ? accounts[REGULAR_ACCOUNT].service.hdWallet.balances.balance +
      accounts[REGULAR_ACCOUNT].service.hdWallet.balances.unconfirmedBalance
      : 0;

    // regular derivative accounts
    for (const dAccountType of config.DERIVATIVE_ACC_TO_SYNC) {
      const derivativeAccount =
        accounts[REGULAR_ACCOUNT].service.hdWallet.derivativeAccounts[
        dAccountType
        ];
      if (derivativeAccount && derivativeAccount.instance.using) {
        for (
          let accountNumber = 1;
          accountNumber <= derivativeAccount.instance.using;
          accountNumber++
        ) {
          if (derivativeAccount[accountNumber].balances) {
            regularBalance +=
              derivativeAccount[accountNumber].balances.balance +
              derivativeAccount[accountNumber].balances.unconfirmedBalance;
          }
        }
      }
    }

    let secureBalance = accounts[SECURE_ACCOUNT].service
      ? accounts[SECURE_ACCOUNT].service.secureHDWallet.balances.balance +
      accounts[SECURE_ACCOUNT].service.secureHDWallet.balances
        .unconfirmedBalance
      : 0;

    // secure derivative accounts
    for (const dAccountType of config.DERIVATIVE_ACC_TO_SYNC) {
      if (dAccountType === TRUSTED_CONTACTS) continue;

      const derivativeAccount =
        accounts[SECURE_ACCOUNT].service.secureHDWallet.derivativeAccounts[
        dAccountType
        ];

      if (derivativeAccount && derivativeAccount.instance.using) {
        for (
          let accountNumber = 1;
          accountNumber <= derivativeAccount.instance.using;
          accountNumber++
        ) {
          if (derivativeAccount[accountNumber].balances) {
            secureBalance +=
              derivativeAccount[accountNumber].balances.balance +
              derivativeAccount[accountNumber].balances.unconfirmedBalance;
          }
        }
      }
    }

    // donation transactions
    let additionalBalances = 0;

    for (const serviceType of [REGULAR_ACCOUNT, SECURE_ACCOUNT]) {
      const derivativeAccounts =
        accounts[serviceType].service[
          serviceType === SECURE_ACCOUNT ? 'secureHDWallet' : 'hdWallet'
        ].derivativeAccounts;

      for (const additionAcc of config.EJECTED_ACCOUNTS) {
        if (!derivativeAccounts[additionAcc]) continue;

        for (
          let index = 1;
          index <= derivativeAccounts[additionAcc].instance.using;
          index++
        ) {
          const account = derivativeAccounts[additionAcc][index];

          if (account.balances) {
            additionalBalances +=
              account.balances.balance + account.balances.unconfirmedBalance;
          }
        }
      }
    }

    const accumulativeBalance =
      regularBalance + secureBalance + additionalBalances;

    this.setState({
      balances: {
        testBalance,
        regularBalance,
        secureBalance,
        accumulativeBalance,
      },
      isBalanceLoading: false,
    });
  };

  onNotificationListOpen = async () => {
    const { notificationListNew } = this.props;
    // let asyncNotificationList = notificationListNew;
    let asyncNotificationList = JSON.parse(
      await AsyncStorage.getItem('notificationList'),
    );
    if (asyncNotificationList) {
      for (let i = 0; i < asyncNotificationList.length; i++) {
        if (asyncNotificationList[i]) {
          asyncNotificationList[i].time = timeFormatter(
            moment(new Date()),
            moment(asyncNotificationList[i].date).valueOf(),
          );
        }
      }
      // this.props.notificationsUpdated(asyncNotificationList);

      await AsyncStorage.setItem(
        'notificationList',
        JSON.stringify(asyncNotificationList),
      );
      asyncNotificationList.sort(function (left, right) {
        return moment.utc(right.date).unix() - moment.utc(left.date).unix();
      });

      this.setState({
        notificationData: asyncNotificationList,
        notificationDataChange: !this.state.notificationDataChange,
      });
    }
  };

  onPressSaveBitcoinElements = (type) => {
    const { navigation } = this.props;
    if (type == 'voucher') {
      navigation.navigate('VoucherScanner');
    } else if (type == 'existingBuyingMethods') {
      navigation.navigate('FundingSources');
    }
  };

  onTrustedContactRequestAccept = (key) => {
    this.trustedContactRequestBottomSheetRef.current?.snapTo(0);
    this.processDLRequest(key, false);
  };

  onTrustedContactReject = (key) => {
    this.trustedContactRequestBottomSheetRef.current?.snapTo(0);
  };

  onPhoneNumberChange = () => { };

  handleBottomTabSelection = (tab: BottomTab) => {
    if (tab === BottomTab.Transactions) {
      this.props.navigation.navigate('AllTransactions');
    } else if (tab === BottomTab.More) {
      this.props.navigation.navigate('MoreOptions');
    } else if (tab === BottomTab.QR) {
      this.props.navigation.navigate('QRScanner', {
        onCodeScanned: this.processQRData,
      });
    } else if (tab === BottomTab.Add) {
      this.setState(
        {
          selectedBottomTab: tab,
          newBottomSheetState: BottomSheetState.Open,
        },
        () => {
          this.addTabBarBottomSheetRef.current?.expand();
        },
      );
    }
  };

  processDLRequest = (key, rejected) => {
    const { trustedContactRequest, recoveryRequest } = this.state;
    let {
      requester,
      isGuardian,
      approvedTC,
      encryptedKey,
      publicKey,
      info,
      isQR,
      uploadedAt,
      isRecovery,
      version,
    } = trustedContactRequest || recoveryRequest;
    const {
      UNDER_CUSTODY,
      uploadRequestedShare,
      navigation,
      approveTrustedContact,
      fetchEphemeralChannel,
      fetchTrustedChannel,
      walletName,
      trustedContacts,
    } = this.props;

    if (!isRecovery) {
      if (requester === walletName) {
        Toast('Cannot be your own Contact/Guardian');
        return;
      }

      let expiry = config.TC_REQUEST_EXPIRY;
      if (!semver.valid(version)) {
        // expiry support for 0.7, 0.9 and 1.0
        expiry = config.LEGACY_TC_REQUEST_EXPIRY;
      }

      if (uploadedAt && Date.now() - uploadedAt > expiry) {
        Alert.alert(
          `${isQR ? 'QR' : 'Link'} expired!`,
          `Please ask the sender to initiate a new ${isQR ? 'QR' : 'Link'}`,
        );
        this.setState({
          isLoading: false,
        });
      } else {
        if (isGuardian && UNDER_CUSTODY[requester]) {
          Alert.alert(
            'Failed to accept',
            `You already custody a share against the wallet name: ${requester}`,
          );
          this.setState({
            isLoading: false,
          });
        } else {
          if (!publicKey) {
            try {
              publicKey = TrustedContactsService.decryptPub(encryptedKey, key)
                .decryptedPub;
              info = key;
            } catch (err) {
              Alert.alert(
                'Invalid Number/Email',
                'Decryption failed due to invalid input, try again.',
              );
              return;
            }
          }

          let existingContact, existingContactName;
          Object.keys(trustedContacts.tc.trustedContacts).forEach(
            (contactName) => {
              const contact = trustedContacts.tc.trustedContacts[contactName];
              if (contact.contactsPubKey === publicKey) {
                existingContactName = contactName;
                existingContact = contact;
              }
            },
          );
          if (existingContactName && !approvedTC) {
            Toast('Contact already exists against this request');
            return;
          }

          if (publicKey && !rejected) {
            if (!approvedTC) {
              navigation.navigate('ContactsListForAssociateContact', {
                postAssociation: (contact) => {
                  let contactName = '';
                  if (contact) {
                    contactName = `${contact.firstName} ${contact.lastName ? contact.lastName : ''
                      }`
                      .toLowerCase()
                      .trim();
                  } else {
                    // contactName = `${requester}'s Wallet`.toLowerCase();
                    Alert.alert('Contact association failed');
                    return;
                  }
                  if (!semver.valid(version)) {
                    // for 0.7, 0.9 and 1.0: info remains null
                    info = null;
                  }

                  const contactInfo = {
                    contactName,
                    info,
                  };

                  approveTrustedContact(
                    contactInfo,
                    publicKey,
                    true,
                    requester,
                    isGuardian,
                  );
                },
                isGuardian,
              });
            } else {
              if (!existingContactName) {
                Alert.alert(
                  'Invalid Link/QR',
                  'You are not a valid trusted contact for approving this request',
                );
                return;
              }
              const contactInfo = {
                contactName: existingContactName,
                info,
              };

              fetchTrustedChannel(
                contactInfo,
                trustedChannelActions.downloadShare,
                requester,
              );
            }
          } else if (publicKey && rejected) {
            // don't associate; only fetch the payment details from EC
            // fetchEphemeralChannel(null, null, publicKey);
          }
        }
      }
    } else {
      if (requester === walletName) {
        Toast('You do not host any key of your own');
        return;
      }

      if (!UNDER_CUSTODY[requester]) {
        this.setState(
          {
            isLoading: false,
            errorMessageHeader: `You do not custody a share with the wallet name ${requester}`,
            errorMessage: `Request your contact to send the request again with the correct wallet name or help them manually restore by going into Friends and Family > I am the Keeper of > Help Restore`,
            buttonText: 'Okay',
          },
          () => {
            this.errorBottomSheetRef.current?.snapTo(1);
          },
        );
      } else {
        if (!publicKey) {
          try {
            publicKey = TrustedContactsService.decryptPub(encryptedKey, key)
              .decryptedPub;
          } catch (err) {
            Alert.alert(
              'Invalid Number/Email',
              'Decryption failed due to invalid input, try again.',
            );
          }
        }
        if (publicKey) {
          uploadRequestedShare(recoveryRequest.requester, publicKey);
        }
      }
    }
  };

  handleBottomSheetPositionChange = (
    bottomSheetRef: React.RefObject<RNBottomSheet>,
    newIndex: number,
  ) => {
    if (bottomSheetRef === this.getActiveBottomSheetRef()) {
      const newState = newIndex >= 1 ? BottomSheetState.Open : BottomSheetState.Closed;
      this.setState({ newBottomSheetState: newState });
    }
  };

  closeBottomSheet = () => {
    this.getActiveBottomSheetRef()?.current?.close();

    this.setState({
      newBottomSheetState: BottomSheetState.Closed,
      selectedBottomTab: null,
    });
  };

  getActiveBottomSheetRef = (): React.RefObject<RNBottomSheet> | null => {
    switch (this.state.selectedBottomTab) {
      case BottomTab.Add:
        return this.addTabBarBottomSheetRef;
      default:
        return null;
    }
  };


  onNotificationClicked = async (value) => {
    const { notificationListNew } = this.props;
    //let asyncNotifications = notificationListNew;
    let asyncNotifications = JSON.parse(
      await AsyncStorage.getItem('notificationList'),
    );
    const { notificationData } = this.state;
    const { navigation } = this.props;
    let tempNotificationData = notificationData;
    for (let i = 0; i < tempNotificationData.length; i++) {
      const element = tempNotificationData[i];
      if (element.notificationId == value.notificationId) {
        if (
          asyncNotifications &&
          asyncNotifications.length &&
          asyncNotifications.findIndex(
            (item) => item.notificationId == value.notificationId,
          ) > -1
        ) {
          asyncNotifications[
            asyncNotifications.findIndex(
              (item) => item.notificationId == value.notificationId,
            )
          ].read = true;
        }
        tempNotificationData[i].read = true;
      }
    }

    await AsyncStorage.setItem(
      'notificationList',
      JSON.stringify(asyncNotifications),
    );

    this.setState({
      notificationData: tempNotificationData,
      notificationDataChange: !this.state.notificationDataChange,
    });

    if (value.info.includes('Trusted Contact request accepted by')) {
      navigation.navigate('FriendsAndFamily');
      return;
    }

    if (value.type == 'release') {
      RelayServices.fetchReleases(value.info.split(' ')[1])
        .then(async (res) => {
          if (res.data.releases.length) {
            let releaseNotes = res.data.releases.length
              ? res.data.releases.find((el) => {
                return el.build === value.info.split(' ')[1];
              })
              : '';
            navigation.navigate('UpdateApp', {
              releaseData: [releaseNotes],
              isOpenFromNotificationList: true,
              releaseNumber: value.info.split(' ')[1],
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (value.type == 'contact') {
      setTimeout(() => {
        this.notificationsListBottomSheetRef.current?.snapTo(0)
      }, 2);
    }
  };


  setupNotificationList = async () => {
    const { notificationListNew } = this.props;
    // let asyncNotification = notificationListNew;
    let asyncNotification = JSON.parse(
      await AsyncStorage.getItem('notificationList'),
    );
    let asyncNotificationList = [];
    if (asyncNotification) {
      asyncNotificationList = [];
      for (let i = 0; i < asyncNotification.length; i++) {
        asyncNotificationList.push(asyncNotification[i]);
      }
    }
    let tmpList = asyncNotificationList;
    const { notificationList } = this.props;
    if (notificationList) {
      for (let i = 0; i < notificationList['notifications'].length; i++) {
        const element = notificationList['notifications'][i];
        let readStatus = false;
        if (element.notificationType == 'release') {
          let releaseCases = this.props.releaseCasesValue;
          // JSON.parse(
          //   await AsyncStorage.getItem('releaseCases'),
          // );
          if (element.body.split(' ')[1] == releaseCases.build) {
            if (releaseCases.remindMeLaterClick) {
              readStatus = false;
            }
            if (releaseCases.ignoreClick) {
              readStatus = true;
            }
          } else {
            readStatus = true;
          }
        }
        if (
          asyncNotificationList.findIndex(
            (value) => value.notificationId == element.notificationId,
          ) > -1
        ) {
          let temp =
            asyncNotificationList[
            asyncNotificationList.findIndex(
              (value) => value.notificationId == element.notificationId,
            )
            ];
          if (element.notificationType == 'release') {
            readStatus = readStatus;
          } else {
            readStatus = temp.read;
          }
          let obj = {
            ...temp,
            read: readStatus,
            type: element.notificationType,
            title: element.title,
            info: element.body,
            isMandatory: element.tag == 'mandatory' ? true : false,
            time: timeFormatter(
              moment(new Date()),
              moment(element.date).valueOf(),
            ),
            date: new Date(element.date),
          };
          tmpList[
            tmpList.findIndex(
              (value) => value.notificationId == element.notificationId,
            )
          ] = obj;
        } else {
          let obj = {
            type: element.notificationType,
            isMandatory: element.tag == 'mandatory' ? true : false,
            read: readStatus,
            title: element.title,
            time: timeFormatter(
              moment(new Date()),
              moment(element.date).valueOf(),
            ),
            date: new Date(element.date),
            info: element.body,
            notificationId: element.notificationId,
          };
          tmpList.push(obj);
        }
      }
      //this.props.notificationsUpdated(tmpList);
      await AsyncStorage.setItem('notificationList', JSON.stringify(tmpList));
      tmpList.sort(function (left, right) {
        return moment.utc(right.date).unix() - moment.utc(left.date).unix();
      });

      this.setState({
        notificationData: tmpList,
        notificationDataChange: !this.state.notificationDataChange,
      });
    }
  };

  setCurrencyToggleValue = (temp) => {
    this.props.setCurrencyToggleValue(temp);
  };

  render() {
    const {
      cardData,
      switchOn,
      CurrencyCode,
      balances,
      selectedBottomTab,
      errorMessageHeader,
      errorMessage,
      buttonText,
      selectedContact,
      notificationData,
      fbBTCAccount,
      currencyCode,
      trustedContactRequest,
      recoveryRequest,
      custodyRequest,
      isLoadContacts,
      isLoading,
      isBalanceLoading,
    } = this.state;
    const {
      navigation,
      notificationList,
      exchangeRates,
      accounts,
      walletName,
      UNDER_CUSTODY,
      downloadMShare,
      overallHealth,
      cardDataProps,
    } = this.props;
    return (
      <ImageBackground
        source={require('../../assets/images/home-bg.png')}
        style={{ width: '100%', height: '100%', flex: 1 }}
        imageStyle={{ resizeMode: 'stretch' }}
      >
        <StatusBar backgroundColor={Colors.blue} barStyle="light-content" />
        <View
          style={{
            flex: 3.8,
            paddingTop:
              Platform.OS == 'ios' && DeviceInfo.hasNotch ? heightPercentageToDP('5%') : 0,
          }}
        >
          <HomeHeader
            onPressNotifications={this.onPressNotifications}
            notificationData={notificationData}
            walletName={walletName}
            switchOn={switchOn}
            getCurrencyImageByRegion={getCurrencyImageByRegion}
            balances={balances}
            exchangeRates={exchangeRates}
            CurrencyCode={currencyCode}
            navigation={this.props.navigation}
            overallHealth={overallHealth}
            onSwitchToggle={this.onSwitchToggle}
            setCurrencyToggleValue={this.setCurrencyToggleValue}
          />
        </View>

        <View style={styles.accountCardsContainer}>
          <FlatList
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={cardData}
            extraData={{
              balances,
              switchOn,
              walletName,
              currencyCode,
              accounts,
              exchangeRates,
            }}
            keyExtractor={(_, index) => String(index)}
            renderItem={(Items) => (
              <HomeList
                isBalanceLoading={isBalanceLoading}
                Items={Items}
                navigation={navigation}
                getIconByAccountType={getIconByAccountType}
                switchOn={switchOn}
                accounts={accounts}
                addNewDisable={cardDataProps.length == 4 ? true : false}
                CurrencyCode={currencyCode}
                balances={balances}
                exchangeRates={exchangeRates}
              />
            )}
          />
        </View>

        <View
          style={styles.floatingFriendsAndFamilyButtonContainer} pointerEvents="box-none"
        >
          <Button
            raised
            title="Friends & Family"
            icon={
              <Image
                source={require('../../assets/images/icons/icon_contact.png')}
                style={{ width: 18, height: 18 }}
              />
            }
            buttonStyle={ButtonStyles.floatingActionButton}
            titleStyle={{ ...ButtonStyles.floatingActionButtonText, marginLeft: 4 }}
            onPress={() => navigation.navigate('FriendsAndFamily')}
          />
        </View>

        <BottomSheetBackground
          isVisible={this.state.newBottomSheetState === BottomSheetState.Open}
          onPress={this.closeBottomSheet}
        />

        <CustomBottomTabs
          onSelect={this.handleBottomTabSelection}
          selectedTab={selectedBottomTab}
        />

        {isLoading && <Loader />}

        {/* ---- Bottom Sheets ---- */}

        <RNBottomSheet
          ref={this.addTabBarBottomSheetRef}
          snapPoints={[
            -50,
            Platform.OS == 'ios' && DeviceInfo.hasNotch()
              ? heightPercentageToDP('65%')
              : heightPercentageToDP('64%'),
          ]}
          handleComponent={BottomSheetHandle}
          onChange={(newPositionIndex: number) => {
            this.handleBottomSheetPositionChange(
              this.addTabBarBottomSheetRef,
              newPositionIndex,
            );
          }}
        >
          <BottomSheetView>
            <BottomSheetHeader
              title="Add"
              onPress={this.closeBottomSheet}
            />

            <AddModalContents
              onPressElements={(type) => {
                if (type == 'buyBitcoins') {
                  this.props.navigation.navigate('VoucherScanner');
                } else if (type == 'addContact') {
                  this.setState(
                    {
                      isLoadContacts: true,
                    },
                    () => {
                      this.addContactAddressBookBottomSheetRef.current?.snapTo(1)
                    },
                  );
                }
              }}
            />
          </BottomSheetView>
        </RNBottomSheet>

        <BottomSheet
          enabledInnerScrolling={true}
          ref={this.custodianRequestBottomSheetRef}
          snapPoints={[-50, heightPercentageToDP('60%')]}
          renderContent={() => {
            if (!custodyRequest) {
              return null;
            }

            return (
              <CustodianRequestModalContents
                loading={isLoading}
                userName={custodyRequest.requester}
                onPressAcceptSecret={() => {
                  this.custodianRequestBottomSheetRef.current?.snapTo(0);

                  if (Date.now() - custodyRequest.uploadedAt > 600000) {
                    Alert.alert(
                      'Request expired!',
                      'Please ask the sender to initiate a new request',
                    );
                    this.setState({
                      isLoading: false,
                    });
                  } else {
                    if (UNDER_CUSTODY[custodyRequest.requester]) {
                      Alert.alert(
                        'Failed to store',
                        'You cannot custody multiple shares of the same user.',
                      );
                      this.setState({ isLoading: false });
                    } else {
                      if (custodyRequest.isQR) {
                        downloadMShare(custodyRequest.ek, custodyRequest.otp);
                        this.setState({
                          isLoading: false,
                        });
                      } else {
                        navigation.navigate('CustodianRequestOTP', {
                          custodyRequest,
                        });
                        this.setState({
                          isLoading: false,
                        });
                      }
                    }
                  }
                }}
                onPressRejectSecret={() => {
                  this.custodianRequestBottomSheetRef.current?.snapTo(0);
                  this.custodianRequestRejectedBottomSheetRef.current?.snapTo(1);
                }}
              />
            );
          }}
          renderHeader={() => (
            <TransparentHeaderModal
              onPressheader={() => {
                this.custodianRequestBottomSheetRef.current?.snapTo(0);
              }}
            />
          )}
        />

        <BottomSheet
          enabledInnerScrolling={true}
          ref={this.trustedContactRequestBottomSheetRef}
          snapPoints={[
            -50,
            Platform.OS == 'ios' && DeviceInfo.hasNotch()
              ? heightPercentageToDP('65%')
              : heightPercentageToDP('70%'),
            Platform.OS == 'ios' && DeviceInfo.hasNotch()
              ? heightPercentageToDP('95%')
              : heightPercentageToDP('95%'),
          ]}
          renderContent={() => {
            if (!trustedContactRequest && !recoveryRequest) {
              return;
            }
            return (
              <TrustedContactRequestContent
                trustedContactRequest={trustedContactRequest}
                recoveryRequest={recoveryRequest}
                onPressAccept={this.onTrustedContactRequestAccept}
                onPressReject={this.onTrustedContactReject}
                onPhoneNumberChange={this.onPhoneNumberChange}
                bottomSheetRef={this.trustedContactRequestBottomSheetRef}
              />
            );
          }}
          renderHeader={() => (
            <ModalHeader
              onPressHeader={() => {
                () => {
                  this.trustedContactRequestBottomSheetRef.current?.snapTo(0);
                }
              }}
            />
          )}
        />

          <BottomSheet
            enabledInnerScrolling={true}
            ref={this.custodianRequestRejectedBottomSheetRef}
            snapPoints={[-50, heightPercentageToDP('60%')]}
            renderContent={() => {
              if (!custodyRequest) return null;
              return (
                <CustodianRequestRejectedModalContents
                  onPressViewThrustedContacts={() => {
                    this.custodianRequestRejectedBottomSheetRef.current?.snapTo(0);
                  }}
                  userName={custodyRequest.requester}
                />
              );
            }}
            renderHeader={() => (
              <TransparentHeaderModal
                onPressheader={() => {
                  this.custodianRequestRejectedBottomSheetRef.current?.snapTo(0);
                }}
              />
            )}
          />

        <BottomSheet
          enabledInnerScrolling={true}
          ref={this.errorBottomSheetRef}
          snapPoints={[
            -50,
            Platform.OS == 'ios' && DeviceInfo.hasNotch()
              ? heightPercentageToDP('35%')
              : heightPercentageToDP('40%'),
          ]}
          renderContent={() => (
            <ErrorModalContents
              title={errorMessageHeader}
              info={errorMessage}
              proceedButtonText={buttonText}
              onPressProceed={() => {
                this.errorBottomSheetRef.current?.snapTo(0);
              }}
              isBottomImage={true}
              bottomImage={require('../../assets/images/icons/errorImage.png')}
            />
          )}
          renderHeader={() => (
            <ModalHeader
              onPressHeader={() => {
                this.errorBottomSheetRef.current?.snapTo(0);
              }}
            />
          )}
        />

        <BottomSheet
          enabledInnerScrolling={true}
          ref={this.addContactAddressBookBottomSheetRef}
          snapPoints={[
            -50,
            Platform.OS == 'ios' && DeviceInfo.hasNotch()
              ? heightPercentageToDP('82%')
              : heightPercentageToDP('82%'),
          ]}
          renderContent={() => (
            <AddContactAddressBook
              isLoadContacts={isLoadContacts}
              proceedButtonText={'Confirm & Proceed'}
              onPressContinue={() => {
                if (selectedContact && selectedContact.length) {
                  navigation.navigate('AddContactSendRequest', {
                    SelectedContact: selectedContact,
                  });
                  this.addContactAddressBookBottomSheetRef.current?.snapTo(0)
                }
              }}
              onSelectContact={(selectedContact) => {
                this.setState({
                  selectedContact,
                });
              }}
              onPressBack={() => {
                this.addContactAddressBookBottomSheetRef.current?.snapTo(0)
              }}
              onSkipContinue={() => {
                let { skippedContactsCount } = this.props.trustedContacts.tc;
                let data;
                if (!skippedContactsCount) {
                  skippedContactsCount = 1;
                  data = {
                    firstName: 'F&F request',
                    lastName: `awaiting ${skippedContactsCount}`,
                    name: `F&F request awaiting ${skippedContactsCount}`,
                  };
                } else {
                  data = {
                    firstName: 'F&F request',
                    lastName: `awaiting ${skippedContactsCount + 1}`,
                    name: `F&F request awaiting ${skippedContactsCount + 1}`,
                  };
                }

                navigation.navigate('AddContactSendRequest', {
                  SelectedContact: [data],
                });
                this.addContactAddressBookBottomSheetRef.current?.snapTo(0)
              }}
            />
          )}
          renderHeader={() => (
            <SmallHeaderModal
              borderColor={Colors.white}
              backgroundColor={Colors.white}
              onPressHeader={() => {
                this.addContactAddressBookBottomSheetRef.current?.snapTo(0)
              }}
            />
          )}
        />

        <BottomSheet
          onOpenEnd={() => {
            this.onNotificationListOpen();
          }}
          enabledInnerScrolling={true}
          ref={this.notificationsListBottomSheetRef}
          snapPoints={[
            -50,
            Platform.OS == 'ios' && DeviceInfo.hasNotch()
              ? heightPercentageToDP('82%')
              : heightPercentageToDP('82%'),
          ]}
          renderContent={() => (
            <NotificationListContent
              notificationLoading={this.state.notificationLoading}
              NotificationData={notificationData}
              onNotificationClicked={(value) =>
                this.onNotificationClicked(value)
              }
              onPressBack={() => {
                this.notificationsListBottomSheetRef.current?.snapTo(0)
              }}
            />
          )}
          renderHeader={() => (
            <ModalHeader
              onPressHeader={() => {
                this.notificationsListBottomSheetRef.current?.snapTo(0)
              }}
            />
          )}
        />
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notificationList: state.notifications,
    exchangeRates: idx(state, (_) => _.accounts.exchangeRates),
    accounts: state.accounts || [],
    walletName:
      idx(state, (_) => _.storage.database.WALLET_SETUP.walletName) || '',
    UNDER_CUSTODY: idx(
      state,
      (_) => _.storage.database.DECENTRALIZED_BACKUP.UNDER_CUSTODY,
    ),
    cardDataProps: idx(state, (_) => _.preferences.cardData),

    s3Service: idx(state, (_) => _.sss.service),
    overallHealth: idx(state, (_) => _.sss.overallHealth),
    trustedContacts: idx(state, (_) => _.trustedContacts.service),
    paymentDetails: idx(state, (_) => _.trustedContacts.paymentDetails),
    notificationListNew: idx(state, (_) => _.notifications.notificationListNew),
    FBTCAccountData: idx(state, (_) => _.fbtc.FBTCAccountData),
    currencyCode: idx(state, (_) => _.preferences.currencyCode) || 'USD',
    currencyToggleValue: idx(state, (_) => _.preferences.currencyToggleValue),
    fcmTokenValue: idx(state, (_) => _.preferences.fcmTokenValue),
    secondaryDeviceAddressValue: idx(
      state,
      (_) => _.preferences.secondaryDeviceAddressValue,
    ),
    releaseCasesValue: idx(state, (_) => _.preferences.releaseCasesValue),
  };
};

export default withNavigationFocus(
  connect(mapStateToProps, {
    fetchEphemeralChannel,
    fetchNotifications,
    updateFCMTokens,
    downloadMShare,
    approveTrustedContact,
    fetchTrustedChannel,
    uploadRequestedShare,
    initHealthCheck,
    fetchDerivativeAccBalTx,
    addTransferDetails,
    clearPaymentDetails,
    notificationsUpdated,
    storeFbtcData,
    setCurrencyCode,
    setCurrencyToggleValue,
    updatePreference,
    setFCMToken,
    setSecondaryDeviceAddress,
    updateAddressBookLocally,
    setCardData,
  })(Home),
);

const styles = StyleSheet.create({
  accountCardsContainer: {
    flex: 7,
    marginTop: 30,
    paddingLeft: 20,
    borderTopLeftRadius: 25,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 2, height: -1 },
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
    width: '100%',
  },

  floatingFriendsAndFamilyButtonContainer: {
    position: 'absolute',
    zIndex: 0,
    bottom: TAB_BAR_HEIGHT,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    padding: heightPercentageToDP(1),
  },
});
