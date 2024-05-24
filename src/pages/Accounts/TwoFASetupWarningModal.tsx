import React from 'react';
import {
  StyleSheet, Text, View
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp, widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Colors from '../../common/Colors';
import Fonts from '../../common/Fonts';
import { AppBottomSheetTouchableWrapper } from '../../components/AppBottomSheetTouchableWrapper';
import BottomInfoBox from '../../components/BottomInfoBox';

export default function TwoFASetupWarningModal(props) {
  return (
    <View style={styles.modalContainer}>
        <View style={styles.bodyView}>
          <BottomInfoBox
            title={'Note'}
            infoText={
              "Please ensure that you have 2FA set up (preferably on your Keeper device). A 2FA code will be required to send bitcoin from the Savings Account."
            }
          />

          <View style={styles.bottomButtonView}>
            <AppBottomSheetTouchableWrapper
              onPress={() => props.onPressOk()}
              style={{
                ...styles.confirmButtonView,
                backgroundColor: Colors.blue,
                elevation: 10,
                shadowColor: Colors.shadowBlue,
                shadowOpacity: 1,
                marginRight: 5,
                shadowOffset: { width: 15, height: 15 },
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: RFValue(13),
                  fontFamily: Fonts.Regular,
                }}
              >
                Ok, I understand
              </Text>
            </AppBottomSheetTouchableWrapper>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  confirmButtonView: {
    width: wp('40%'),
    height: wp('13%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalContainer: {
    height: '100%',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: hp('2%'),
  },
  bottomButtonView: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  bodyView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
});
