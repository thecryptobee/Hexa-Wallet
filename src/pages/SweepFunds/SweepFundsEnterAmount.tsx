import React, { Component } from 'react'
import {
  BackHandler, Image, KeyboardAvoidingView,
  Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { RFValue } from 'react-native-responsive-fontsize'
import {
  heightPercentageToDP as hp, widthPercentageToDP as wp
} from 'react-native-responsive-screen'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import BottomSheet from 'reanimated-bottom-sheet'
import Colors from '../../common/Colors'
import { getCurrencyImageName } from '../../common/CommonFunctions/index'
import {
  REGULAR_ACCOUNT,
  SECURE_ACCOUNT, TEST_ACCOUNT, TRUSTED_CONTACTS
} from '../../common/constants/wallet-service-types'
import Fonts from '../../common/Fonts'
import { UsNumberFormat } from '../../common/utilities'

import idx from 'idx'
import { connect } from 'react-redux'
import config from '../../bitcoin/HexaConfig'
import { getCurrencyImageByRegion } from '../../common/CommonFunctions/index'
import CurrencyKindToggleSwitch from '../../components/CurrencyKindToggleSwitch'
import SmallHeaderModal from '../../components/SmallHeaderModal'
import AccountSelectionModalContents from '../Accounts/AccountSelectionModalContents'

const currencyCode = [
  'BRL',
  'CNY',
  'JPY',
  'GBP',
  'KRW',
  'RUB',
  'TRY',
  'INR',
  'EUR',
]
interface SweepFundsEnterAmountPropsTypes {
  route: any;
  navigation: any;
  service: any;
  transfer: any;
  accounts: any;
  loading: any;
  transferST1: any;
  removeTransferDetails: any;
  clearTransfer: any;
  addTransferDetails: any;
  currencyCode: any;
  currencyToggleValue: any;
  setCurrencyToggleValue: any;
  averageTxFees: any;
  setAverageTxFee: any;
}

interface SweepFundsEnterAmountStateTypes {
  RegularAccountBalance: any;
  exchangeRates: any[];
  removeItem: any;
  recipients: any[];
  spendableBalances: any;
  address: any;
  totalAmount: any;
  accountData: any[];
  switchOn: any;
  CurrencyCode: any;
  CurrencySymbol: any;
  bitcoinAmount: any;
  currencyAmount: any;
  isOpen: boolean;
  serviceType: any;
  InputStyle: any;
  InputStyle1: any;
  InputStyleNote: any;
  isSendMax: boolean;
  isInvalidBalance: boolean;
  averageTxFees: any;
  spendableBalance: any;
}

class SweepFundsEnterAmount extends Component<
  SweepFundsEnterAmountPropsTypes,
  SweepFundsEnterAmountStateTypes
> {
  constructor( props ) {
    super( props )
    this.state = {
      RegularAccountBalance: 0,
      exchangeRates: null,
      address: this.props.route.params.address,
      removeItem: {
      },
      recipients: [],
      spendableBalances: {
        testBalance: 0,
        regularBalance: 0,
        secureBalance: 0,
      },
      totalAmount: 0,
      accountData: [
        {
          id: 1,
          account_name: 'Checking Account',
          type: REGULAR_ACCOUNT,
          checked: false,
          image: require( '../../assets/images/icons/icon_regular_account.png' ),
        },
        {
          id: 2,
          account_name: 'Savings Account',
          type: SECURE_ACCOUNT,
          checked: false,
          image: require( '../../assets/images/icons/icon_secureaccount_white.png' ),
        },
      ],
      switchOn: true,
      CurrencyCode: 'USD',
      CurrencySymbol: '$',
      bitcoinAmount: props.route.params.bitcoinAmount
        ? props.route.params.bitcoinAmount
        : '',
      currencyAmount: '',
      isOpen: false,
      serviceType: REGULAR_ACCOUNT,
      InputStyle: styles.textBoxView,
      InputStyle1: styles.textBoxView,
      InputStyleNote: styles.textBoxView,
      isSendMax: false,
      isInvalidBalance: false,
      averageTxFees: 0,
      spendableBalance: 0,
    }
  }

  componentDidMount = () => {
    this.getBalance()
    BackHandler.addEventListener( 'hardwareBackPress', () => {} )
  };

  componentDidUpdate = ( prevProps, prevState ) => {};

  getBalance = () => {
    const { accounts } = this.props
    const testBalance = accounts[ TEST_ACCOUNT ].service
      ? accounts[ TEST_ACCOUNT ].service.hdWallet.balances.balance
      : // +  accounts[TEST_ACCOUNT].service.hdWallet.balances.unconfirmedBalance
      0

    let regularBalance = accounts[ REGULAR_ACCOUNT ].service
      ? accounts[ REGULAR_ACCOUNT ].service.hdWallet.balances.balance
      : // +  accounts[REGULAR_ACCOUNT].service.hdWallet.balances.unconfirmedBalance
      0

    // regular derivative accounts
    for ( const dAccountType of Object.keys( config.DERIVATIVE_ACC ) ) {
      const derivativeAccount =
        accounts[ REGULAR_ACCOUNT ].service.hdWallet.derivativeAccounts[
          dAccountType
        ]
      if ( derivativeAccount.instance.using ) {
        for (
          let accountNumber = 1;
          accountNumber <= derivativeAccount.instance.using;
          accountNumber++
        ) {
          if ( derivativeAccount[ accountNumber ].balances ) {
            regularBalance += derivativeAccount[ accountNumber ].balances.balance
            // + derivativeAccount[accountNumber].balances.unconfirmedBalance;
          }
        }
      }
    }

    let secureBalance = accounts[ SECURE_ACCOUNT ].service
      ? accounts[ SECURE_ACCOUNT ].service.secureHDWallet.balances.balance
      : // + accounts[SECURE_ACCOUNT].service.secureHDWallet.balances
    //      .unconfirmedBalance
      0

    // secure derivative accounts
    for ( const dAccountType of Object.keys( config.DERIVATIVE_ACC ) ) {
      if ( dAccountType === TRUSTED_CONTACTS ) continue

      const derivativeAccount =
        accounts[ SECURE_ACCOUNT ].service.secureHDWallet.derivativeAccounts[
          dAccountType
        ]
      if ( derivativeAccount.instance.using ) {
        for (
          let accountNumber = 1;
          accountNumber <= derivativeAccount.instance.using;
          accountNumber++
        ) {
          if ( derivativeAccount[ accountNumber ].balances ) {
            secureBalance += derivativeAccount[ accountNumber ].balances.balance
            // +derivativeAccount[accountNumber].balances.unconfirmedBalance;
          }
        }
      }
    }
    this.setState( {
      spendableBalances: {
        testBalance,
        regularBalance,
        secureBalance,
      },
      RegularAccountBalance: regularBalance,
    } )
  };

  getBalanceText = () => {
    const {
      serviceType,
      RegularAccountBalance,
      switchOn,
      exchangeRates,
      CurrencyCode,
      spendableBalances,
    } = this.state
    let balance = 0
    if ( serviceType == REGULAR_ACCOUNT ) balance = RegularAccountBalance
    if ( serviceType == REGULAR_ACCOUNT )
      balance = spendableBalances.regularBalance
    if ( serviceType == SECURE_ACCOUNT )
      balance = spendableBalances.secureBalance

    return serviceType == TEST_ACCOUNT
      ? UsNumberFormat( balance )
      : switchOn
        ? UsNumberFormat( balance )
        : exchangeRates
          ? ( ( balance / 1e8 ) * exchangeRates[ CurrencyCode ].last ).toFixed( 2 )
          : null
  };

  sendMaxHandler = () => {};

  convertBitCoinToCurrency = ( value ) => {
    const { switchOn, exchangeRates, CurrencyCode } = this.state
    const temp = value
    if ( switchOn ) {
      const result = exchangeRates
        ? ( ( value / 1e8 ) * exchangeRates[ CurrencyCode ].last ).toFixed( 2 )
        : 0
      this.setState( {
        bitcoinAmount: temp, currencyAmount: result.toString()
      } )
    } else {
      let currency = exchangeRates
        ? value / exchangeRates[ CurrencyCode ].last
        : 0
      currency = currency < 1 ? currency * 1e8 : currency
      this.setState( {
        currencyAmount: temp,
        bitcoinAmount: currency.toFixed( 0 ),
      } )
    }
  };

  render() {
    const {
      address,
      accountData,
      serviceType,
      RegularAccountBalance,
      removeItem,
      spendableBalances,
      switchOn,
      CurrencyCode,
      isOpen,
      InputStyle,
      InputStyle1,
      InputStyleNote,
      isSendMax,
      currencyAmount,
      isInvalidBalance,
      bitcoinAmount,
    } = this.state
    const { transfer } = this.props
    return (
      <View
        style={{
          height: hp( '100%' ),
          backgroundColor: Colors.white,
        }}
      >
        <SafeAreaView style={{
          flex: 0
        }} />
        <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
        <View style={styles.modalHeaderTitleView}>
          <View style={styles.view}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack()
              }}
              style={styles.backArrow}
            >
              <FontAwesome
                name="long-arrow-left"
                color={Colors.homepageButtonColor}
                size={17}
              />
            </TouchableOpacity>

            <View style={{
              marginLeft: wp( '2.5%' )
            }}>
              <Text style={styles.modalHeaderTitleText}>{'Sweep Funds'}</Text>
              <Text style={styles.sendText}>
                {'Sweeping to: '}
                <Text style={styles.availableToSpendText}>
                  {'Address '}
                  <Text style={styles.addessText}>
                    {address ? address : ''}
                  </Text>
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.totalMountView}>
          <View>
            <Text style={styles.totalAmountText}>Enter Amount</Text>
            <Text style={styles.totalAmountSubText}>
              Lorem ipsum dolor sit amet
            </Text>
          </View>
        </View>
        <View style={styles.availableToSpendView}>
          <Text style={styles.sweepingFromText}>Sweeping From: </Text>
          <TouchableOpacity
            activeOpacity={10}
            onPress={() => {
              ( this.refs.AccountSelectionBottomSheet as any ).snapTo( 1 )
            }}
            style={{
              flexDirection: 'row', alignItems: 'center'
            }}
          >
            <Text
              style={{
                color: Colors.blue,
                fontSize: RFValue( 12 ),
                fontFamily: Fonts.Italic,
              }}
            >
              {serviceType == 'TEST_ACCOUNT'
                ? ' Test Account'
                : serviceType == 'SECURE_ACCOUNT'
                  ? ' Savings Account'
                  : serviceType == 'REGULAR_ACCOUNT'
                    ? ' Checking Account'
                    : serviceType == 'S3_SERVICE'
                      ? ' S3 Service'
                      : ''}
            </Text>
            <Text style={styles.availableToSpendText}>
              {' (Available to spend '}
              <Text style={styles.balanceText}>{this.getBalanceText()}</Text>
              <Text style={styles.textTsats}>
                {switchOn
                  ? ' sats )'
                  : ' ' + CurrencyCode.toLocaleLowerCase() + ' )'}
              </Text>
            </Text>
            <Ionicons
              style={{
                marginLeft: 5
              }}
              name={isOpen ? 'ios-arrow-up' : 'ios-arrow-down'}
              size={RFValue( 15 )}
              color={Colors.blue}
            />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{
            flex: 1
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : ''}
          enabled
        >
          <View style={styles.parentView}>
            <ScrollView>
              <View style={{
                flex: 1, flexDirection: 'row'
              }}>
                <View style={{
                  flex: 1, flexDirection: 'column'
                }}>
                  <TouchableOpacity
                    style={{
                      ...InputStyle1,
                      marginBottom: wp( '1.5%' ),
                      marginTop: wp( '1.5%' ),
                      flexDirection: 'row',
                      width: wp( '70%' ),
                      height: wp( '13%' ),
                      alignItems: 'center',
                      backgroundColor: !switchOn
                        ? Colors.white
                        : Colors.backgroundColor,
                    }}
                    onPress={this.sendMaxHandler}
                  >
                    <View style={styles.amountInputImage}>
                      {currencyCode.includes( CurrencyCode ) ? (
                        <View style={styles.currencyImageView}>
                          <MaterialCommunityIcons
                            name={getCurrencyImageName( CurrencyCode )}
                            color={Colors.currencyGray}
                            size={wp( '6%' )}
                          />
                        </View>
                      ) : (
                        <Image
                          style={{
                            ...styles.textBoxImage,
                          }}
                          source={getCurrencyImageByRegion(
                            CurrencyCode,
                            'gray',
                          )}
                        />
                      )}
                      {/* <Image
            style={styles.textBoxImage}
            source={require('../../assets/images/icons/dollar_grey.png')}
          /> */}
                    </View>
                    <View style={styles.convertText} />
                    <TextInput
                      style={{
                        ...styles.textBox,
                        paddingLeft: 10,
                        flex: 1,
                        height: wp( '13%' ),
                        width: wp( '45%' ),
                      }}
                      editable={!switchOn}
                      placeholder={
                        switchOn
                          ? 'Converted amount in ' + CurrencyCode
                          : 'Enter amount in ' + CurrencyCode
                      }
                      value={currencyAmount}
                      returnKeyLabel="Done"
                      returnKeyType="done"
                      keyboardType={'numeric'}
                      onChangeText={( value ) => {
                        if ( this.state.isSendMax ) {
                          this.setState( {
                            isSendMax: false
                          } )
                        }
                        this.convertBitCoinToCurrency( value )
                      }}
                      placeholderTextColor={Colors.borderColor}
                      onFocus={() => {
                        this.setState( {
                          InputStyle1: styles.inputBoxFocused
                        } )
                      }}
                      onBlur={() => {
                        this.setState( {
                          InputStyle1: styles.textBoxView
                        } )
                      }}
                      onKeyPress={( e ) => {
                        if ( e.nativeEvent.key === 'Backspace' ) {
                          setTimeout( () => {
                            this.setState( {
                              isInvalidBalance: false
                            } )
                          }, 10 )
                        }
                      }}
                    />
                    {!switchOn && (
                      <Text
                        style={{
                          color: Colors.blue,
                          textAlign: 'center',
                          paddingHorizontal: 10,
                          fontSize: RFValue( 10 ),
                          fontFamily: Fonts.Italic,
                        }}
                      >
                        Send Max
                      </Text>
                    )}
                  </TouchableOpacity>
                  {/* {renderUSDInputText()} */}
                  {isInvalidBalance ? (
                    <View style={{
                      marginLeft: 'auto'
                    }}>
                      <Text style={styles.errorText}>Insufficient balance</Text>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={{
                      ...InputStyle,
                      marginBottom: wp( '1.5%' ),
                      marginTop: wp( '1.5%' ),
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: wp( '70%' ),
                      height: wp( '13%' ),
                      backgroundColor: switchOn
                        ? Colors.white
                        : Colors.backgroundColor,
                    }}
                    onPress={this.sendMaxHandler}
                  >
                    <View style={styles.amountInputImage}>
                      <Image
                        style={styles.textBoxImage}
                        source={require( '../../assets/images/icons/icon_bitcoin_gray.png' )}
                      />
                    </View>
                    <View style={styles.enterAmountView} />
                    <TextInput
                      style={{
                        ...styles.textBox,
                        flex: 1,
                        paddingLeft: 10,
                        height: wp( '13%' ),
                        width: wp( '45%' ),
                      }}
                      placeholder={
                        switchOn
                          ? serviceType == TEST_ACCOUNT
                            ? 'Enter amount in t-sats'
                            : 'Enter amount in sats'
                          : serviceType == TEST_ACCOUNT
                            ? 'Converted amount in t-sats'
                            : 'Converted amount in sats'
                      }
                      editable={switchOn}
                      value={bitcoinAmount}
                      returnKeyLabel="Done"
                      returnKeyType="done"
                      keyboardType={'numeric'}
                      onChangeText={( value ) => {
                        if ( this.state.isSendMax ) {
                          this.setState( {
                            isSendMax: false
                          } )
                        }
                        this.convertBitCoinToCurrency( value )
                      }}
                      placeholderTextColor={Colors.borderColor}
                      onFocus={() => {
                        this.setState( {
                          InputStyle: styles.inputBoxFocused
                        } )
                      }}
                      onBlur={() => {
                        this.setState( {
                          InputStyle: styles.textBoxView
                        } )
                      }}
                      onKeyPress={( e ) => {
                        if ( e.nativeEvent.key === 'Backspace' ) {
                          setTimeout( () => {
                            this.setState( {
                              isInvalidBalance: false
                            } )
                          }, 10 )
                        }
                      }}
                    />
                    {switchOn && (
                      <Text
                        style={{
                          color: Colors.blue,
                          textAlign: 'center',
                          paddingHorizontal: 10,
                          fontSize: RFValue( 10 ),
                          fontFamily: Fonts.Italic,
                        }}
                      >
                        Send Max
                      </Text>
                    )}
                  </TouchableOpacity>
                  {/* {renderBitCoinInputText()} */}
                </View>
                <View style={styles.toggleSwitchView}>
                  <CurrencyKindToggleSwitch
                    fiatCurrencyCode={CurrencyCode}
                    onpress={async () => {
                      this.setState( {
                        switchOn: !switchOn
                      } )
                      const temp = !switchOn ? 'true' : ''
                      this.props.setCurrencyToggleValue( temp )

                      //await AsyncStorage.setItem('currencyToggleValue', temp);
                    }}
                    isOn={switchOn}
                    isVertical={true}
                  />
                </View>
              </View>
              <View style={styles.parentView}>
                <TouchableOpacity
                  style={{
                    marginLeft: 5,
                    marginRight: 5,
                    paddingBottom: 10,
                    paddingTop: 10,
                  }}
                  onPress={() => {this.props.navigation.replace( 'SweepFunds' )}}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.MediumItalic,
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                      fontSize: RFValue( 13 ),
                      color: Colors.blue,
                    }}
                    onPress={() => {this.props.navigation.replace( 'SweepFunds' )}}
                  >
                    or Use Available Funds
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: RFValue( 12 ),
                      color: Colors.textColorGrey,
                    }}
                  >
                    Lorem ipsum dolor sit
                  </Text>
                </TouchableOpacity>

              </View>
              <View style={{
                marginTop: hp( '4%' )
              }}>
                <View style={styles.confirmView}>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{
                      ...styles.confirmButtonView,
                      backgroundColor: Colors.blue,
                      elevation: 10,
                      shadowColor: Colors.shadowBlue,
                      shadowOpacity: 1,
                      shadowOffset: {
                        width: 15, height: 15
                      },
                    }}
                  >
                    <Text style={styles.buttonText}>
                      {'Confirm & Proceed'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <BottomSheet
          enabledInnerScrolling={true}
          enabledGestureInteraction={false}
          ref={'AccountSelectionBottomSheet'}
          snapPoints={[
            -50,
            Platform.OS == 'ios' && DeviceInfo.hasNotch()
              ? hp( '55%' )
              : hp( '60%' ),
          ]}
          renderContent={() => (
            <AccountSelectionModalContents
              RegularAccountBalance={spendableBalances.regularBalance}
              onPressBack={() => {
                ( this.refs.AccountSelectionBottomSheet as any ).snapTo( 0 )
              }}
              onPressConfirm={( type ) => {
                ( this.refs.AccountSelectionBottomSheet as any ).snapTo( 0 )
                setTimeout( () => {
                  this.setState( {
                    serviceType: type
                  } )
                }, 2 )
              }}
            />
          )}
          renderHeader={() => (
            <SmallHeaderModal
            // onPressHeader={() => {
            //   (this.refs.AccountSelectionBottomSheet as any).snapTo(0);
            // }}
            />
          )}
        />
      </View>
    )
  }
}

const mapStateToProps = ( state ) => {
  return {
    service: idx( state, ( _ ) => _.accounts ),
    transfer: idx( state, ( _ ) => _.accounts ),
    loading: idx( state, ( _ ) => _.accounts ),
    accounts: state.accounts || [],
    averageTxFees: idx( state, ( _ ) => _.accounts.averageTxFees ),
  }
}

export default
connect( mapStateToProps, {
} )( SweepFundsEnterAmount )

const styles = StyleSheet.create( {
  modalHeaderTitleText: {
    color: Colors.blue,
    fontSize: RFValue( 18 ),
    fontFamily: Fonts.Regular,
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: Colors.textColorGrey,
    fontSize: RFValue( 13 ),
    fontFamily: Fonts.Regular,
    textAlign: 'center',
    marginTop: 5,
    width: wp( '15%' ),
  },
  amountText: {
    color: Colors.black,
    fontSize: RFValue( 21 ),
    fontFamily: Fonts.Regular,
  },
  balanceText: {
    color: Colors.blue,
    fontSize: RFValue( 10 ),
    fontFamily: Fonts.Italic,
  },
  parentView: {
    flex: 1,
    marginRight: wp( '6%' ),
    marginLeft: wp( '6%' ),
    paddingTop: wp( '5%' ),
  },
  backArrow: {
    height: 30,
    width: 30,
    justifyContent: 'center',
  },
  sendText: {
    color: Colors.textColorGrey,
    fontFamily: Fonts.Regular,
    fontSize: RFValue( 12 ),
    marginTop: 5,
  },
  confirmView: {
    flexDirection: 'row',
    marginTop: hp( '2%' ),
  },
  currencyImageView: {
    width: wp( '6%' ),
    height: wp( '6%' ),
    justifyContent: 'center',
    alignItems: 'center',
  },
  convertText: {
    width: 2,
    height: '60%',
    backgroundColor: Colors.borderColor,
    marginRight: 5,
    marginLeft: 5,
    alignSelf: 'center',
  },
  enterAmountView: {
    width: 2,
    height: '60%',
    backgroundColor: Colors.borderColor,
    marginRight: 5,
    marginLeft: 5,
    alignSelf: 'center',
  },
  toggleSwitchView: {
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableToSpendView: {
    marginRight: wp( '6%' ),
    marginLeft: wp( '6%' ),
    marginBottom: hp( '0.5%' ),
    marginTop: 5,
    flexDirection: 'row',
  },
  availableToSpendText: {
    color: Colors.blue,
    fontSize: RFValue( 12 ),
    fontFamily: Fonts.Italic,
    lineHeight: 15,
    textAlign: 'center',
  },
  addessText: {
    color: Colors.blue,
    fontSize: RFValue( 10 ),
    fontFamily: Fonts.Italic,
  },
  textTsats: {
    color: Colors.textColorGrey,
    fontSize: RFValue( 7 ),
    fontFamily: Fonts.MediumItalic,
  },
  errorText: {
    fontFamily: Fonts.MediumItalic,
    color: Colors.red,
    fontSize: RFValue( 11 ),
    fontStyle: 'italic',
    marginRight: 10,
  },
  modalHeaderTitleView: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingRight: 10,
    paddingBottom: hp( '1.5%' ),
    paddingTop: hp( '1%' ),
    marginBottom: hp( '0.5%' ),
    width: wp( '90%' ),
  },
  textBoxView: {
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: Colors.borderColor,
  },
  inputBoxFocused: {
    borderRadius: 10,
    elevation: 10,
    borderColor: Colors.borderColor,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowColor: Colors.borderColor,
    backgroundColor: Colors.white,
  },
  textBoxImage: {
    width: wp( '6%' ),
    height: wp( '6%' ),
    resizeMode: 'contain',
  },
  amountInputImage: {
    width: 40,
    height: wp( '13%' ),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textBox: {
    fontSize: RFValue( 13 ),
    color: Colors.textColorGrey,
    fontFamily: Fonts.Regular,
  },
  confirmButtonView: {
    width: wp( '50%' ),
    height: wp( '13%' ),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: RFValue( 13 ),
    fontFamily: Fonts.Medium,
  },
  totalMountView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp( '2%' ),
    marginBottom: 5,
    marginRight: wp( '6%' ),
    marginLeft: wp( '6%' ),
    paddingBottom: hp( '1%' ),
    // paddingTop: hp('1.5%'),
  },
  totalAmountText: {
    color: Colors.blue,
    fontSize: RFValue( 13 ),
    fontFamily: Fonts.Regular,
    marginLeft: 5,
  },
  totalAmountSubText: {
    color: Colors.textColorGrey,
    fontSize: RFValue( 11 ),
    fontFamily: Fonts.Regular,
    marginLeft: 5,
  },
  sweepingFromText: {
    color: Colors.textColorGrey,
    fontSize: RFValue( 12 ),
    fontFamily: Fonts.Regular,
    marginLeft: 5,
  },
} )
