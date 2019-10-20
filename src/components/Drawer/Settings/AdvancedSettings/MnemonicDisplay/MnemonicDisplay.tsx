import React from 'react';
import { StyleSheet, ImageBackground, SafeAreaView } from 'react-native';
import { Container } from 'native-base';

// TODO: Custome Pages
import { CustomStatusBar } from 'hexaCustStatusBar';
import { ModelLoader } from 'hexaLoader';

// TODO: Custome Model
import {
  ModelPasscode,
  ModelBackupSecretQuestionsFirstQuestion,
  ModelMnemonicDisplay,
} from 'hexaCustModel';

// TODO: Custome Object
import { colors, images } from 'hexaConstants';

const utils = require('hexaUtils');

export default class MnemonicDisplay extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      arrModelPasscode: [],
      arrModelBackupSecretQuestionsFirstQuestion: [],
      walletAnswerDetails: [],
      arrModelMnemonicDisplay: [],
      mnemonic: '',
    };
  }

  async UNSAFE_componentWillMount() {
    const walletDetails = await utils.getWalletDetails();
    this.setState({
      arrModelPasscode: [
        {
          modalVisible: true,
        },
      ],
      walletAnswerDetails: JSON.parse(walletDetails.setUpWalletAnswerDetails),
      mnemonic: walletDetails.mnemonic,
    });
  }

  render() {
    // array
    const {
      arrModelPasscode,
      walletAnswerDetails,
      arrModelBackupSecretQuestionsFirstQuestion,
      arrModelMnemonicDisplay,
    } = this.state;
    // values
    const { mnemonic } = this.state;
    return (
      <Container>
        <ImageBackground
          source={images.WalletSetupScreen.WalletScreen.backgoundImage}
          style={styles.container}
        >
          <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
          >
            <ModelPasscode
              data={arrModelPasscode}
              closeModal={() => this.props.navigation.pop()}
              click_Next={() => {
                this.setState({
                  arrModelPasscode: [
                    {
                      modalVisible: false,
                    },
                  ],
                  arrModelBackupSecretQuestionsFirstQuestion: [
                    {
                      modalVisible: true,
                      data: walletAnswerDetails,
                    },
                  ],
                });
              }}
            />
            <ModelBackupSecretQuestionsFirstQuestion
              data={arrModelBackupSecretQuestionsFirstQuestion}
              click_Next={() => {
                this.setState({
                  arrModelBackupSecretQuestionsFirstQuestion: [
                    {
                      modalVisible: false,
                      data: walletAnswerDetails,
                    },
                  ],
                  arrModelMnemonicDisplay: [
                    {
                      modalVisible: true,
                      data: mnemonic,
                    },
                  ],
                });
              }}
              pop={() => {
                this.setState({
                  arrModelBackupSecretQuestionsFirstQuestion: [
                    {
                      modalVisible: false,
                      data: walletAnswerDetails,
                    },
                  ],
                });
                this.props.navigation.pop();
              }}
            />
            <ModelMnemonicDisplay
              data={arrModelMnemonicDisplay}
              pop={() => {
                this.setState({
                  arrModelMnemonicDisplay: [
                    {
                      modalVisible: false,
                      data: mnemonic,
                    },
                  ],
                });
                this.props.navigation.pop();
              }}
            />
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
          hidden={true}
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
});
