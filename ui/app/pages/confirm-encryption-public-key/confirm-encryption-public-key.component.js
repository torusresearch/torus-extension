import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AccountListItem from '../send/account-list-item/account-list-item.component'
import Button from '../../components/ui/button'
import Identicon from '../../components/ui/identicon'

import { ENVIRONMENT_TYPE_NOTIFICATION } from '../../../../app/scripts/lib/enums'
import { getEnvironmentType } from '../../../../app/scripts/lib/util'
import { conversionUtil } from '../../helpers/utils/conversion-util'

export default class ConfirmEncryptionPublicKey extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
    metricsEvent: PropTypes.func.isRequired,
  }

  static propTypes = {
    fromAccount: PropTypes.shape({
      address: PropTypes.string.isRequired,
      balance: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
    clearConfirmTransaction: PropTypes.func.isRequired,
    cancelEncryptionPublicKey: PropTypes.func.isRequired,
    encryptionPublicKey: PropTypes.func.isRequired,
    conversionRate: PropTypes.number,
    history: PropTypes.object.isRequired,
    requesterAddress: PropTypes.string,
    txData: PropTypes.object,
    domainMetadata: PropTypes.object,
    mostRecentOverviewPage: PropTypes.string.isRequired,
  }

  state = {
    fromAccount: this.props.fromAccount,
  }

  componentDidMount = () => {
    if (getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_NOTIFICATION) {
      window.addEventListener('beforeunload', this._beforeUnload)
    }
  }

  componentWillUnmount = () => {
    this._removeBeforeUnload()
  }

  _beforeUnload = async (event) => {
    const {
      clearConfirmTransaction,
      cancelEncryptionPublicKey,
      txData,
    } = this.props
    const { metricsEvent } = this.context
    await cancelEncryptionPublicKey(txData, event)
    metricsEvent({
      eventOpts: {
        category: 'Messages',
        action: 'Encryption public key Request',
        name: 'Cancel Via Notification Close',
      },
    })
    clearConfirmTransaction()
  }

  _removeBeforeUnload = () => {
    if (getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_NOTIFICATION) {
      window.removeEventListener('beforeunload', this._beforeUnload)
    }
  }

  renderHeader = () => {
    return (
      <div className="request-encryption-public-key__header">
        {/* <div className="request-encryption-public-key__header-background" /> */}

        <img
          height={16}
          src="/images/torus-wordmark.png"
        />
        <div className="request-encryption-public-key__header__text">
          Encryption request
        </div>

        {/* <div className="request-encryption-public-key__header__tip-container">
          <div className="request-encryption-public-key__header__tip" />
        </div> */}
      </div>
    )
  }

  renderAccount = () => {
    const { fromAccount } = this.state
    const { t } = this.context

    return (
      <div className="request-encryption-public-key__account">
        <div className="request-encryption-public-key__account-text">
          { `${t('account')}:` }
        </div>

        <div className="request-encryption-public-key__account-item">
          <AccountListItem
            account={fromAccount}
            displayBalance={false}
          />
        </div>
      </div>
    )
  }

  renderBalance = () => {
    const { conversionRate } = this.props
    const { t } = this.context
    const { fromAccount: { balance } } = this.state

    const balanceInEther = conversionUtil(balance, {
      fromNumericBase: 'hex',
      toNumericBase: 'dec',
      fromDenomination: 'WEI',
      numberOfDecimals: 6,
      conversionRate,
    })

    return (
      <div className="request-encryption-public-key__balance">
        <div className="request-encryption-public-key__balance-text">
          { `${t('balance')}:` }
        </div>
        <div className="request-encryption-public-key__balance-value">
          { `${balanceInEther} ETH` }
        </div>
      </div>
    )
  }

  renderRequestIcon = () => {
    const { requesterAddress } = this.props

    return (
      <div className="request-encryption-public-key__request-icon">
        <Identicon
          diameter={40}
          address={requesterAddress}
        />
      </div>
    )
  }

  renderAccountInfo = (host, origin) => {
    return (
      <div className="request-encryption-public-key__account-info">
        <div className="request-encryption-public-key__account-info-title">Allow E2E test Dapp to compose encrypted messages to you</div>
        <hr className="request-encryption-public-key__account-divider"/>
        <div>
          <div className="request-encryption-public-key__account-label">Requested from:</div>
          <div className="request-encryption-public-key__account-info-box">
            <a className="info-url" href={origin} target="_blank">{host}</a>
            <a href={origin} target="_blank" style={{marginLeft: 'auto'}}>
              <button className="info-link">
                <img
                  height={10}
                  className="account-menu__item-icon"
                  src="images/etherscan-link.svg"
                />
              </button>
            </a>
          </div>
        </div>
        {/* { this.renderAccount() }
        { this.renderRequestIcon() }
        { this.renderBalance() } */}
      </div>
    )
  }

  renderBody = () => {
    const { domainMetadata, txData } = this.props
    console.log('ConfirmEncryptionPublicKey -> txData', txData)
    const { t } = this.context

    const origin = domainMetadata[txData.origin]
    console.log('ConfirmEncryptionPublicKey -> origin', origin)
    const notice = t('encryptionPublicKeyNotice', [origin.name])

    return (
      <div className="request-encryption-public-key__body">
        { this.renderAccountInfo(origin.host, txData.origin) }
        {/* <div
          className="request-encryption-public-key__visual"
        >
          <section>
            {origin.icon ? (
              <img
                className="request-encryption-public-key__visual-identicon"
                src={origin.icon}
              />
            ) : (
              <i className="request-encryption-public-key__visual-identicon--default">
                {origin.name.charAt(0).toUpperCase()}
              </i>
            )}
            <div
              className="request-encryption-public-key__notice"
            >
              { notice }
            </div>
          </section>
        </div> */}
      </div>
    )
  }

  renderFooter = () => {
    const {
      cancelEncryptionPublicKey,
      clearConfirmTransaction,
      encryptionPublicKey,
      history,
      mostRecentOverviewPage,
      txData,
    } = this.props
    const { t, metricsEvent } = this.context

    return (
      <div className="request-encryption-public-key__footer">
        <Button
          type="link"
          small
          className="request-encryption-public-key__footer__cancel-button"
          onClick={async (event) => {
            this._removeBeforeUnload()
            await cancelEncryptionPublicKey(txData, event)
            metricsEvent({
              eventOpts: {
                category: 'Messages',
                action: 'Encryption public key Request',
                name: 'Cancel',
              },
            })
            clearConfirmTransaction()
            history.push(mostRecentOverviewPage)
          }}
        >
          Deny
        </Button>
        <Button
          type="primary"
          small
          className="request-encryption-public-key__footer__sign-button"
          onClick={async (event) => {
            this._removeBeforeUnload()
            await encryptionPublicKey(txData, event)
            this.context.metricsEvent({
              eventOpts: {
                category: 'Messages',
                action: 'Encryption public key Request',
                name: 'Confirm',
              },
            })
            clearConfirmTransaction()
            history.push(mostRecentOverviewPage)
          }}
        >
          Allow
        </Button>
      </div>
    )
  }

  render = () => {
    return (
      <div className="request-encryption-public-key__container">
        { this.renderHeader() }
        { this.renderBody() }
        { this.renderFooter() }
      </div>
    )
  }
}
