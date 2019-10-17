import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Platform,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import {
  Container,
  Item,
  Input,
  Button,
  Text,
  Icon,
  Textarea,
  Left,
  Right,
  List,
  ListItem,
} from 'native-base';
import { SvgIcon } from '@up-shared/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RkCard } from 'react-native-ui-kitten';

// TODO: Custome Pages
import { CustomStatusBar } from 'hexaCustStatusBar';
import { HeaderTitle } from 'hexaCustHeader';
import { ModelLoader } from 'hexaLoader';

// TODO: Custome StyleSheet Files
import FontFamily from 'hexaStyles';

// TODO: Custome Object
import { colors, images } from 'hexaConstants';

// TODO: Common Funciton
const comFunDBRead = require('hexaCommonDBReadData');

export default class AdvancedSettings extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      walletDetails: [],
      arr_AccountDetails: [],
      arr_ListItem: [
        {
          title: 'Mnemonic',
        },
      ],
    };
  }

  async componentWillMount() {
    const walletDetails = await comFunDBRead.readTblWallet();
    const resAccountDetails = await comFunDBRead.readTblAccount();
    console.log({ walletDetails, resAccountDetails });
    this.setState({
      walletDetails,
      arr_AccountDetails: resAccountDetails[0],
    });
  }

  // TODO: list on click
  click_MenuItem(item: any) {
    const { title } = item;
    if (title == 'Mnemonic') {
      this.props.navigation.push('MnemonicDisplay');
    }
  }

  render() {
    return (
      <Container>
        <ImageBackground
          source={images.WalletSetupScreen.WalletScreen.backgoundImage}
          style={styles.container}
        >
          <HeaderTitle
            title="Advanced Settings"
            pop={() => this.props.navigation.pop()}
          />
          <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
          >
            <KeyboardAwareScrollView
              enableOnAndroid
              extraScrollHeight={40}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View
                style={{
                  flex: 0.2,
                  borderRadius: 10,
                  margin: 8,
                }}
              >
                <FlatList
                  data={this.state.arr_ListItem}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => this.click_MenuItem(item)}>
                      <RkCard
                        rkType="shadowed"
                        style={{
                          flex: 1,
                          borderRadius: 8,
                          marginLeft: 8,
                          marginRight: 8,
                          marginBottom: 4,
                        }}
                      >
                        <View
                          rkCardHeader
                          style={{
                            flex: 1,
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'column',
                            }}
                          >
                            <Text
                              style={[
                                FontFamily.ffFiraSansMedium,
                                { fontSize: 14 },
                              ]}
                            >
                              {item.title}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 0.2,
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                            }}
                          >
                            <SvgIcon
                              name="icon_forword"
                              color="#BABABA"
                              size={20}
                            />
                          </View>
                        </View>
                      </RkCard>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index}
                />
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </ImageBackground>
        <ModelLoader
          loading={this.state.flag_Loading}
          color={colors.appColor}
          size={30}
          message="Loading"
        />
        <CustomStatusBar
          backgroundColor={colors.white}
          hidden={false}
          barStyle="dark-content"
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  viewPagination: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  viewInputFiled: {
    flex: 3,
    alignItems: 'center',
    margin: 10,
  },
  itemInputWalletName: {
    borderWidth: 0,
    borderRadius: 10,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    backgroundColor: '#FFFFFF',
  },
  viewProcedBtn: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  btnNext: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  // Grid View Selected
  gridSelectedList: {
    flex: 1,
  },
  modal: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modal4: {
    height: 180,
  },
});
