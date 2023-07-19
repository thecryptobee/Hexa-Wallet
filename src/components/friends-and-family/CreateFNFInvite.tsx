import React, { useContext, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { RFValue } from 'react-native-responsive-fontsize'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

import Colors from '../../common/Colors'
import { AppBottomSheetTouchableWrapper } from '../AppBottomSheetTouchableWrapper'
import { LocalizationContext } from '../../common/content/LocContext'
import Gifts from '../../assets/images/satCards/gifts.svg'
import Add_gifts from '../../assets/images/satCards/Add_gifts.svg'
import Fonts from '../../common/Fonts'
import ArrowRight from '../../assets/images/svgs/icon_arrow_right.svg'

export type Props = {
  closeModal: () => {};
  sendRequestToContact: () => {};
  createGifts: () => {};
};

const CreateFNFInvite = ( props: Props ) => {
  const { translations } = useContext( LocalizationContext )
  return (
    <View style={styles.modalContentContainer}>
      <AppBottomSheetTouchableWrapper
        onPress={() => props.closeModal()}
        style={{
          width: wp( 7 ),
          height: wp( 7 ),
          borderRadius: wp( 7 / 2 ),
          alignSelf: 'flex-end',
          backgroundColor: Colors.CLOSE_ICON_COLOR,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: wp( 3 ),
          marginRight: wp( 3 ),
        }}
      >
        <FontAwesome
          name="close"
          color={Colors.white}
          size={19}
          style={
            {
              // marginTop: hp( 0.5 )
            }
          }
        />
      </AppBottomSheetTouchableWrapper>
      <View style={{
        padding: 10
      }}>
        <View style={{
          marginBottom: 40
        }}>
          <Text
            style={[
              styles.titleText,
              {
                fontSize: RFValue( 14 ), marginBottom: 10,
                fontFamily: Fonts.Medium,
              },
            ]}
          >
            Create an F{'&'}F invite
          </Text>
        </View>
        <TouchableOpacity
          style={styles.cardBackView}
          onPress={() => props.sendRequestToContact()}
        >
          <View style={{
            width: '18%', paddingRight:20
          }}>
            <Add_gifts />
          </View>
          <View style={{
            width: '82%', paddingRight:10
          }}>
            <Text style={ styles.subtitleText }>
              Create Invitation link
            </Text>
            <Text style={styles.paragraphTitleText}>
              Send an invite link to any of your family and friends using
              generated link
            </Text>
          </View>
          <ArrowRight/>

        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardBackView}
          onPress={() => props.createGifts()}
        >
          <View style={{
            width: '18%', paddingRight:20
          }}>
            <Gifts />
          </View>
          <View style={{
            width: '82%', paddingRight:10
          }}>
            <Text style={ styles.subtitleText}>
              Create Invitation link with gift
            </Text>
            <Text style={styles.paragraphTitleText}>
              Add gifts when sending an invite link to any of your family and
              friends using the generated link
            </Text>
          </View>
          <ArrowRight/>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles = StyleSheet.create( {
  modalContentContainer: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    padding: 10,
    paddingBottom:70
  },
  titleText: {
    color: Colors.blueText,
    fontWeight: '600',
    marginBottom: 5,
  },
  subtitleText: {
    color: Colors.THEAM_INFO_TEXT_COLOR,
    marginBottom: 5,
    fontSize: RFValue( 12 ),
    fontFamily: Fonts.Regular
  },
  paragraphTitleText: {
    fontSize: 12,
    color: Colors.gray3,
    textAlign: 'left',
    flexWrap: 'wrap',
    fontFamily: Fonts.Regular

  },
  cardBackView: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.white,
    paddingVertical: 30,
    paddingHorizontal:20,
    marginVertical: 5,
    borderRadius: 10,
  },
} )
export default CreateFNFInvite
