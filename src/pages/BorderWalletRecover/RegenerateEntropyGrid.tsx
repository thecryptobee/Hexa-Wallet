
import React from 'react'
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import Colors from '../../common/Colors'
import SeedHeaderComponent from '../NewBHR/SeedHeaderComponent'
import ArrowRight from '../../assets/images/svgs/icon_arrow_right.svg'
import Fonts from '../../common/Fonts'
import { RFValue } from 'react-native-responsive-fontsize'

const RegenerateEntropyGrid = ( props ) => {

  return (
    <View style={{
      flex: 1, backgroundColor: Colors.backgroundColor
    }}>
      <SafeAreaView
        style={{
          flex: 0, backgroundColor: Colors.backgroundColor
        }}
      />
      <StatusBar backgroundColor={Colors.backgroundColor} barStyle="dark-content" />
      <SeedHeaderComponent
        onPressBack={() => {
          props.navigation.goBack()
        }}
        info1={'Step 1 of Recover a Border Wallet'}
        selectedTitle={'Regenerate Entropy Grid'}
        info={'Enter the 12 word Entropy Grid Regeneration Mnemonic'}
      />
      <TouchableOpacity style={styles.EntropyGridTabWrapper} onPress={()=> props.navigation.navigate( 'RecoverBorderWallet' )}>
        <View style={styles.titleTextWrapper}>
          <Text style={styles.titleText}>Enter Entropy Grid Regeneration Mnemonic</Text>
          <Text style={styles.subTitleText}>Enter the 12 word Entropy Grid Regeneration Mnemonic</Text>
        </View>
        <View style={styles.iconWrapper}>
          <ArrowRight/>
        </View>
      </TouchableOpacity>
      <View style={styles.EntropyGridTabWrapper}>
        <View style={styles.titleTextWrapper}>
          <Text style={styles.titleText}>or Upload Grid</Text>
          <Text style={styles.subTitleText}>Import an Entropy Grid file.</Text>
        </View>
        <View style={styles.iconWrapper}>
          <TouchableOpacity style={styles.uploadBtnWraper}>
            <Text style={styles.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create( {
  EntropyGridTabWrapper: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundColor1,
    width: '90%',
    margin: 20,
    paddingHorizontal: 5,
    paddingVertical: 20,
    alignContent: 'center'
  },
  titleTextWrapper: {
    width: '80%'
  },
  iconWrapper: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: RFValue( 16 ),
    color: Colors.blue
  },
  subTitleText: {
    fontSize: RFValue( 12 ),
    color: Colors.textColorGrey,
    fontFamily: Fonts.lightTextColor,
  },
  uploadBtnWraper: {
    flexDirection: 'row',
    backgroundColor: '#69A2B0',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadBtnText:{
    fontSize:  RFValue( 12 ),
    color: Colors.white
  }
} )
export default RegenerateEntropyGrid
