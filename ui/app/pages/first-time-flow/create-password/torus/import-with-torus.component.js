/* eslint-disable import/no-absolute-path */
// import { validateMnemonic } from 'bip39'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import DirectWebSDK from '@toruslabs/torus-direct-web-sdk'
import ThresholdBak from 'threshold-bak'
// import ThresholdBak from '/Users/shubham/Documents/github/torus/threshold-bak/dist/threshold-bak.cjs.js'
import TextField from '../../../../components/ui/text-field'
import Button from '../../../../components/ui/button'
import {
  // INITIALIZE_SELECT_ACTION_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
} from '../../../../helpers/constants/routes'

export default class ImportFromTorus extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object,
    createNewTorusVaultAndRestore: PropTypes.func,
  }

  state = {
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
    termsChecked: false,
  }


  UNSAFE_componentWillMount () {
    this._onBeforeUnload = () => this.context.metricsEvent({
      eventOpts: {
        category: 'Onboarding',
        action: 'Import Seed Phrase',
        name: 'Close window on import screen',
      },
      customVariables: {
        errorLabel: 'Seed Phrase Error',
        errorMessage: this.state.seedPhraseError,
      },
    })
    window.addEventListener('beforeunload', this._onBeforeUnload)
  }

  componentWillUnmount () {
    window.removeEventListener('beforeunload', this._onBeforeUnload)
  }

  handlePasswordChange (password) {
    const { t } = this.context

    this.setState((state) => {
      const { confirmPassword } = state
      let confirmPasswordError = ''
      let passwordError = ''

      if (password && password.length < 8) {
        passwordError = t('passwordNotLongEnough')
      }

      if (confirmPassword && password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch')
      }

      return {
        password,
        passwordError,
        confirmPasswordError,
      }
    })
  }

  handleConfirmPasswordChange (confirmPassword) {
    const { t } = this.context

    this.setState((state) => {
      const { password } = state
      let confirmPasswordError = ''

      if (password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch')
      }

      return {
        confirmPassword,
        confirmPasswordError,
      }
    })
  }

  handleImport = async (event) => {
    event.preventDefault()

    if (!this.isValid()) {
      return
    }

    const { password } = this.state
    const { history, createNewTorusVaultAndRestore } = this.props
    console.log(password)
    try {
      const TorusOptions = {
        GOOGLE_CLIENT_ID: '238941746713-qqe4a7rduuk256d8oi5l0q34qtu9gpfg.apps.googleusercontent.com',
        baseUrl: 'http://localhost:3000/serviceworker',
      // baseUrl: 'https://toruscallback.ont.io/serviceworker',
      }

      const tb = new ThresholdBak({
        directParams: {
          baseUrl: TorusOptions.baseUrl,
          redirectToOpener: true,
          network: 'ropsten',
          proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183', // details for test net,
        }
      })

      await tb.serviceProvider.directWeb.init({ skipSw: true })

      // Login via torus service provider to get back 1 share
      const postBox = await tb.serviceProvider.triggerAggregateLogin({ aggregateVerifierType: 'single_id_verifier', subVerifierDetailsArray: [{
        clientId: TorusOptions.GOOGLE_CLIENT_ID,
        typeOfLogin: 'google',
        verifier: 'google-shubs',
      }], verifierIdentifier: 'multigoogle-torus' })
      console.log(postBox)

      // get metadata from the metadata-store
      let keyDetails = await tb.initialize()
      // let keyDetails = await tb.initializeNewKey()
      console.log(keyDetails)
      
      await new Promise(function (resolve, reject) {
      if (keyDetails.requiredShares > 0) {
          chrome.storage.sync.get(['OnDeviceShare'], async  (result) => {
            tb.inputShare(JSON.parse(result.OnDeviceShare))
            resolve()
          });
        } else {
          chrome.storage.sync.set({OnDeviceShare: JSON.stringify(tb.outputShare(2))}, function() {
            resolve()
          });
        }
      })
        
      const keyring = await createNewTorusVaultAndRestore(password, tb.reconstructKey().toString('hex'))
      history.push(INITIALIZE_END_OF_FLOW_ROUTE)
      



      // await onSubmit(password, this.parseSeedPhrase(seedPhrase))
      // this.context.metricsEvent({
      //   eventOpts: {
      //     category: 'Onboarding',
      //     action: 'Import Seed Phrase',
      //     name: 'Import Complete',
      //   },
      // })

      // setSeedPhraseBackedUp(true).then(() => {
      //   initializeThreeBox()
      //   history.push(INITIALIZE_END_OF_FLOW_ROUTE)
      // })
    } catch (error) {
      console.error(error)
      this.setState({ seedPhraseError: error.message })
    }
  }

  isValid () {
    // const {
    //   password,
    //   confirmPassword,
    //   passwordError,
    //   confirmPasswordError,
    // } = this.state

    // if (!password || !confirmPassword || password !== confirmPassword) {
    //   return false
    // }

    // if (password.length < 8) {
    //   return false
    // }

    return true
  }

  onTermsKeyPress = ({ key }) => {
    if (key === ' ' || key === 'Enter') {
      this.toggleTermsCheck()
    }
  }

  toggleTermsCheck = () => {
    this.context.metricsEvent({
      eventOpts: {
        category: 'Onboarding',
        action: 'Import Seed Phrase',
        name: 'Check ToS',
      },
    })
    this.setState((prevState) => ({
      termsChecked: !prevState.termsChecked,
    }))
  }

  toggleShowSeedPhrase = () => {
    this.setState(({ showSeedPhrase }) => ({
      showSeedPhrase: !showSeedPhrase,
    }))
  }

  render () {
    const { t } = this.context
    const { passwordError, confirmPasswordError, termsChecked } = this.state

    return (
      <form
        className="first-time-flow__form"
        onSubmit={this.handleImport}
      >
        <div className="first-time-flow__create-back">
          {`< Back`}
        </div>
        {/* <TextField
          id="password"
          label={t('newPassword')}
          type="password"
          className="first-time-flow__input"
          value={this.state.password}
          onChange={(event) => this.handlePasswordChange(event.target.value)}
          error={passwordError}
          autoComplete="new-password"
          margin="normal"
          largeLabel
        />
        <TextField
          id="confirm-password"
          label={t('confirmPassword')}
          type="password"
          className="first-time-flow__input"
          value={this.state.confirmPassword}
          onChange={(event) => this.handleConfirmPasswordChange(event.target.value)}
          error={confirmPasswordError}
          autoComplete="confirm-password"
          margin="normal"
          largeLabel
        />
        <div className="first-time-flow__checkbox-container" onClick={this.toggleTermsCheck}>
          <div
            className="first-time-flow__checkbox first-time-flow__terms"
            tabIndex="0"
            role="checkbox"
            onKeyPress={this.onTermsKeyPress}
            aria-checked={termsChecked}
            aria-labelledby="ftf-chk1-label"
          >
            {termsChecked ? <i className="fa fa-check fa-2x" /> : null}
          </div>
          <span id="ftf-chk1-label" className="first-time-flow__checkbox-label">
            {t('acceptTermsOfUse', [(
              <a
                onClick={(e) => e.stopPropagation()}
                key="first-time-flow__link-text"
                href="https://metamask.io/terms.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="first-time-flow__link-text">
                  { t('terms') }
                </span>
              </a>
            )])}
          </span>
        </div> */}
        <Button
          type="primary"
          submit
          className="first-time-flow__button"
          disabled={!this.isValid()}
        >
          { t('import') }
        </Button>
      </form>
    )
  }
}
