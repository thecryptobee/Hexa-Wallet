/** @format */
import React from "react";
import { createAppContainer } from "react-navigation";
import { AsyncStorage, AppState, AppRegistry, Linking, StatusBar } from "react-native";
import DeepLinking from "react-native-deep-linking";
import "HexaWallet/shim";
import { name as appName } from "HexaWallet/app.json";
import { createRootNavigator } from "HexaWallet/src/app/router/router";
import LaunchScreen from "HexaWallet/src/screens/LaunchScreen/LaunchScreen";

//TODO: Custome Object
var utils = require( "HexaWallet/src/app/constants/Utils" );
export default class HexaWallet extends React.Component
{
  constructor ( props )    
  {
    super( props );
    this.state = {
      status: true,
      isStartPage: "OnBoardingNavigator",
      appState: AppState.currentState
    };
    StatusBar.setBarStyle( 'light-content', true );
  }
  async componentDidMount ()
  {
    try
    {
      //AppState.addEventListener( "change", this._handleAppStateChange );
      AsyncStorage.setItem( "flag_BackgoundApp", JSON.stringify( true ) );
      //TODO: Deep Linking
      DeepLinking.addScheme( "https://" );
      Linking.addEventListener( "url", this.handleUrl );
      DeepLinking.addRoute(
        "/prime-sign-230407.appspot.com/sss/:pageName/:script",
        response =>
        {
          console.log( {
            response
          } );
          var pageName;
          if ( response.pageName == "bk" )
          {
            pageName = "TabbarBottom";
          }
          else if ( response.pageName == "rt" )
          {
            pageName = "TrustedPartyShareSecretNavigator";
          }
          utils.setRootViewController( pageName );
          var script = response.script;
          script = script.split( "_+_" ).join( "/" );
          console.log( { script } );
          var decpScript = utils.decrypt( script, "122334" )
          decpScript = JSON.parse( decpScript );
          console.log( { decpScript } );
          utils.setDeepLinkingUrl( decpScript );
          utils.setDeepLinkingType( "SSS Recovery Sms/Email" );
        }
      );

      Linking.getInitialURL()
        .then( url =>
        {
          if ( url )
          {
            let uri_dec = decodeURIComponent( url );
            Linking.openURL( url );
            DeepLinking.evaluateUrl( uri_dec );
          }
        } )
        .catch( err => console.error( "An error occurred", err ) );
    } catch ( error )
    {
      console.log( {
        error
      } );
    }
  }

  handleUrl = ( { url } ) =>
  {
    try
    {
      let uri_dec = decodeURIComponent( url );
      Linking.canOpenURL( url ).then( supported =>
      {
        if ( supported )
        {
          DeepLinking.evaluateUrl( uri_dec );
        }
      } );
    } catch ( e )
    {
      console.log( {
        e
      } );
    }
  };

  componentWillUnmount ()
  {
    try
    {
      Linking.removeEventListener( "url", this.handleUrl );
      // AppState.removeEventListener( "change", this._handleAppStateChange );
    } catch ( e )
    {
      console.log( {
        e
      } );
    }
  }

  // _handleAppStateChange = async nextAppState =>
  // {
  //   try
  //   {
  //     var status = JSON.parse(
  //       await AsyncStorage.getItem( "PasscodeCreateStatus" )
  //     );
  //     let flag_BackgoundApp = JSON.parse(
  //       await AsyncStorage.getItem( "flag_BackgoundApp" )
  //     );
  //     if ( status && flag_BackgoundApp )
  //     {
  //       this.setState( {
  //         appState: AppState.currentState
  //       } );
  //       if ( this.state.appState.match( /inactive|background/ ) )
  //       {
  //         console.log( {
  //           status
  //         } );
  //         this.setState( {
  //           status: true
  //         } );
  //         console.log(
  //           "forgound = " + this.state.status,
  //           this.state.isStartPage
  //         );
  //       }
  //     }
  //   } catch ( e )
  //   {
  //     console.log( {
  //       e
  //     } );
  //   }
  // };

  onComplited ( status, pageName )
  {
    try
    {
      this.setState( {
        status: status,
        isStartPage: pageName
      } );
    } catch ( e )
    {
      console.log( {
        e
      } );
    }
  }

  render ()
  {
    const Layout = createRootNavigator(
      this.state.status,
      this.state.isStartPage
    );
    console.log( "first = " + this.state.status, this.state.isStartPage );
    const AppContainer = createAppContainer( Layout );
    return this.state.status ? (
      <LaunchScreen
        onComplited={ ( status: boolean, pageName: string ) =>
          this.onComplited( status, pageName )
        }
      />
    ) : (
        <AppContainer />
      );
  }
}

console.disableYellowBox = true;
AppRegistry.registerComponent( appName, () => HexaWallet );

