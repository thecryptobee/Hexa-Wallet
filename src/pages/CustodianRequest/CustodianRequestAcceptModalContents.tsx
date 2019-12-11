import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform
} from "react-native";
import Colors from "../../common/Colors";
import Fonts from "../../common/Fonts";
import { RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

export default function CustodianRequestAcceptModalContents(props) {
  let TouchableElement;
  TouchableElement =
    Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <View style={{ ...styles.modalContentContainer, height: "100%" }}>
      <View style={{ height: "100%" }}>
        <View
          style={{
            ...styles.successModalHeaderView,
            marginRight: wp("8%"),
            marginLeft: wp("8%")
          }}
        >
          <Text style={styles.modalTitleText}>
            Secret Accepted{"\n"}Successfully
          </Text>
          <Text style={{ ...styles.modalInfoText, marginTop: wp("1.5%") }}>
            Secret Successfully Accepted{"\n"}You are now a guardian for
          </Text>
        </View>
        <View style={styles.box}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={styles.successModalAmountImage}
              source={require("./../assets/images/icons/icon_wallet.png")}
            />
            <Text style={styles.successModalWalletNameText}>
              {props.userName}
            </Text>
          </View>
        </View>
        <View>
          <View
            style={{
              marginLeft: wp("8%"),
              marginRight: wp("8%")
            }}
          >
            <Text style={{ ...styles.modalInfoText }}>
              Associate the secret with a contact to better manage the{"\n"}
              secrets you are guardian for
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: "auto",
            alignItems: "center"
          }}
        >
          <TouchableElement
            onPress={() => props.onPressAssociateContacts()}
            style={{ ...styles.successModalButtonView }}
          >
            <Text style={styles.proceedButtonText}>Associate Contact</Text>
          </TouchableElement>
          <TouchableElement
            onPress={() => props.onPressSkip()}
            style={{
              height: wp("13%"),
              width: wp("35%"),
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ ...styles.proceedButtonText, color: Colors.blue }}>
              Skip
            </Text>
          </TouchableElement>
          <Image
            source={require("../assets/images/icons/accept.png")}
            style={styles.successModalImage}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContentContainer: {
    height: "50%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderLeftColor: Colors.borderColor,
    borderLeftWidth: 1,
    borderTopRightRadius: 10,
    borderRightColor: Colors.borderColor,
    borderRightWidth: 1,
    borderTopColor: Colors.borderColor,
    borderTopWidth: 1
  },
  box: {
    backgroundColor: Colors.backgroundColor1,
    marginRight: wp("5%"),
    marginLeft: wp("5%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("2%"),
    marginBottom: hp("3%"),
    borderRadius: 10,
    justifyContent: "center"
  },
  successModalHeaderView: {
    marginTop: hp("5%"),
    marginBottom: hp("3%")
  },
  modalTitleText: {
    color: Colors.blue,
    fontSize: RFValue(18, 812),
    fontFamily: Fonts.FiraSansMedium
  },
  modalInfoText: {
    color: Colors.textColorGrey,
    fontSize: RFValue(11, 812),
    fontFamily: Fonts.FiraSansRegular
  },
  successModalAmountView: {
    marginRight: wp("10%"),
    marginLeft: wp("10%")
  },
  successModalWalletNameText: {
    color: Colors.black,
    fontSize: RFValue(25, 812),
    fontFamily: Fonts.FiraSansRegular,
    textAlign: "center"
  },
  successModalAmountImage: {
    width: wp("15%"),
    height: wp("15%"),
    marginRight: 15,
    marginLeft: 15,
    resizeMode: "contain"
  },
  successModalAmountText: {
    color: Colors.black,
    fontFamily: Fonts.FiraSansRegular,
    fontSize: RFValue(21, 812),
    marginLeft: 5
  },
  successModalAmountUnitText: {
    color: Colors.borderColor,
    fontFamily: Fonts.FiraSansRegular,
    fontSize: RFValue(11, 812)
  },
  successModalAmountInfoView: {
    flex: 0.4,
    marginRight: wp("10%"),
    marginLeft: wp("10%")
  },
  successModalButtonView: {
    height: wp("13%"),
    width: wp("35%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 10,
    shadowColor: Colors.shadowBlue,
    shadowOpacity: 10,
    shadowOffset: { width: 0, height: 10 },
    backgroundColor: Colors.blue,
    alignSelf: "center",
    marginLeft: wp("8%")
  },
  proceedButtonText: {
    color: Colors.white,
    fontSize: RFValue(13, 812),
    fontFamily: Fonts.FiraSansMedium
  },
  successModalImage: {
    width: wp("25%"),
    height: hp("20%"),
    marginLeft: "auto",
    resizeMode: "cover"
  }
});
