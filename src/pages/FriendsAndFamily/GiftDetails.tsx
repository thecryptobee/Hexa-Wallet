import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import {
  heightPercentageToDP as hp, widthPercentageToDP as wp
} from 'react-native-responsive-screen'
import { useDispatch, useSelector } from 'react-redux'
import CheckingAcc from '../../assets/images/svgs/gift_icon_new.svg'
import ArrowDown from '../../assets/images/svgs/icon_arrow_down.svg'
import ArrowUp from '../../assets/images/svgs/icon_arrow_up.svg'
import {
  Gift,
  GiftStatus,
  GiftType,
  TrustedContact
} from '../../bitcoin/utilities/Interface'
import Colors from '../../common/Colors'
import { SATOSHIS_IN_BTC } from '../../common/constants/Bitcoin'
import CurrencyKind from '../../common/data/enums/CurrencyKind'
import Fonts from '../../common/Fonts'
import ImageStyles from '../../common/Styles/ImageStyles'
import HeaderTitle from '../../components/HeaderTitle'
import ModalContainer from '../../components/home/ModalContainer'
import RecipientAvatar from '../../components/RecipientAvatar'
import {
  reclaimGift
} from '../../store/actions/trustedContacts'
import useCurrencyCode from '../../utils/hooks/state-selectors/UseCurrencyCode'
import AddGiftToAccount from './AddGiftToAccount'
import ThemeList from './Theme'


const GiftDetails = ( { route, navigation } ) => {


  const dispatch = useDispatch()
  const {
    title,
    contactName,
    contact,
    gift,
    avatar,
    contactDetails,
  }: {
    title: string;
    contactName: string;
    contact: TrustedContact,
    gift: Gift;
    avatar: boolean;
    contactDetails: any;
  } = route.params

  const [ isOpen, setIsOpen ] = useState( false )
  const [ acceptGift, setAcceptGiftModal ] = useState( false )

  const currencyKind = useSelector(
    ( state ) => state.preferences.giftCurrencyKind,
  )
  const currencyCode = useCurrencyCode()
  const exchangeRates = useSelector(
    ( state ) => state.accounts.exchangeRates
  )
  const prefersBitcoin = useMemo( () => {
    return currencyKind === CurrencyKind.BITCOIN
  }, [ currencyKind ] )

  const deepLinkConfig = contact? contact.deepLinkConfig: gift.deepLinkConfig ? gift.deepLinkConfig: null

  useEffect( ()=> {
    if( gift.status === GiftStatus.SENT ) setIsOpen( true )
  }, [ gift ] )

  const numberWithCommas = ( x ) => {
    return x ? x.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' ) : ''
  }

  const getTheme = () => {
    // props.themeId
    const filteredArr = ThemeList.filter( ( item ) => item.id === gift.themeId )
    return filteredArr[ 0 ]
  }

  const bottomButton = ( onPressButton, text ) =>{
    return <TouchableOpacity
      style={styles.bottomButton}
      onPress={() => onPressButton()}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  }

  const getAmt = ( sats ) => {
    if( prefersBitcoin ) {
      return numberWithCommas( sats )
    } else {
      if( exchangeRates && exchangeRates[ currencyCode ] ) {
        return ( exchangeRates[ currencyCode ].last /SATOSHIS_IN_BTC * sats ).toFixed( 2 )
      } else {
        return numberWithCommas( sats )
      }
    }
  }


  return (
    <SafeAreaView style={styles.viewContainer}>
      <StatusBar
        backgroundColor={Colors.backgroundColor}
        barStyle="dark-content"
      />
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginRight: wp( 4 ),
          }}
        >
          <HeaderTitle
            navigation={navigation}
            backButton={true}
            firstLineTitle={'Gift Details'}
            secondLineTitle={'Logs of Gift status appear here'}
            infoTextNormal={''}
            infoTextBold={''}
            infoTextNormal1={''}
            step={''}
          />
        </View>
        <TouchableOpacity
          onPress={() => setIsOpen( !isOpen )}
          style={
            gift.status === GiftStatus.SENT
              ? [
                styles.dashedContainer,
              ]
              :
              [
                styles.dashedContainer,
                {
                  borderColor: Colors.white,
                  shadowOpacity: isOpen ? 1 : 0,
                  borderWidth: 1
                },
              ]
          }
        >
          <View
            style={
              gift.status === GiftStatus.SENT
                ? styles.dashedStyle
                : styles.normalStyle
            }
          >
            <View
              style={{
                marginHorizontal: wp( 1 ),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  color: Colors.lightTextColor,
                  fontSize: RFValue( 10 ),
                  fontFamily: Fonts.Regular,
                  fontWeight: '600',
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  color: Colors.lightTextColor,
                  fontSize: RFValue( 10 ),
                  fontFamily: Fonts.Regular,
                }}
              >
                {moment( gift.timestamps.created ).format( 'lll' )}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: hp( 1 ),
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                {avatar && contactName && contactDetails ? (
                  <View style={styles.avatarContainer}>
                    <RecipientAvatar
                      recipient={contactDetails}
                      contentContainerStyle={styles.avatarImage}
                    />
                  </View>
                ) : (
                  <CheckingAcc />
                )}
                <View
                  style={{
                    marginLeft: wp( 1 ),
                    alignSelf: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: Colors.textColorGrey,
                      fontSize: RFValue( 11 ),
                      fontFamily: Fonts.Regular,
                      fontWeight: '600',
                    }}
                  >
                    {contactName ? contactName : 'From Checking Account'}
                  </Text>
                  {/* <Text style={styles.subText}>
                    {walletName ?? 'Lorem ipsum dolor'}
                  </Text> */}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: RFValue( 18 ),
                    fontFamily: Fonts.Regular,
                    marginHorizontal: wp( 2 ),
                  }}
                >
                  {getAmt( gift.amount )}
                  <Text
                    style={{
                      color: Colors.lightTextColor,
                      fontSize: RFValue( 10 ),
                      fontFamily: Fonts.Regular,
                    }}
                  >
                    {prefersBitcoin ? ' sats' : ` ${currencyCode}`}
                  </Text>
                </Text>
                {gift.status !== GiftStatus.CREATED ? (
                  isOpen ? (
                    <ArrowUp />
                  ) : (
                    <ArrowDown />
                  )
                ) : null}
              </View>
            </View>
            {isOpen &&
            gift.status !== GiftStatus.CREATED &&
            gift.type === GiftType.SENT && gift.note &&
            gift.note !== '' && (
              <View
                style={{
                  marginHorizontal: wp( 1 ),
                }}
              >
                <Text
                  style={{
                    color: Colors.lightTextColor,
                    fontSize: RFValue( 10 ),
                    fontFamily: Fonts.Regular,
                    fontWeight: '600',
                  }}
                >
                  Message to recipient
                </Text>
                <View
                  style={{
                    marginLeft: wp( 3 ),
                    marginVertical: hp( 2 ),
                    backgroundColor: Colors.backgroundColor,
                    marginHorizontal: wp( 2 ),
                    borderRadius: wp( 2 ),
                    marginRight: wp( 9 ),
                  }}
                >
                  <Text
                    style={{
                      marginHorizontal: wp( 3 ),
                      marginVertical: wp( 2 ),
                      color: Colors.textColorGrey,
                      fontSize: RFValue( 10 ),
                      letterSpacing: 0.5,
                      fontFamily: Fonts.Regular,
                    }}
                  >
                    {gift.note}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={{
          backgroundColor: Colors.backgroundColor,
          paddingBottom: hp( 4 ),
          marginTop: 10
        }}>
          <View>
            <View
              style={{
                marginLeft: wp( 7 ),
              }}
            >
              <Text
                style={{
                  ...styles.modalTitleText,
                  fontSize: 14,
                  fontFamily: Fonts.Regular,
                }}
              >
              Second Factor used for encryption
              </Text>
            </View>
            <View
              style={styles.deepLinkEncryptionTextContainer}
            >
              <Text style={styles.deepLinkEncryptionText}>
                {deepLinkConfig?.encryptionKey == undefined ? 'No Second Factor' : deepLinkConfig?.encryptionKey}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginVertical: hp( 2 ),
            // backgroundColor:'hotpink',
            marginBottom:hp( Platform.OS == 'ios' ? 12 : 10 ),
          }}
        >
          {Object.entries( gift.timestamps ?? {
          } )
            .reverse()
            .map( ( item, index ) => {
              if (
                gift.type === GiftType.RECEIVED &&
                ( item[ 0 ] == 'created' ||
                  item[ 0 ] == 'sent' ||
                  item[ 0 ] == 'reclaimed' ||
                  item[ 0 ] == 'associated' )
              ) {
                return null
              }
              return (
                <View key={index} style={styles.timeInfo}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}
                  >
                    <View style={styles.dot} />
                    <Text
                      style={{
                        color: Colors.lightTextColor,
                        fontSize: RFValue( 10 ),
                        fontFamily: Fonts.Regular,
                        fontWeight: '600',
                      }}
                    >
                      {moment( item[ 1 ] ).format( 'lll' )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                    }}
                  >
                    <View style={styles.line} />
                    <View
                      style={[
                        {
                          width: wp( '80%' ),
                          borderRadius: wp( 2 ),
                          paddingVertical: hp( 1.5 ),
                          marginTop: hp( 1 ),
                          marginBottom: hp( 1 ),
                          backgroundColor: Colors.gray7,
                          paddingHorizontal: hp( 1.5 ),
                        },
                      ]}
                    >
                      <Text style={styles.modalInfoText}>
                        Gift {item[ 0 ]}
                      </Text>
                      {/* <Text style={styles.subText}>Lorem ipsum dolor sit amet</Text> */}
                    </View>
                  </View>
                </View>
              )
            } )}

        </View>

        <ModalContainer onBackground={()=>setAcceptGiftModal( false )} visible={acceptGift} closeBottomSheet={() => {}}>
          <View style={styles.modalContentContainer}>
            <AddGiftToAccount
              getTheme={getTheme}
              navigation={navigation}
              giftAmount={gift.amount}
              giftId={( gift as Gift ).id}
              onCancel={() => setAcceptGiftModal( false )}
              closeModal={()=>setAcceptGiftModal( false )}
            />
          </View>
        </ModalContainer>
      </ScrollView>
      <View style={{
        marginBottom: wp( '0%' ), flexDirection: 'row',
        justifyContent: 'space-evenly', paddingHorizontal: wp( '2%' ),
        paddingVertical: wp( '4%' ),
        position:'absolute', width:'100%', bottom:0, backgroundColor: Colors.backgroundColor,
      }}>
        {/* Reclaim */}
        {gift.status === GiftStatus.SENT && gift.type === GiftType.SENT ? (
          bottomButton( () => {
            dispatch( reclaimGift( gift.id ) )
            navigation.navigate( 'ManageGifts', {
              giftType : '1'
            } )
          }, 'Reclaim' )
        ) : null}
        {/* Resend */}
        { ( ( gift.type === GiftType.SENT && [ GiftStatus.CREATED, GiftStatus.RECLAIMED, GiftStatus.SENT, GiftStatus.REJECTED ].includes( gift.status ) ) || ( gift.type === GiftType.RECEIVED && gift.status === GiftStatus.ACCEPTED ) ) ? ( bottomButton( () => {
          navigation.navigate( 'EnterGiftDetails', {
            giftId: ( gift as Gift ).id,
            giftMsg:gift.note,
            setActiveTab: route.params.setActiveTab
          } )
        }, gift.status === GiftStatus.SENT ? 'Resend' : 'Send Gift' ) ) : null}
        {/* Add To Account */}
        {( ( gift.type === GiftType.SENT && [ GiftStatus.CREATED, GiftStatus.REJECTED, GiftStatus.RECLAIMED ].includes( gift.status ) ) || ( gift.type === GiftType.RECEIVED && gift.status === GiftStatus.ACCEPTED ) )
        && !gift.receiver.accountId ? (
            bottomButton( () => {
              setAcceptGiftModal( true )
            }, 'Add To Account' )
          ) : null}
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create( {
  avatarImage: {
    ...ImageStyles.thumbnailImageMedium,
    borderRadius: wp( 9 ) / 2,
    marginHorizontal: wp( 1 ),
  },
  line: {
    height: hp( 7.2 ),
    width: wp( 0.05 ),
    backgroundColor: Colors.currencyGray,
    marginHorizontal: wp( 3 ),
  },
  subText: {
    color: Colors.lightTextColor,
    fontSize: RFValue( 10 ),
    fontFamily: Fonts.Regular,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 8 / 2,
    backgroundColor: Colors.lightTextColor,
    marginHorizontal: wp( 2 ),
    alignSelf: 'center'
  },
  timeInfo: {
    width: '87%',
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  dashedStyle: {
    backgroundColor: Colors.gray7,
    borderRadius: wp( 2 ),
    paddingTop: hp( 1 ),
    paddingHorizontal: wp( 4 ),
    borderColor: Colors.lightBlue,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  normalStyle: {
    backgroundColor: Colors.gray7,
    paddingTop: hp( 1 ),
    paddingHorizontal: wp( 2 ),
  },
  dashedContainer: {
    width: '90%',
    backgroundColor: Colors.gray7,
    shadowColor: '#6C6C6C1A',
    shadowOpacity: 1,
    shadowOffset: {
      width: 10,
      height: 10
    },
    shadowRadius: 10,
    elevation: 6,
    alignSelf: 'center',
    borderRadius: wp( 2 ),
    marginTop: hp( 1 ),
    marginBottom: hp( 1 ),
    paddingVertical: wp( 1 ),
    paddingHorizontal: wp( 1 ),
    borderColor: Colors.lightBlue,
    borderWidth: 1,
  },
  avatarContainer: {
    ...ImageStyles.circledAvatarContainer,
    ...ImageStyles.thumbnailImageMedium,
    borderRadius: wp( 9 ) / 2,
  },
  bottomButton: {
    backgroundColor: Colors.blue,
    height: wp( '13%' ),
    width: '40%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.borderColor,
    alignSelf: 'center',
    paddingLeft: wp( '5%' ),
    paddingRight: wp( '5%' ),
  },
  buttonText: {
    color: Colors.backgroundColor1,
    fontSize: RFValue( 15 ),
    letterSpacing: 0.01,
    fontFamily: Fonts.Medium,
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'center'
  },
  modalTitleText: {
    color: Colors.blue,
    fontSize: RFValue( 18 ),
    fontFamily: Fonts.Regular,
  },
  modalInfoText: {
    color: Colors.textColorGrey,
    fontSize: RFValue( 12 ),
    fontFamily: Fonts.Regular,
    marginRight: wp( 10 ),
  },
  modalContentContainer: {
    backgroundColor: Colors.backgroundColor,
    paddingBottom: hp( 4 ),
  },
  viewContainer: {
    // flex: 1,
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor,
  },
  buttonView: {
    height: wp( '12%' ),
    // width: wp( '27%' ),
    paddingHorizontal: wp( 2 ),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: Colors.shadowBlue,
    shadowOpacity: 1,
    shadowOffset: {
      width: 15,
      height: 15,
    },
    backgroundColor: Colors.blue,
    marginLeft: wp( 2 ),
  },
  inputBox: {
    borderWidth: 0.5,
    borderRadius: 10,
    width: wp( '85%' ),
    height: 50,
    paddingLeft: 15,
    fontSize: RFValue( 13 ),
    color: Colors.textColorGrey,
    fontFamily: Fonts.Regular,
  },
  deepLinkEncryptionText: {
    color: Colors.textColorGrey,
    fontSize: RFValue( 12 ),
    fontFamily: Fonts.Regular,
    marginRight: wp( 10 ),
    justifyContent:'center',
    textAlign: 'center',
    letterSpacing: 2
  },
  deepLinkEncryptionTextContainer: {
    width: wp( '80%' ),
    borderRadius: wp( 2 ),
    paddingVertical: hp( 1.5 ),
    marginTop: hp( 1 ),
    marginLeft: 40,
    backgroundColor: Colors.gray7,
    paddingHorizontal: hp( 1.5 ),
  }
} )

export default GiftDetails
