import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../components/ui/button'

export default class RestorePasswordForm extends Component {
  static defaultProps = {
    newAccountNumber: 0,
  }

  state = {
    inputPassword: '',
    defaultAccountName: 'Enter your password here',
  }

  render () {
    const { inputPassword, defaultAccountName } = this.state
    const { history, createAccount, mostRecentOverviewPage } = this.props
    const createClick = (_) => {
      // createAccount(inputPassword || defaultAccountName)
      //   .then(() => {
      //     this.context.metricsEvent({
      //       eventOpts: {
      //         category: 'Accounts',
      //         action: 'Add New Account',
      //         name: 'Added New Account',
      //       },
      //     })
      //     history.push(mostRecentOverviewPage)
      //   })
      //   .catch((e) => {
      //     this.context.metricsEvent({
      //       eventOpts: {
      //         category: 'Accounts',
      //         action: 'Add New Account',
      //         name: 'Error',
      //       },
      //       customVariables: {
      //         errorMessage: e.message,
      //       },
      //     })
        // })
    }

    return (
      <div className="new-account-create-form">
        <div className="new-account-create-form__input-label">
          You are accessing your 2FA Wallet from a new platform. Verify your identity with your password:
        </div>
        <div>
          <input
            className="new-account-create-form__input"
            value={inputPassword}
            placeholder={defaultAccountName}
            onChange={(event) => this.setState({ inputPassword: event.target.value })}
          />
          <div className="new-account-create-form__buttons">
            <Button
              type="default"
              large
              className="new-account-create-form__button new-account-create-form__cancel-button"
              onClick={() => history.push(mostRecentOverviewPage)}
            >
              Verify using another method
            </Button>
            <Button
              type="secondary"
              large
              className="new-account-create-form__button"
              onClick={createClick}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

RestorePasswordForm.propTypes = {
  createAccount: PropTypes.func,
  newAccountNumber: PropTypes.number,
  history: PropTypes.object,
  mostRecentOverviewPage: PropTypes.string,
}

RestorePasswordForm.contextTypes = {
  t: PropTypes.func,
  metricsEvent: PropTypes.func,
}
