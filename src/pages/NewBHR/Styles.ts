import { StyleSheet } from 'react-native'
import Colors from '../../common/Colors'
import Fonts from '../../common/Fonts'
import { RFValue } from 'react-native-responsive-fontsize'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'

export default StyleSheet.create( {
  otpText: {
    color: Colors.black,
    fontFamily: Fonts.Regular,
    fontSize: RFValue( 23 ),
    // margin: 9,
    alignSelf: 'center'
  },
  otpTextView: {
    height: wp( '9%' ),
    width: wp( '9%' ),
    backgroundColor: Colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin:5
  },
  otpView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp( '5%' ),
  },
  cardIconImage: {
    width: 14,
    height: 16,
    resizeMode: 'contain',
    marginLeft: 'auto'
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    height: 54,
    backgroundColor: Colors.white,
    borderBottomColor: Colors.white,
    borderBottomWidth: 0.5,
  },
  headerLeftIconContainer: {
    height: 54
  },
  headerLeftIconInnerContainer:{
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer1: {
    height: '100%',
    alignSelf: 'center',
    width: '100%'
  },
  modalContainer: {
    height: '100%',
    width: '100%'
  },
  modalHeaderTitleView: {
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 10,
    paddingBottom: hp( '1.5%' ),
    paddingTop: hp( '1%' ),
    marginLeft: 10,
    marginRight: 10,
    marginBottom: hp( '1.5%' )
  },
  modalHeaderTitleText: {
    color: Colors.blue,
    fontSize: RFValue( 18 ),
    fontFamily: Fonts.Medium
  },
  modalHeaderInfoText: {
    color: Colors.textColorGrey,
    fontFamily: Fonts.Regular,
    fontSize: RFValue( 12 ),
    marginTop: 5
  },
  modalContentView: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  }
} )
