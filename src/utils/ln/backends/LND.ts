import RNFetchBlob from 'rn-fetch-blob'
import stores from '../../../mobxstore'
import OpenChannelRequest from '../../../models/OpenChannelRequest'
import VersionUtils from '../VersionUtils'
//import { doTorRequest, RequestMethod } from '../TorUtils'

interface Headers {
    macaroon?: string;
    encodingtype?: string;
    'Grpc-Metadata-Macaroon'?: string;
    'Grpc-Metadata-macaroon'?: string;
}

// keep track of all active calls so we can cancel when appropriate
const calls: any = {
}
export default class LND {
    torSocksPort?: number = undefined;
    restReq = async (
      headers: Headers | any,
      url: string,
      method: any,
      data?: any,
      certVerification?: boolean,
      useTor?: boolean
    ) => {
      // use body data as an identifier too, we don't want to cancel when we
      // are making multiples calls to get all the node names, for example
      const id = data ? `${url}${JSON.stringify( data )}` : url
      if ( calls[ id ] ) {
        return calls[ id ]
      }
      // API is a bit of a mess but
      // If tor enabled in setting, start up the daemon here
      if ( useTor === true ) {
        // calls[ id ] = doTorRequest(
        //   url,
        //         method as RequestMethod,
        //         JSON.stringify( data ),
        //         headers
        // ).then( ( response: any ) => {
        //   delete calls[ id ]
        //   return response
        // } )
      } else {
        calls[ id ] = RNFetchBlob.config( {
          trusty: !certVerification
        } )
          .fetch( method, url, headers, data ? JSON.stringify( data ) : data )
          .then( ( response: any ) => {
            delete calls[ id ]
            if ( response.info().status < 300 ) {
              return response.json()
            } else {
              const errorInfo = response.json()
              console.log( 'errorInfo', errorInfo )
              throw new Error(
                ( errorInfo.error && errorInfo.error.message ) ||
                                errorInfo.message ||
                                errorInfo.error
              )
            }
          } )
      }

      return await calls[ id ]
    };

    supports = (
      minVersion: string,
      eosVersion?: string,
      minApiVersion?: string
    ) => {
      const { nodeInfo } = stores.nodeInfoStore
      const { version, api_version } = nodeInfo
      const { isSupportedVersion } = VersionUtils
      if ( minApiVersion ) {
        return (
          isSupportedVersion( version, minVersion, eosVersion ) &&
                isSupportedVersion( api_version, minApiVersion )
        )
      }
      return isSupportedVersion( version, minVersion, eosVersion )
    };

    wsReq = ( route: string, method: string, data?: any ) => {
      const {
        host,
        lndhubUrl,
        port,
        macaroonHex,
        accessToken
      } = stores.settingsStore

      const auth = macaroonHex || accessToken
      const headers: any = this.getHeaders( auth, true )
      const methodRoute = `${route}?method=${method}`
      const url = this.getURL( host || lndhubUrl, port, methodRoute, true )

      return new Promise( function( resolve, reject ) {
        const ws: any = new WebSocket( url, null, {
          headers
        } )

        // keep pulling in responses until the socket closes
        let resp: any

        ws.addEventListener( 'open', () => {
          // connection opened
          ws.send( JSON.stringify( data ) ) // send a message
        } )

        ws.addEventListener( 'message', ( e: any ) => {
          // a message was received
          const data = JSON.parse( e.data )
          if ( data.error ) {
            reject( data.error )
          } else {
            resp = e.data
          }
        } )

        ws.addEventListener( 'error', ( e: any ) => {
          const certWarning = 'You may have to enable Certificate Verification to make these kind of calls'
          // an error occurred
          reject(
            e.message ? `${certWarning} (${e.message})` : certWarning
          )
        } )

        ws.addEventListener( 'close', () => {
          // connection closed
          resolve( JSON.parse( resp ) )
        } )
      } )
    };

    getHeaders = ( macaroonHex: string, ws?: boolean ): any => {
      if ( ws ) {
        return {
          'Grpc-Metadata-Macaroon': macaroonHex
        }
      }
      return {
        'Grpc-Metadata-macaroon': macaroonHex
      }
    };

    getURL = (
      host: string,
      port: string | number,
      route: string,
      ws?: boolean
    ) => {
      const hostPath = host.includes( '://' ) ? host : `https://${host}`
      let baseUrl = `${hostPath}${port ? ':' + port : ''}`

      if ( ws ) {
        baseUrl = baseUrl.replace( 'https', 'wss' ).replace( 'http', 'ws' )
      }

      if ( baseUrl[ baseUrl.length - 1 ] === '/' ) {
        baseUrl = baseUrl.slice( 0, -1 )
      }

      return `${baseUrl}${route}`
    };

    request = ( node: any, link: string ) => {
      const {
        host,
        lndhubUrl,
        port,
        macaroonHex,
        accessToken,
        certVerification,
        enableTor
      } = node
      const auth = macaroonHex || accessToken
      const headers: any = this.getHeaders( auth )
      headers[ 'Content-Type' ] = 'application/json'
      const url = this.getURL( host || lndhubUrl, port, link )
      return this.restReq(
        headers,
        url,
        'delete',
        null,
        certVerification,
        enableTor
      )
    };


    getRequestNode = ( node: any, link: string ) => {
      const {
        host,
        lndhubUrl,
        port,
        macaroonHex,
        accessToken,
        certVerification,
        enableTor
      } = node
      const auth = macaroonHex || accessToken
      const headers: any = this.getHeaders( auth )
      headers[ 'Content-Type' ] = 'application/json'
      const url = this.getURL( host || lndhubUrl, port, link )
      return this.restReq(
        headers,
        url,
        'get',
        null,
        certVerification,
        enableTor
      )
    };


    postRequestNode = ( node: any, link: string, data: any ) => {
      const {
        host,
        lndhubUrl,
        port,
        macaroonHex,
        accessToken,
        certVerification,
        enableTor
      } = node
      const auth = macaroonHex || accessToken
      const headers: any = this.getHeaders( auth )
      headers[ 'Content-Type' ] = 'application/json'
      const url = this.getURL( host || lndhubUrl, port, link )
      return this.restReq(
        headers,
        url,
        'post',
        data,
        certVerification,
        enableTor
      )
    };

    getLndConfig = ( url: string ) => {
      console.log( 'getLndConfig', url )
      const headers: any = {
        'Content-Type' :'application/json'
      }
      return this.restReq(
        headers,
        url,
        'get',
        null,
        false,
        false
      )
    }

    getInfo = ( node: any ) => {
      const {
        host,
        lndhubUrl,
        port,
        macaroonHex,
        accessToken,
        certVerification,
        enableTor
      } = node
      const auth = macaroonHex || accessToken
      const headers: any = this.getHeaders( auth )
      headers[ 'Content-Type' ] = 'application/json'
      const url = this.getURL( host || lndhubUrl, port, '/v1/getinfo' )
      return this.restReq(
        headers,
        url,
        'get',
        null,
        certVerification,
        enableTor
      )
    };

    getRequest = ( route: string ) => this.request( route, 'get' );
    postRequest = ( route: string, data?: any ) =>
      this.request( route, 'post' );
    deleteRequest = ( node:any, route: string ) => this.request( node, route );
    // getChannels = () => this.getRequest( '/v1/channels' );
    getChannels = ( node: any ) => this.getRequestNode( node, '/v1/channels' );
    getChannelInfo = ( chanId: string ) =>
      this.getRequest( `/v1/graph/edge/${chanId}` );
    getBlockchainBalance = ( node: any ) =>
      this.getRequestNode( node, '/v1/balance/blockchain' )
    getLightningBalance = ( node: any ) => this.getRequestNode( node, '/v1/balance/channels' );
    sendCoins = ( data: any ) =>
      this.postRequest( '/v1/transactions', {
        addr: data.addr,
        sat_per_byte: data.sat_per_byte,
        amount: data.amount
      } );
    getMyNodeInfo = () => this.getRequest( '/v1/getinfo' );
    getInvoices = () =>
      this.getRequest( '/v1/invoices?reversed=true&num_max_invoices=100' );
    createInvoice = ( node:any, data: any ) => this.postRequestNode( node, '/v1/invoices', data );
    getPayments = () => this.getRequest( '/v1/payments' );
    getNewAddress = ( node: any ) => this.getRequestNode( node, '/v1/newaddress' );
    openChannel = ( node:any, data: OpenChannelRequest ) =>
      this.postRequestNode( node, '/v1/channels', data );
    openChannelStream = ( data: OpenChannelRequest ) =>
      this.wsReq( '/v1/channels/stream', 'POST', data );
    connectPeer = ( node:any, data: any ) => this.postRequestNode( node, '/v1/peers', data );
    listNode = () => this.getRequest( '/v1/network/listNode' );
    decodePaymentRequest = ( urlParams?: Array<string> ) =>
      this.getRequest( `/v1/payreq/${urlParams && urlParams[ 0 ]}` );
    payLightningInvoice = ( data: any ) =>
      this.postRequest( '/v1/channels/transactions', data );
    payLightningInvoiceV2 = ( data: any ) =>
      this.postRequest( '/v2/router/send', data );
    payLightningInvoiceV2Streaming = ( data: any ) =>
      this.wsReq( '/v2/router/send', 'POST', data );
    closeChannel = ( node:any, urlParams?: Array<string> ) => {
      // if ( urlParams && urlParams.length === 4 ) {
      //   return this.deleteRequest(node,
      //     `/v1/channels/${urlParams && urlParams[ 0 ]}/${urlParams &&
      //               urlParams[ 1 ]}?force=${urlParams &&
      //               urlParams[ 2 ]}&sat_per_byte=${urlParams && urlParams[ 3 ]}`
      //   )
      // }
      return this.request( node,
        `/v1/channels/${urlParams && urlParams[ 0 ]}/${urlParams &&
                urlParams[ 1 ]}?force=${urlParams && urlParams[ 2 ]}`
      )
    };
    getNodeInfo = ( urlParams?: Array<string> ) =>
      this.getRequest( `/v1/graph/node/${urlParams && urlParams[ 0 ]}` );
    getFees = () => this.getRequest( '/v1/fees' );
    setFees = ( data: any ) => {
      const request = {
        ...data
      }
      request.fee_rate = `${Number( data.fee_rate ) / 100}`
      return this.postRequest( '/v1/chanpolicy', data )
    };
    getRoutes = ( urlParams?: Array<string> ) =>
      this.getRequest(
        `/v1/graph/routes/${urlParams && urlParams[ 0 ]}/${urlParams &&
                urlParams[ 1 ]}`
      );
    getForwardingHistory = ( hours = 24 ) => {
      const req = {
        num_max_events: 10000000,
        start_time: Math.round(
          new Date( Date.now() - hours * 60 * 60 * 1000 ).getTime() / 1000
        ).toString(),
        end_time: Math.round( new Date().getTime() / 1000 ).toString()
      }
      return this.postRequest( '/v1/switch', req )
    };
    // Coin Control
    fundPsbt = ( data: any ) => this.postRequest( '/v2/wallet/psbt/fund', data );
    finalizePsbt = ( data: any ) =>
      this.postRequest( '/v2/wallet/psbt/finalize', data );
    publishTransaction = ( data: any ) => this.postRequest( '/v2/wallet/tx', data );
    getUTXOs = () => this.getRequest( '/v1/utxos?min_confs=0&max_confs=200000' );
    bumpFee = ( data: any ) => this.postRequest( '/v2/wallet/bumpfee', data );
    listAccounts = () => this.getRequest( '/v2/wallet/accounts' );
    importAccount = ( data: any ) =>
      this.postRequest( '/v2/wallet/accounts/import', data );
    signMessage = ( message: string ) =>
      this.postRequest( '/v1/signmessage', {
        msg: message
      } );

    // LndHub
    createAccount = (
      host: string,
      certVerification: boolean,
      useTor?: boolean
    ) => {
      const url = `${host}/create`
      return this.restReq(
        {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        url,
        'POST',
        {
          partnerid: 'bluewallet',
          accounttype: 'common'
        },
        certVerification,
        useTor
      )
    };

    supportsMessageSigning = () => true;
    supportsOnchainSends = () => true;
    supportsKeysend = () => true;
    supportsChannelManagement = () => true;
    supportsMPP = () => this.supports( 'v0.11.0', 'v0.13.0' );
    supportsAMP = () => this.supports( 'v0.13.0' );
    supportsHopPicking = () => this.supports( 'v0.11.0' );
    supportsRouting = () => true;
    supportsNodeInfo = () => true;
    supportsCoinControl = () => this.supports( 'v0.12.0' );
    supportsAccounts = () => this.supports( 'v0.13.0' );
    checkNodeInfo = ( data: any ) => this.getInfo( data );
    getTransactions = ( data: any ) => this.getRequestNode( data, '/v1/transactions' );
    processLndQR = ( url: any ) => this.getLndConfig( url );
}