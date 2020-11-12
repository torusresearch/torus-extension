import React, { Component } from 'react'
import PropTypes from 'prop-types'
import copyToClipboard from 'copy-to-clipboard'
import classnames from 'classnames'

import AccountListItem from '../send/account-list-item/account-list-item.component'
import Button from '../../components/ui/button'
import Identicon from '../../components/ui/identicon'
import Tooltip from '../../components/ui/tooltip-v2'

import { ENVIRONMENT_TYPE_NOTIFICATION } from '../../../../app/scripts/lib/enums'
import { getEnvironmentType } from '../../../../app/scripts/lib/util'
import { conversionUtil } from '../../helpers/utils/conversion-util'

export default class ConfirmDecryptMessage extends Component {
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
    cancelDecryptMessage: PropTypes.func.isRequired,
    decryptMessage: PropTypes.func.isRequired,
    decryptMessageInline: PropTypes.func.isRequired,
    conversionRate: PropTypes.number,
    history: PropTypes.object.isRequired,
    mostRecentOverviewPage: PropTypes.string.isRequired,
    requesterAddress: PropTypes.string,
    txData: PropTypes.object,
    domainMetadata: PropTypes.object,
  }

  state = {
    fromAccount: this.props.fromAccount,
    copyToClipboardPressed: false,
    hasCopied: false,
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
      cancelDecryptMessage,
      txData,
    } = this.props
    const { metricsEvent } = this.context
    await cancelDecryptMessage(txData, event)
    metricsEvent({
      eventOpts: {
        category: 'Messages',
        action: 'Decrypt Message Request',
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

  copyMessage = () => {
    copyToClipboard(this.state.rawMessage)
    this.context.metricsEvent({
      eventOpts: {
        category: 'Messages',
        action: 'Decrypt Message Copy',
        name: 'Copy',
      },
    })
    this.setState({ hasCopied: true })
    setTimeout(() => this.setState({ hasCopied: false }), 3000)
  }

  renderHeader = () => {
    return (
      <div className="request-decrypt-message__header">
        {/* <div className="request-decrypt-message__header-background" /> */}

        <img
          height={16}
          src="/images/torus-wordmark.png"
        />
        <div className="request-decrypt-message__header__text">
          Decryption request
        </div>

        {/* <div className="request-decrypt-message__header__tip-container">
          <div className="request-decrypt-message__header__tip" />
        </div> */}
      </div>
    )
  }

  renderAccount = () => {
    const { fromAccount } = this.state
    const { t } = this.context

    return (
      <div className="request-decrypt-message__account">
        <div className="request-decrypt-message__account-text">
          { `${t('account')}:` }
        </div>

        <div className="request-decrypt-message__account-item">
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
    const { fromAccount: { balance } } = this.state
    const { t } = this.context

    const balanceInEther = conversionUtil(balance, {
      fromNumericBase: 'hex',
      toNumericBase: 'dec',
      fromDenomination: 'WEI',
      numberOfDecimals: 6,
      conversionRate,
    })

    return (
      <div className="request-decrypt-message__balance">
        <div className="request-decrypt-message__balance-text">
          { `${t('balance')}:` }
        </div>
        <div className="request-decrypt-message__balance-value">
          { `${balanceInEther} ETH` }
        </div>
      </div>
    )
  }

  renderRequestIcon = () => {
    const { requesterAddress } = this.props

    return (
      <div className="request-decrypt-message__request-icon">
        <Identicon
          diameter={40}
          address={requesterAddress}
        />
      </div>
    )
  }

  renderAccountInfo = (host, origin) => {
    return (
      <div className="request-decrypt-message__account-info">
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
    const { decryptMessageInline, domainMetadata, txData } = this.props
    const { t } = this.context

    const origin = domainMetadata[txData.msgParams.origin]
    const notice = t('decryptMessageNotice', [origin.name])

    const {
      hasCopied,
      hasDecrypted,
      hasError,
      rawMessage,
      errorMessage,
      copyToClipboardPressed,
    } = this.state

    return (
      <div className="request-decrypt-message__body">
        { this.renderAccountInfo(origin.host, txData.msgParams.origin) }
        {/* <div
          className="request-decrypt-message__visual"
        >
          <section>
            {origin.icon ? (
              <img
                className="request-decrypt-message__visual-identicon"
                src={origin.icon}
              />
            ) : (
              <i className="request-decrypt-message__visual-identicon--default">
                {origin.name.charAt(0).toUpperCase()}
              </i>
            )}
            <div
              className="request-decrypt-message__notice"
            >
              { notice }
            </div>
          </section>
        </div> */}
        <div
          className={classnames({
            'request-decrypt-message__message': true,
            'request-decrypt-message__message--pressed': hasDecrypted || hasError,
          })}
        >
          <div
            className="request-decrypt-message__message-text"
          >
            { !hasDecrypted && !hasError ? txData.msgParams.data : rawMessage }
            { !hasError ? '' : errorMessage }
          </div>
          <div
            className={classnames({
              'request-decrypt-message__message-cover': true,
              'request-decrypt-message__message-lock--pressed': hasDecrypted || hasError,
            })}
          >
          </div>
          <div
            className={classnames({
              'request-decrypt-message__message-lock': true,
              'request-decrypt-message__message-lock--pressed': hasDecrypted || hasError,
            })}
            onClick={(event) => {
              decryptMessageInline(txData, event).then((result) => {
                if (!result.error) {
                  this.setState({ hasDecrypted: true, rawMessage: result.rawData })
                } else {
                  this.setState({ hasError: true, errorMessage: this.context.t('decryptInlineError', [result.error]) })
                }
              })
            }}
          >
            <img src="images/decrypt-lock.svg" />
            <div
              className="request-decrypt-message__message-lock-text"
            >
              {t('decryptMetamask')}
            </div>
          </div>
        </div>
        { hasDecrypted ?
          (
            <div
              className={classnames({
                'request-decrypt-message__message-copy': true,
                'request-decrypt-message__message-copy--pressed': copyToClipboardPressed,
              })}
              onClick={() => this.copyMessage()}
              onMouseDown={() => this.setState({ copyToClipboardPressed: true })}
              onMouseUp={() => this.setState({ copyToClipboardPressed: false })}
            >
              <Tooltip
                position="bottom"
                title={hasCopied ? t('copiedExclamation') : t('copyToClipboard')}
                wrapperClassName="request-decrypt-message__message-copy-tooltip"
              >
                <img style={{marginBottom: '-2px'}} src="images/copy-to-clipboard.svg" />
                <div
                  className="request-decrypt-message__message-copy-text"
                >
                  {t('decryptCopy')}
                </div>
              </Tooltip>
            </div>
          )
          :
          <div></div>
        }
      </div>
    )
  }

  renderFooter = () => {
    const {
      cancelDecryptMessage,
      clearConfirmTransaction,
      decryptMessage,
      history,
      mostRecentOverviewPage,
      txData,
    } = this.props
    const { metricsEvent, t } = this.context

    return (
      <div className="request-decrypt-message__footer">
        <Button
          type="link"
          small
          className="request-decrypt-message__footer__cancel-button"
          onClick={async (event) => {
            this._removeBeforeUnload()
            await cancelDecryptMessage(txData, event)
            metricsEvent({
              eventOpts: {
                category: 'Messages',
                action: 'Decrypt Message Request',
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
          className="request-decrypt-message__footer__sign-button"
          onClick={async (event) => {
            this._removeBeforeUnload()
            await decryptMessage(txData, event)
            metricsEvent({
              eventOpts: {
                category: 'Messages',
                action: 'Decrypt Message Request',
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
      <div className="request-decrypt-message__container">
        { this.renderHeader() }
        { this.renderBody() }
        { this.renderFooter() }
      </div>
    )
  }
}
