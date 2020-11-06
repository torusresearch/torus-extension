import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '../../components/ui/text-field'
import getCaretCoordinates from 'textarea-caret'
import { EventEmitter } from 'events'
import Mascot from '../../components/ui/mascot'
import { getEnvironmentType } from '../../../../app/scripts/lib/util'
import {
  DEFAULT_ROUTE,
  TORUS_RESTORE_PASSWORD_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
  TRP_IMPORT_OR_PASSWORD,
} from '../../helpers/constants/routes'
import { ENVIRONMENT_TYPE_FULLSCREEN } from '../../../../app/scripts/lib/enums'

export default class UnlockPage extends Component {
  static contextTypes = {
    metricsEvent: PropTypes.func,
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    isUnlocked: PropTypes.bool,
    onImport: PropTypes.func,
    onRestore: PropTypes.func,
    onSubmit: PropTypes.func,
    onGoogleLogin: PropTypes.func,
    forceUpdateMetamaskState: PropTypes.func,
    showOptInModal: PropTypes.func,
    googleLogin: PropTypes.func,
  }

  state = {
    password: '',
    error: null,
    loginErrorMessage: '',
  }

  submitting = false

  animationEventEmitter = new EventEmitter()

  UNSAFE_componentWillMount () {
    const { isUnlocked, history } = this.props

    // getEnvironmentType() === ENVIRONMENT_TYPE_FULL SCREEN ? void (0) : global.platform.openExtensionInBrowser();

    if (isUnlocked) {
      history.push(DEFAULT_ROUTE)
    }
  }

  handleLogin = async (newKeyAssign) => {
    event.preventDefault()
    event.stopPropagation()
    const { onGoogleLogin, forceUpdateMetamaskState, history } = this.props
    this.setState({ error: null })
    this.submitting = true

    try {
      await onGoogleLogin(newKeyAssign)
      history.push(DEFAULT_ROUTE)

      // setTimeout(function () {
      // }, 2000)
    } catch (err) {
      if (err.message === 'Password required') {
        history.push(TORUS_RESTORE_PASSWORD_ROUTE)
      } else if (err.message === 'Share transfer required') {
        history.push(TRP_IMPORT_OR_PASSWORD)
      } else if (err.message === 'new key assign required') {
        this.setState({ loginErrorMessage: 'Unsuccessful login. Please contact us at hello@tor.us' })
      }
      console.error(err)
    }
  }

  handleSubmit = async (newKeyAssign, event) => {
    event.preventDefault()
    event.stopPropagation()

    const { password } = this.state
    const { onSubmit, forceUpdateMetamaskState, showOptInModal } = this.props

    // if (password === '' || this.submitting) {
    //   return
    // }

    this.setState({ error: null })
    this.submitting = true

    try {
      await onSubmit(password)
      const newState = await forceUpdateMetamaskState()
      // this.context.metricsEvent({
      //   eventOpts: {
      //     category: 'Navigation',
      //     action: 'Unlock',
      //     name: 'Success',
      //   },
      //   isNewVisit: true,
      // })

      if (
        newState.participateInMetaMetrics === null ||
        newState.participateInMetaMetrics === undefined
      ) {
        // showOptInModal()
      }
    } catch ({ message }) {
      if (message === 'Incorrect password') {
        const newState = await forceUpdateMetamaskState()
      }
      this.setState({ error: message })
      this.submitting = false
    }
  }

  handleInputChange ({ target }) {
    this.setState({ password: target.value, error: null })

    // tell mascot to look at page action
    if (target.getBoundingClientRect) {
      const element = target
      const boundingRect = element.getBoundingClientRect()
      const coordinates = getCaretCoordinates(element, element.selectionEnd)
      this.animationEventEmitter.emit('point', {
        x: boundingRect.left + coordinates.left - element.scrollLeft,
        y: boundingRect.top + coordinates.top - element.scrollTop,
      })
    }
  }

  renderGoogleButton () {
    const style = {
      backgroundColor: '#0364FF',
      color: 'white',
      marginTop: '40px',
      height: '60px',
      fontWeight: '500',
      boxShadow: 'none',
      borderRadius: '4px',
      textTransform: 'unset',
    }

    return (
      <div>

        <Button
          type="submit"
          style={style}
          disabled={false}
          fullWidth
          variant="raised"
          size="large"
          onClick={() => this.handleLogin(false)}
          disableRipple
        >
          Continue with Google login
        </Button>

        {/* <Button
          type="submit"
          style={style}
          disabled={false}
          fullWidth
          variant="raised"
          size="large"
          onClick={() => this.handleLogin(true)}
          disableRipple
        >
          Google Login (with new key assign)
        </Button> */}
      </div>
    )
  }

  renderSubmitButton () {
    const style = {
      backgroundColor: '#0364FF',
      color: 'white',
      marginTop: '20px',
      height: '60px',
      fontWeight: '500',
      boxShadow: 'none',
      borderRadius: '4px',
    }

    return (
      <Button
        type="submit"
        style={style}
        disabled={false}
        fullWidth
        variant="raised"
        size="large"
        onClick={() => this.handleSubmit(true)}
        disableRipple
      >
        {this.context.t('unlock')}
      </Button>
    )
  }

  render () {
    const { password, error, loginErrorMessage } = this.state
    const { t } = this.context
    const { onImport, onRestore } = this.props

    return (
      <div className="unlock-page__container">
        <div className="unlock-page">
          <div className="unlock-page__mascot-container">
            <img
              src="images/torus-icon-blue.png"
              width="100"
              height="100"
              margin="10px"
            />
          </div>
          <h1 className="unlock-page__title">Welcome back</h1>
          <div className="welcome-page__description">Your digital wallet in one-click</div>

          {/* <Button
            type="primary"
            className="first-time-flow__button"
            onClick={this.handleLogin}
          >
            Continue with google
          </Button> */}

          {this.renderGoogleButton()}

          <div className="welcome-page__loginErrorMessage">{loginErrorMessage}</div>
          {/*
{/*
          {/*

          <form
            className="unlock-page__form"
            onSubmit={this.handleSubmit}
          >
            <TextField
              id="password"
              label={t('password')}
              type="password"
              value={password}
              onChange={(event) => this.handleInputChange(event)}
              error={error}
              autoFocus
              autoComplete="current-password"
              theme="material"
              fullWidth
            />
          </form>
          { this.renderSubmitButton() }
          <div className="unlock-page__links">
            <div
              className="unlock-page__link"
              onClick={() => onRestore()}
            >
              { t('restoreFromSeed') }
            </div>
            <div
              className="unlock-page__link unlock-page__link--import"
              onClick={() => onImport()}
            >
              { t('importUsingSeed') }
            </div>
          </div> */}
        </div>
      </div>
    )
  }
}
