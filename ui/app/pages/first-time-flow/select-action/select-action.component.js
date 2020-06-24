import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../components/ui/button'
// import DirectWebSDK from '@toruslabs/torus-direct-web-sdk'
import MetaFoxLogo from '../../../components/ui/metafox-logo'
import {
  INITIALIZE_METAMETRICS_OPT_IN_ROUTE,
  INITIALIZE_IMPORT_WITH_TORUS_ROUTE
  // DEFAULT_ROUTE,
} from '../../../helpers/constants/routes'

export default class SelectAction extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    isInitialized: PropTypes.bool,
    setFirstTimeFlowType: PropTypes.func,
    nextRoute: PropTypes.string,
    importNewAccount: PropTypes.func,
    setSelectedAddress: PropTypes.func,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  componentDidMount () {
    const { history, isInitialized, nextRoute } = this.props

    if (isInitialized) {
      history.push(nextRoute)
    }
  }

  handleCreate = () => {
    this.props.setFirstTimeFlowType('create')
    this.props.history.push(INITIALIZE_METAMETRICS_OPT_IN_ROUTE)
  }

  handleImport = () => {
    this.props.setFirstTimeFlowType('import')
    this.props.history.push(INITIALIZE_METAMETRICS_OPT_IN_ROUTE)
  }

  handleTorusLogin = async () => {

    // const TorusOptions = {
    //   GOOGLE_CLIENT_ID: '238941746713-qqe4a7rduuk256d8oi5l0q34qtu9gpfg.apps.googleusercontent.com',
    //   baseUrl: 'http://localhost:3000/serviceworker',
    //   // baseUrl: 'https://toruscallback.ont.io/serviceworker',
    // }

    // const torus = new DirectWebSDK({
    //   baseUrl: TorusOptions.baseUrl,
    //   redirectToOpener: true,
    //   network: 'ropsten',
    //   proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183', // details for test net
    // })
    // await torus.init({ skipSw: true })


    // try {
    //   const obj = await torus.triggerAggregateLogin({ aggregateVerifierType: 'single_id_verifier', subVerifierDetailsArray: [{
    //     clientId: TorusOptions.GOOGLE_CLIENT_ID,
    //     typeOfLogin: 'google',
    //     verifier: 'google-shubs',
    //   }], verifierIdentifier: 'multigoogle-torus' })
    //   console.log(obj)

    //   this.props.importNewAccount('Private Key', [ obj.privateKey ])
    //     .then(({ selectedAddress }) => {
    //       console.log(selectedAddress)
    //       if (selectedAddress) {
    //         this.context.metricsEvent({
    //           eventOpts: {
    //             category: 'Accounts',
    //             action: 'Import Account',
    //             name: 'Imported Account with Private Key',
    //           },
    //         })
    //         // this.props.history.push(mostRecentOverviewPage)
    //         this.props.history.push(DEFAULT_ROUTE)

    //         // displayWarning(null)
    //       } else {
    //         // displayWarning('Error importing account.')
    //         this.context.metricsEvent({
    //           eventOpts: {
    //             category: 'Accounts',
    //             action: 'Import Account',
    //             name: 'Error importing with Private Key',
    //           },
    //         })
    //         this.props.setSelectedAddress(obj.publicAddress)
    //       }
    //     }).catch((err) => console.log(err))

    // } catch (e) {
    //   // tslint:disable-next-line:no-console
    //   console.warn('could not retrieve key from DirectAuth: ', e)
    // }

    this.props.setFirstTimeFlowType('import')
    this.props.history.push(INITIALIZE_IMPORT_WITH_TORUS_ROUTE)
  }


  render () {
    const { t } = this.context

    return (
      <div className="select-action">
        <MetaFoxLogo />

        <div className="select-action__wrapper">


          <div className="select-action__body">
            <div className="select-action__body-header">
              { t('newToMetaMask') }
            </div>
            <div className="select-action__select-buttons">
              <div className="select-action__select-button">
                <div className="select-action__button-content">
                  <div className="select-action__button-symbol">
                    <img src="/images/download-alt.svg" />
                  </div>
                  <div className="select-action__button-text-big">
                    { t('noAlreadyHaveSeed') }
                  </div>
                  <div className="select-action__button-text-small">
                    { t('importYourExisting') }
                  </div>
                </div>
                <Button
                  type="primary"
                  className="first-time-flow__button"
                  onClick={this.handleImport}
                >
                  { t('importWallet') }
                </Button>
              </div>
              <div className="select-action__select-button">
                <div className="select-action__button-content">
                  <div className="select-action__button-symbol">
                    <img src="/images/thin-plus.svg" />
                  </div>
                  <div className="select-action__button-text-big">
                    { t('letsGoSetUp') }
                  </div>
                  <div className="select-action__button-text-small">
                    { t('thisWillCreate') }
                  </div>
                </div>
                <Button
                  type="primary"
                  className="first-time-flow__button"
                  onClick={this.handleCreate}
                >
                  { t('createAWallet') }
                </Button>
              </div>

              <div className="select-action__select-button">
                <div className="select-action__button-content">
                  <div className="select-action__button-symbol">
                    <img src="/images/thin-plus.svg" />
                  </div>
                  <div className="select-action__button-text-big">
                    Torus login
                  </div>
                  <div className="select-action__button-text-small">
                    { t('thisWillCreate') }
                  </div>
                </div>
                <Button
                  type="primary"
                  className="first-time-flow__button"
                  onClick={this.handleTorusLogin}
                >
                  { t('createAWallet') }
                </Button>
              </div>

            </div>
          </div>

        </div>
      </div>
    )
  }
}