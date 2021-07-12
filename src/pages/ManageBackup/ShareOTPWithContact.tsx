import React, { useState } from 'react';
import { View, Text, StyleSheet, Clipboard, TouchableOpacity } from 'react-native';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../common/Colors';
import Fonts from '../../common/Fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from '../../components/Toast';
import CountDown from 'react-native-countdown-component';
import Config from '../../bitcoin/HexaConfig';
import CopyOTP from '../../components/CopyOtp';
import { AppBottomSheetTouchableWrapper } from '../../components/AppBottomSheetTouchableWrapper';

export default function ShareOtpWithContact(props) {
	const [isCopied, setIsCopied] = useState(false)
	const TC_REQUEST_EXPIRY = Config.TC_REQUEST_EXPIRY / 1000;
	const OTP = props.OTP;
	const index = props.index;
	return (
		<View style={styles.modalContainer}>
			<View style={styles.modalHeaderTitleView}>
				<View style={{ flexDirection: 'row', flex: 1 }}>
					{/* <AppBottomSheetTouchableWrapper onPress={() => { props.onPressBack(); }} style={{ height: 30, width: 30 }} >
            <FontAwesome name="long-arrow-left" color={Colors.blue} size={17} />
          </AppBottomSheetTouchableWrapper> */}
					<View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text style={styles.modalHeaderTitleText}>
								Share OTP with{'\n'}trusted contact
            </Text>
							<AppBottomSheetTouchableWrapper
								onPress={() => props.onPressOk(index)}
								style={{
									height: wp('8%'),
									width: wp('18%'),
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor: Colors.lightBlue,
									justifyContent: 'center',
									borderRadius: 8,
									alignSelf: 'center',
								}}
							>
								<Text
									style={{
										color: Colors.white,
										fontSize: RFValue(14),
										fontFamily: Fonts.FiraSansRegular,
									}}
								>
									Close
              </Text>
								<Ionicons color={Colors.white} size={18} name={'close-outline'} />
							</AppBottomSheetTouchableWrapper>
						</View>
						<Text numberOfLines={2} style={styles.modalHeaderInfoText}>
							Please provide this OTP to your trusted contact in order for them to send you the recovery secret
            </Text>
						{/* <Text numberOfLines={2} style={styles.modalHeaderInfoText}>
              Please make sure you use a different to channel to send the OTP
            </Text> */}
					</View>
				</View>
			</View>
			<View style={{ flex: 1, marginLeft: 30, marginRight: 30 }}>
				<CopyOTP OTP={OTP} setIsCopied={setIsCopied} />
				<Text numberOfLines={2} style={[styles.modalHeaderInfoText, { marginTop: hp('7%'), }]}>
					This OTP is only valid for 24 hours, if the OTP expires you
          will be asked to create a new one
        </Text>
				<View style={styles.separator} />
				{isCopied ?
					<View
						style={{
							height: wp('12%'),
							width: wp('81%'),
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: Colors.blue,
							justifyContent: 'flex-start',
							borderRadius: 8,
							alignSelf: 'center',
						}}
					>
						<Ionicons color={Colors.white} size={17} name={'checkmark-circle-outline'} style={{ marginHorizontal: 10 }} />
						<Text
							style={{
								color: Colors.white,
								fontSize: RFValue(12),
								fontFamily: Fonts.FiraSansRegular,
							}}
						>
							Copied Successfully
              </Text>
					</View>
					:
					<View style={styles.bottomView}>
						<View style={styles.bottomInnerView}>
							<Ionicons color={Colors.blue} size={17} name={'md-time-outline'} />
							{props.renderTimer ?
								<CountDown
									size={13}
									until={TC_REQUEST_EXPIRY}
									digitStyle={{
										backgroundColor: '#FFF',
										borderWidth: 0,
										borderColor: '#FFF',
										margin: -5,
									}}
									digitTxtStyle={{
										color: Colors.blue, fontSize: RFValue(13),
										fontFamily: Fonts.FiraSansRegular,
									}}
									separatorStyle={{ color: Colors.blue, }}
									timeToShow={['H', 'M']}
									timeLabels={{ h: null, m: null, s: null }}
									showSeparator
								/> : null}
							{/* <Text style={styles.timerText}>09 : 12</Text> */}
						</View>
					</View>
				}
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	modalContainer: {
		height: '100%',
		backgroundColor: Colors.white,
		alignSelf: 'center',
		width: '100%',
	},
	modalHeaderTitleView: {
		alignItems: 'center',
		flexDirection: 'row',
		paddingRight: 10,
		paddingBottom: hp('3%'),
		marginLeft: 20,
		marginRight: 20,
		marginBottom: 15,
	},
	modalHeaderTitleText: {
		color: Colors.blue,
		fontSize: RFValue(18),
		fontFamily: Fonts.FiraSansMedium,
	},
	modalHeaderInfoText: {
		color: Colors.textColorGrey,
		fontSize: RFValue(11),
		fontFamily: Fonts.FiraSansRegular,
		marginTop: hp('0.7%'),
		marginRight: 20,
		flexWrap: 'wrap',
	},
	qrModalImage: {
		width: wp('100%'),
		height: wp('100%'),
		borderRadius: 20,
	},
	otpText: {
		color: Colors.black,
		fontFamily: Fonts.FiraSansRegular,
		fontSize: RFValue(23),
	},
	otpTextView: {
		height: wp('12%'),
		width: wp('12%'),
		backgroundColor: Colors.backgroundColor,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	otpView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: hp('5%'),
	},
	separator: {
		height: 1,
		backgroundColor: Colors.borderColor,
		marginTop: hp('5%'),
		marginBottom: hp('3%'),
	},
	bottomView: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	bottomInnerView: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	timerText: {
		color: Colors.blue,
		fontSize: RFValue(19),
		fontFamily: Fonts.FiraSansRegular,
		marginLeft: 10,
	},
});
