import React from "react";
import { StyleSheet, ImageBackground, View, Platform, Dimensions, SafeAreaView } from "react-native";
import {
    Container,
    Header,
    Title,
    Content,
    Item,
    Input,
    Button,
    Left,
    Right,
    Body,
    Text,
    Picker,
    Icon
} from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
//TODO: Custome Pages
import FullLinearGradientButton from "HexaWallet/src/app/custcompontes/LinearGradient/Buttons/FullLinearGradientButton";
//TODO: Custome Object
import { colors, images, localDB } from "HexaWallet/src/app/constants/Constants";
var utils = require( "HexaWallet/src/app/constants/Utils" );
export default class FirstSecretQuestionScreen extends React.Component<any, any> {
    constructor ( props: any ) {
        super( props );
        this.state = {
            arr_QuestionList: [ {
                "item": "Name of your first pet?"
            }, {
                "item": "Name of your favourite teacher?"
            }, {
                "item": "Name of your favourite food?"
            }, {
                "item": "Name of your first company?"
            }, {
                "item": "Name of your first employee?"
            }
            ],
            firstQuestion: "Name of your first pet?",
            firstAnswer: "",
            secoundAnswer: "",
            flag_ConfirmDisableBtn: true
        };
    }

    //TODO: Select Picker Question List change aciton
    onValueChange( value: string ) {
        this.setState( {
            firstQuestion: value
        } );
    }

    //TODO: func check_CorrectAnswer
    check_CorrectAnswer() {
        setTimeout( () => {
            let firstAns = this.state.firstAnswer;
            let secoundAns = this.state.secoundAnswer;
            if ( firstAns == secoundAns && firstAns.length >= 6 ) {
                this.setState( {
                    flag_ConfirmDisableBtn: false
                } )
            } else {
                this.setState( {
                    flag_ConfirmDisableBtn: true
                } )
            }
        }, 100 );

    }


    //TODO: func click_FirstQuestion
    async click_FirstQuestion() {
        let question = this.state.firstQuestion;
        let arr_QuestionList = this.state.arr_QuestionList;
        for ( var i = 0; i < arr_QuestionList.length; i++ )
            if ( arr_QuestionList[ i ].item === question ) {
                arr_QuestionList.splice( i, 1 );
                break;
            }
        let resWalletData = await utils.getSetupWallet();
        let walletData = {};
        walletData.walletName = resWalletData.walletName;
        walletData.question = question;
        walletData.answer = this.state.secoundAnswer;
        walletData.arr_QuestionList = arr_QuestionList;
        await utils.setSetupWallet( walletData );
        window.EventBus.trigger( "swipeScreen", "optional event info" );
    }
    render() {
        const itemList = this.state.arr_QuestionList.map( ( item: any, index: number ) => (
            <Picker.Item label={ item.item } value={ item.item } />
        ) );
        return (
            <View style={ styles.container }>

                <KeyboardAwareScrollView
                    enableOnAndroid
                    extraScrollHeight={ 40 }
                    contentContainerStyle={ { flexGrow: 1, } }
                >
                    <View style={ styles.viewPagination }>
                        <Text style={ { fontWeight: "bold", fontFamily: "FiraSans-Medium", fontSize: 22, textAlign: "center" } }>Step 2: Select first secret question</Text>
                        <Text note style={ { marginTop: 20, textAlign: "center" } }>To Set up you need to select two secret questions</Text>
                    </View>
                    <View style={ styles.viewInputFiled }>

                        <View style={ styles.itemQuestionPicker }>
                            <Picker
                                renderHeader={ backAction =>
                                    <Header style={ { backgroundColor: "#ffffff" } }>
                                        <Left>
                                            <Button transparent onPress={ backAction }>
                                                <Icon name="arrow-back" style={ { color: "#000" } } />
                                            </Button>
                                        </Left>
                                        <Body style={ { flex: 3 } }>
                                            <Title style={ { color: "#000" } }>Select Question</Title>
                                        </Body>
                                        <Right />
                                    </Header> }
                                mode="dropdown"
                                iosIcon={ <Icon name="arrow-down" style={ { fontSize: 25, marginLeft: -10 } } /> }
                                selectedValue={ this.state.firstQuestion }
                                onValueChange={ this.onValueChange.bind( this ) }
                            >
                                { itemList }
                            </Picker>
                        </View>


                        <Item rounded style={ styles.itemInputWalletName }>
                            <Input
                                secureTextEntry
                                keyboardType="default"
                                autoCapitalize='sentences'
                                placeholder='Write your answer here'
                                placeholderTextColor="#B7B7B7"
                                onChangeText={ ( val ) => {
                                    this.setState( {
                                        firstAnswer: val
                                    } )
                                } }
                                onKeyPress={ () =>
                                    this.check_CorrectAnswer()
                                }

                            />
                        </Item>
                        <Item rounded style={ styles.itemInputWalletName }>
                            <Input
                                keyboardType="default"
                                autoCapitalize='none'
                                placeholder='Confirm answer'
                                placeholderTextColor="#B7B7B7"
                                onChangeText={ ( val ) => {
                                    this.setState( {
                                        secoundAnswer: val
                                    } )
                                } }
                                onKeyPress={ () =>
                                    this.check_CorrectAnswer()
                                }

                            />
                        </Item>
                    </View>
                    <View style={ styles.viewProcedBtn }>
                        <Text note style={ { textAlign: "center", marginLeft: 20, marginRight: 20, marginBottom: 20 } } numberOfLines={ 1 }>Make sure you don’t select questions, answers to </Text>
                        <FullLinearGradientButton title="Confirm & Select Second Question" disabled={ this.state.flag_ConfirmDisableBtn } style={ [ this.state.flag_ConfirmDisableBtn == true ? { opacity: 0.4 } : { opacity: 1 }, { borderRadius: 10 } ] } click_Done={ () => this.click_FirstQuestion() } />
                    </View>
                </KeyboardAwareScrollView>

            </View>

        );
    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    viewPagination: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 30,
        marginRight: 30
    },
    viewInputFiled: {
        flex: 3,
        alignItems: "center",
        margin: 10
    },
    itemInputWalletName: {
        width: Dimensions.get( 'screen' ).width / 1.07,
        borderWidth: 0,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        height: 50
    },
    itemQuestionPicker: {
        width: Dimensions.get( 'screen' ).width / 1.07,
        borderWidth: Platform.OS == "ios" ? 0 : 0.1,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        height: 50
    },
    viewProcedBtn: {
        flex: 2,
        justifyContent: "flex-end"
    }
} );
