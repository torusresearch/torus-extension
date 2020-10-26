import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addSeedPhrase, setSelectedAddress, displayWarning, importNewAccount } from '../../../store/actions'
import { getMetaMaskAccounts } from '../../../selectors'
import Button from '../../../components/ui/button'
import { getMostRecentOverviewPage } from '../../../ducks/history/history'
import { TextField } from '@material-ui/core'

class SeedPhraseImportView extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  static propTypes = {
    importNewAccount: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    displayWarning: PropTypes.func.isRequired,
    setSelectedAddress: PropTypes.func.isRequired,
    firstAddress: PropTypes.string.isRequired,
    error: PropTypes.node,
    mostRecentOverviewPage: PropTypes.string.isRequired,
  }

  inputRef = React.createRef()

  state = { isEmpty: true }

  createNewKeychain () {
    const privateKey = this.inputRef.current.value
    const { addSeedPhrase, history, displayWarning, mostRecentOverviewPage, setSelectedAddress, firstAddress } = this.props

    addSeedPhrase(privateKey)
      .then(({ selectedAddress }) => {
        if (selectedAddress) {
          this.context.metricsEvent({
            eventOpts: {
              category: 'Accounts',
              action: 'Import Account',
              name: 'Imported Account with Private Key',
            },
          })
          history.push(mostRecentOverviewPage)
          displayWarning(null)
        } else {
          displayWarning('Error importing account.')
          this.context.metricsEvent({
            eventOpts: {
              category: 'Accounts',
              action: 'Import Account',
              name: 'Error importing with Private Key',
            },
          })
          setSelectedAddress(firstAddress)
        }
      })
      .catch((err) => err && displayWarning(err.message || err))
  }

  createKeyringOnEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.createNewKeychain()
    }
  }

  checkInputEmpty () {
    const privateKey = this.inputRef.current.value
    let isEmpty = true
    if (privateKey !== '') {
      isEmpty = false
    }
    this.setState({ isEmpty })
  }

  render () {
    const { error, displayWarning } = this.props

    return (
      <div className="new-account-import-form__private-key">
        <span className="new-account-create-form__instruction">
          {/* {this.context.t('pastePrivateKey')} */}
          Insert your seed phrase here
        </span>
        <div className="new-account-import-form__private-key-password-container">
          <input
            className="new-account-import-form__input-password"
            type="text"
            id="private-key-box"
            onKeyPress={(e) => this.createKeyringOnEnter(e)}
            onChange={() => this.checkInputEmpty()}
            ref={this.inputRef}
            autoComplete="off"
          />
        </div>
        <div className="new-account-import-form__buttons">
          <Button
            type="link"
            className="new-account-create-form__button new-account-create-form__button--cancel"
            onClick={() => {
              const { history, mostRecentOverviewPage } = this.props
              displayWarning(null)
              history.push(mostRecentOverviewPage)
            }}
          >
            {this.context.t('cancel')}
          </Button>
          <Button
            type="primary"
            className="new-account-create-form__button"
            onClick={() => this.createNewKeychain()}
            disabled={this.state.isEmpty}
          >
            {this.context.t('confirm')}
          </Button>
        </div>
        {
          error
            ? <span className="error">{error}</span>
            : null
        }
      </div>
    )
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SeedPhraseImportView)


function mapStateToProps (state) {
  return {
    error: state.appState.warning,
    firstAddress: Object.keys(getMetaMaskAccounts(state))[0],
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    importNewAccount: (strategy, [ privateKey ], userData) => {
      return dispatch(importNewAccount(strategy, [ privateKey ], userData))
    },
    displayWarning: (message) => dispatch(displayWarning(message || null)),
    setSelectedAddress: (address) => dispatch(setSelectedAddress(address)),
    addSeedPhrase: (seedPhrase) => dispatch(addSeedPhrase(seedPhrase)),
  }
}
