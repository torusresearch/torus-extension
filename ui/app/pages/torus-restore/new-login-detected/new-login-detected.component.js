import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../components/ui/button'
import {
  TRP_DEVICE_ROUTE, INITIALIZE_END_OF_FLOW_ROUTE, TRP_IMPORT_OR_PASSWORD
} from '../../../helpers/constants/routes'

export default class NewLoginDetected extends Component {
  static defaultProps = {
    newAccountNumber: 0,
  }

  state = {
    accountPassword: '',
    accountPasswordError: '',
    defaultAccountName: 'Enter your password here',
  }

  componentDidMount(){
    const { changeHeading } = this.props
    changeHeading("Identity Verified")
  }

  continueToHomeScreen = () => {
    const { history } = this.props
    history.push(INITIALIZE_END_OF_FLOW_ROUTE)
  }

  render () {
    const { accountPassword, defaultAccountName, accountPasswordError } = this.state
    const { history, createAccount, mostRecentOverviewPage } = this.props
    return (
      <div className="new-account-create-form">
        <div className="new-account-create-form__input-label">
          A new login is trying to access your 2FA wallet. Please confirm the reference ID to confirm your identity.
          {/* It seems like you are trying to login from a new device/browser. <br /> <br />
          Please enter the password associated with this account to continue. */}
        </div>
        <div>
          <div className="new-account-create-form__buttons">
            {/* <Button
              type="default"
              large
              className="new-account-create-form__button new-account-create-form__cancel-button"
              onClick={this.otherMethods}
            >
              Verify using another method
            </Button> */}
            <Button
              type="secondary"
              large
              className="new-account-create-form__button new-account-create-form__confirm-button"
              // onClick={createClick}
              onClick={this.continueToHomeScreen}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

NewLoginDetected.propTypes = {
  createAccount: PropTypes.func,
  newAccountNumber: PropTypes.number,
  history: PropTypes.object,
  mostRecentOverviewPage: PropTypes.string,
  inputPasswordShare: PropTypes.func
}

NewLoginDetected.contextTypes = {
  t: PropTypes.func,
  metricsEvent: PropTypes.func,
}
