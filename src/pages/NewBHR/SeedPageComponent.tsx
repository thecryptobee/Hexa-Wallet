import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert, Animated, Dimensions, FlatList, Keyboard, StyleSheet, Text, TouchableOpacity, View
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PagerView, { PagerViewOnPageScrollEventData, PagerViewOnPageSelectedEventData } from 'react-native-pager-view'
import { RFValue } from 'react-native-responsive-fontsize'
import {
  heightPercentageToDP as hp, widthPercentageToDP as wp
} from 'react-native-responsive-screen'
import { RootStateOrAny, useSelector } from 'react-redux'
import { Wallet } from '../../bitcoin/utilities/Interface'
import Colors from '../../common/Colors'
import { translations } from '../../common/content/LocContext'
import Fonts from '../../common/Fonts'
import dbManager from '../../storage/realm/dbManager'

const AnimatedPagerView = Animated.createAnimatedComponent( PagerView )

const { height } = Dimensions.get( 'window' )

const SeedPageComponent = ( props ) => {
  const strings = translations[ 'bhr' ]
  const wallet: Wallet = useSelector( ( state: RootStateOrAny ) => state.storage.wallet )
  const [ SelectedOption, setSelectedOption ] = useState( -1 )
  const SelectOption = ( Id ) => {
  }

  const dbWallet = dbManager.getWallet()
  const walletObj = JSON.parse( JSON.stringify( dbWallet ) )
  const primaryMnemonic = walletObj.primaryMnemonic
  const seed = primaryMnemonic.split( ' ' )
  const seedData = seed.map( ( word, index ) => {
    return {
      name: word, id: ( index + 1 )
    }
  } )

  const [ total, setTotal ] = useState( 0 )
  const [ partialSeedData, setPartialSeedData ] = useState( [] )
  const [ currentPosition, setCurrentPosition ] = useState( 0 )

  const width = Dimensions.get( 'window' ).width
  const ref = useRef<PagerView>( null )
  const scrollOffsetAnimatedValue = useRef( new Animated.Value( 0 ) ).current
  const positionAnimatedValue = useRef( new Animated.Value( 0 ) ).current
  const onPageSelectedPosition = useRef( new Animated.Value( 0 ) ).current
  const inputRange = [ 0, partialSeedData.length ]
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate( {
    inputRange,
    outputRange: [ 0, partialSeedData.length * width ],
  } )

  useEffect( () => {
    const tempData = []
    let innerTempData = []
    let initPosition = 0
    let lastPosition = 12
    const totalLength = seedData.length
    seedData.map( ( item, index ) => {
      if ( index != 0 && index % 12 == 0 ) {
        initPosition = initPosition + 12
        lastPosition = ( lastPosition + 12 > totalLength ) ? totalLength : lastPosition
        tempData.push( innerTempData )
        innerTempData = []
      }
      innerTempData.push( item )
    } )
    if ( innerTempData.length > 0 ) {
      tempData.push( innerTempData )
    }
    setPartialSeedData( tempData )
    setTotal( totalLength )
  }, [] )

  const onNextClick = () => {
    setSelectedOption( -1 )
    const nextPosition = currentPosition + 1
    setCurrentPosition( nextPosition )
    ref.current?.setPage( nextPosition )
    props.setHeaderMessage( 'Last 12 Backup phrase' )
  }

  const onProceedClick = () => {
    setSelectedOption( -1 )
    let seed = ''
    let showValidation = false
    seedData.forEach( ( { name } ) => {
      if ( name == null || name == '' ) {
        showValidation = true
        return
      }
      if ( !seed ) seed = name
      else seed = seed + ' ' + name
    } )
    if ( showValidation ) {
      Alert.alert( 'Please fill all Backup Phrase' )
    } else {
      props.onPressConfirm( seed, seedData )
    }
  }

  const onPreviousClick = () => {
    setSelectedOption( -1 )
    const nextPosition = currentPosition - 1
    setCurrentPosition( nextPosition )
    ref.current?.setPage( nextPosition )
    props.setHeaderMessage( 'Backup phrase' )
  }

  const getFormattedNumber = ( number ) => {
    if ( number < 10 ) return '0' + number
    else return number + ''
  }

  const getPlaceholder = ( index ) => {
    if ( index == 1 ) return index + 'st'
    else if ( index == 2 ) return index + 'nd'
    else if ( index == 3 ) return index + 'rd'
    else return index + 'th'
  }

  const getIndex = ( index, seedIndex ) => {
    const newIndex = index + 1 + ( seedIndex * 12 )

    return newIndex
  }

  const getTextIndex = ( index ) => {
    const newIndex = index
    return newIndex
  }

  const getSecureData = ( text ) => {
    let secureText = ''
    for( let i = 0; i< 8;i++ ){
      secureText+='*'
    }
    return secureText
  }

  const onPageScroll = useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        }
      ),
    []
  )

  const onPageSelected = useMemo(
    () =>
      Animated.event<PagerViewOnPageSelectedEventData>(
        [ {
          nativeEvent: {
            position: onPageSelectedPosition
          }
        } ],
        {
          listener: ( { nativeEvent: { position } } ) => {
            setCurrentPosition( position )
            if ( position == 0 )
              props.setHeaderMessage( 'Backup phrase' )
            else
              props.setHeaderMessage( 'Last 12 Backup phrase' )
          },
          useNativeDriver: true,
        }
      ),
    []
  )

  return (
    <View style={{
      flex: 1
    }} >
      {partialSeedData && partialSeedData.length > 0 && partialSeedData[ currentPosition ] != undefined &&
        partialSeedData[ currentPosition ] ? (
          <AnimatedPagerView
            initialPage={0}
            ref={ref}
            style={{
              flex: 1
            }}
            onPageScroll={onPageScroll}
            onPageSelected={onPageSelected}
          >
            {partialSeedData.map( ( seedItem, seedIndex ) => (
              <View key={seedIndex} style={{
                marginTop: 10
              }} >
                <FlatList
                  keyExtractor={( item, index ) => index.toString()}
                  data={seedItem}
                  extraData={seedItem}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  scrollEnabled={false}
                  nestedScrollEnabled={false}
                  contentContainerStyle={{
                    marginStart: 15
                  }}
                  // removeClippedSubviews={false}
                  // keyboardDismissMode={true}
                  // keyboardShouldPersistTaps='always'
                  renderItem={( { value, index } ) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => SelectOption( value?.id )}
                        style={styles.historyCard}
                      >
                        <View style={styles.numberContainer}>
                          <View style={styles.numberInnerContainer}>
                            <Text style={styles.numberText}>{
                              getFormattedNumber( getIndex( index, seedIndex ) )
                            }</Text>
                          </View>
                        </View>
                        <TouchableOpacity style={styles.modalInputContainer}
                          onPress={() => {
                            setSelectedOption( index )
                            Keyboard.dismiss()
                          }}>
                          <Text style={[ styles.modalInputBox,
                            partialSeedData[ currentPosition ][ getTextIndex( index ) ]?.name.length > 0 ? styles.selectedInput : null,
                          // value?.name.length > 0 ? styles.selectedInput : null,
                          ]}>
                            {index == SelectedOption
                              ? partialSeedData[ currentPosition ][ getTextIndex( index ) ]?.name
                              : getSecureData( partialSeedData[ currentPosition ][ getTextIndex( index ) ]?.name )}
                          </Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    )
                  }}
                />
              </View>
            ) )}
          </AnimatedPagerView>
        ) : (
          <View style={{
            // flex: 1,
          }}>
          </View>
        )}
      {props.showButton ? <View>
        <View style={[ styles.bottomButtonView ]}>
          {props.confirmButtonText ? (
            <TouchableOpacity
              onPress={() => { ( currentPosition + 1 ) * 12 < total ? onNextClick() : onProceedClick() }}
              delayPressIn={0}
              disabled={props.confirmDisable ? props.confirmDisable : false}
            >
              <LinearGradient colors={[ Colors.blue, Colors.darkBlue ]}
                start={{
                  x: 0, y: 0
                }} end={{
                  x: 1, y: 0
                }}
                locations={[ 0.2, 1 ]}
                style={{
                  ...styles.successModalButtonView,
                  backgroundColor: props.confirmDisable
                    ? Colors.lightBlue
                    : Colors.blue,
                }}
              >
                <Text
                  style={{
                    ...styles.proceedButtonText,
                    color: Colors.white,
                  }}
                >
                  {( currentPosition + 1 ) * 12 < total ? props.confirmButtonText : props.proceedButtonText}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
          {props.isChangeKeeperAllow ? (
            <TouchableOpacity
              disabled={props.disableChange ? props.disableChange : false}
              onPress={() => { ( currentPosition * 12 ) != 0 ? onPreviousClick() : props.onPressChange() }}
              style={{
                marginLeft: 10,
                height: wp( '13%' ),
                width: wp( '25%' ),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              delayPressIn={0}
            >
              <Text
                style={{
                  ...styles.proceedButtonText,
                  color: props.disableChange ? Colors.lightBlue : Colors.blue,
                }}
              >
                {( currentPosition * 12 ) != 0 ? props.previousButtonText : props.changeButtonText}
              </Text>
            </TouchableOpacity>
          ) : null}
          {seedData.length > 12 && <View style={{
            flexDirection: 'row'
          }}>
            {
              partialSeedData.map( ( item, index ) => {
                return (
                  <View key={( index )} style={currentPosition == index ? styles.selectedDot : styles.unSelectedDot} />
                )
              } )
            }
          </View>}
        </View>
      </View> : null
      }
    </View>
  )
}

export default SeedPageComponent

const styles = StyleSheet.create( {
  successModalButtonView: {
    height: wp( '13%' ),
    width: wp( '40%' ),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    // elevation: 10,
    backgroundColor: Colors.blue,
    alignSelf: 'center',
  },
  proceedButtonText: {
    color: Colors.white,
    fontSize: RFValue( 13 ),
    fontFamily: Fonts.Medium,
  },
  historyCard: {
    marginEnd: 15,
    flex: 1 / 2,
    paddingHorizontal: wp( 2 ),
    paddingVertical: height > 760 ? hp( 1 ) : 0,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height > 720 ? 15 : height > 650 ? 10 : 5,
    borderRadius: 10,
    backgroundColor: Colors.backgroundColor1
  },
  bottomButtonView: {
    height: hp( '13%' ),
    flexDirection: 'row',
    // marginTop: 'auto',
    alignItems: 'center',
    marginLeft: wp( '8%' ),
    marginRight: wp( '8%' ),
  },
  numberContainer: {
    margin: 5,
    height: height > 720 ? ( 50 ) : height > 650 ? ( 45 ) : ( 30 ),
    width: height > 720 ? ( 50 ) : height > 650 ? ( 45 ) : ( 30 ),
    borderRadius: height > 720 ? ( 25 ) : ( 15 ),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  numberInnerContainer: {
    backgroundColor: Colors.numberBg,
    borderRadius: ( 23 ),
    height: height > 720 ? ( 46 ) : height > 650 ? ( 41 ) : ( 26 ),
    width: height > 720 ? ( 46 ) : height > 650 ? ( 41 ) : ( 26 ),
    margin: ( 4 ),
    justifyContent: 'center',
    alignItems: 'center'
  },
  numberText: {
    color: Colors.numberFont,
    fontSize: RFValue( 20 ),
    fontFamily: Fonts.Regular,
    // marginEnd: 10
  },
  modalInputContainer:{
    width: '70%',
    height: 50,
    justifyContent:'center',
    paddingLeft: 15,
    // backgroundColor: 'red'
  },
  modalInputBox: {
    fontSize: RFValue( 13 ),
    color: Colors.textColorGrey,
    fontFamily: Fonts.Regular,
  },
  selectedInput: {
    shadowColor: Colors.shadowBlack,
    shadowOpacity: 1,
    shadowOffset: {
      width: 15,
      height: 15,
    },
  },
  selectedDot: {
    width: 25,
    height: 5,
    borderRadius: 5,
    backgroundColor: Colors.blue,
    marginEnd: 5
  },
  unSelectedDot: {
    width: 6,
    height: 5,
    borderRadius: 5,
    backgroundColor: Colors.primaryAccentLighter2,
    marginEnd: 5
  }
} )
