import React, { Component } from 'react';
import { Modal, TouchableHighlight, View, Alert, StyleSheet, Image } from 'react-native';
import { Button, Icon, Text, Textarea, Form } from "native-base";
import FullLinearGradientButton from "HexaWallet/src/app/custcompontes/LinearGradient/Buttons/FullLinearGradientButton";
import { SvgIcon } from "@up-shared/components";

//TODO: Custome StyleSheet Files       
import globalStyle from "HexaWallet/src/app/manager/Global/StyleSheet/Style";

//TODO: Custome Object
import {
    images
} from "HexaWallet/src/app/constants/Constants";
var utils = require( "HexaWallet/src/app/constants/Utils" );

interface Props {
    data: [];
    closeModal: Function;
    click_GoToWallet: Function;
}

export default class ModelQuestionsSuccessfullyBackedUp extends Component<Props, any> {

    constructor ( props: any ) {
        super( props );
        this.state = ( {
            walletName: null,
            flag_DisableBtnNext: true
        } )
    }

    //TODO: Wallet Name
    ckeckWalletName( val: string ) {
        if ( val.length >= 6 ) {
            this.setState( {
                flag_DisableBtnNext: false
            } )
        } else {
            this.setState( {
                flag_DisableBtnNext: true
            } )
        }
    }

    render() {
        let data = this.props.data.length != 0 ? this.props.data : [];
        return (
            <Modal
                transparent
                animationType="fade"
                visible={ data.length != 0 ? data[ 0 ].modalVisible : false }
                onRequestClose={ () =>
                    this.props.closeModal()
                }
            >
                <View style={ [
                    styles.modalBackground,
                    { backgroundColor: `rgba(0,0,0,0.4)` }
                ] }>
                    <View style={ styles.viewModelBody }>
                        <View style={ { flexDirection: "row", flex: 0.6 } }>
                            <Text style={ [ globalStyle.ffFiraSansMedium, {
                                fontSize: 20, color: "#2F2F2F", flex: 6, textAlign: "center", marginTop: 10,
                                marginLeft: 20, marginRight: 20
                            } ] }>Question Successfully Backed Up</Text>
                        </View>
                        <View style={ { flex: 2, alignItems: "center", justifyContent: "center" } }>
                            <Image style={ styles.imgAppLogo } source={ images.RestoreWalletUsingMnemonic.walletrestored } />
                        </View>
                        <View style={ { flex: 1, alignItems: "center", justifyContent: "flex-end" } }>
                            <Text note style={ [ styles.txtNotes, { textAlign: "center" } ] }>Hexa will remind you to help remember the answer</Text>
                        </View>
                        <View style={ { flex: 1, justifyContent: "flex-end" } }>
                            <FullLinearGradientButton
                                click_Done={ () => this.props.click_GoToWallet() }
                                title="Go to Wallet"
                                disabled={ false }
                                style={ [ { opacity: 1 }, { borderRadius: 10 } ] }
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create( {
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
    },
    imgAppLogo: {
        width: 150,
        height: 170
    },
    viewModelBody: {
        flex: 0.7,
        margin: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#ffffff"
    }
} );