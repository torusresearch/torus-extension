import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Identicon from '../../ui/identicon'
import MetaFoxLogo from '../../ui/metafox-logo'
import { DEFAULT_ROUTE } from '../../../helpers/constants/routes'
import NetworkIndicator from '../network'

export default class AppHeader extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    network: PropTypes.string,
    provider: PropTypes.object,
    networkDropdownOpen: PropTypes.bool,
    showNetworkDropdown: PropTypes.func,
    hideNetworkDropdown: PropTypes.func,
    toggleAccountMenu: PropTypes.func,
    selectedAddress: PropTypes.string,
    isUnlocked: PropTypes.bool,
    hideNetworkIndicator: PropTypes.bool,
    disabled: PropTypes.bool,
    isAccountMenuOpen: PropTypes.bool,
    selectedIdentity: PropTypes.object,
    getPostBox: PropTypes.func,
  }

  state = {
    userImage: '',
  }

  isMounted = false

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  componentDidMount () {
    this.isMounted = true
  }

  componentWillUnmount () {
    this.isMounted = false
  }

  updateUserImage () {
    const { getPostBox } = this.props
    getPostBox().then((postBox) => {
      const { userInfo } = postBox
      this.setState({ userImage: userInfo && userInfo.profileImage ? userInfo.profileImage : '' })
    })
  }

  handleNetworkIndicatorClick (event) {
    event.preventDefault()
    event.stopPropagation()

    const { networkDropdownOpen, showNetworkDropdown, hideNetworkDropdown } = this.props

    if (networkDropdownOpen === false) {
      this.context.metricsEvent({
        eventOpts: {
          category: 'Navigation',
          action: 'Home',
          name: 'Opened Network Menu',
        },
      })
      showNetworkDropdown()
    } else {
      hideNetworkDropdown()
    }
  }

  renderAccountMenu () {
    const { isUnlocked, toggleAccountMenu, selectedAddress, disabled, isAccountMenuOpen, selectedIdentity } = this.props
    const { userImage } = this.state

    let accountMenuIcon = <img src="images/account-icon.svg" width="32" height="32" />
    if (selectedIdentity) {
      if (selectedIdentity.name.toLowerCase() === '2fa wallet') {
        accountMenuIcon = <img src="images/account-icon-2fa.svg" width="32" height="32" />
      } else if (selectedIdentity.name.toLowerCase() === 'private key') {
        accountMenuIcon = <img src="images/account-icon-pk.svg" width="32" height="32" />
      } else if (selectedIdentity.name.toLowerCase() === 'seed phrase') {
        accountMenuIcon = <img src="images/account-icon-sp.svg" width="32" height="32" />
      } else if (selectedIdentity.name.toLowerCase() === 'google') {
        accountMenuIcon = <img src={userImage} width="32" height="32" style={{ borderRadius: '50%' }} />
      }
    }

    return isUnlocked && (
      <div
        className={classnames('account-menu__icon', {
          'account-menu__icon--disabled': disabled,
        })}
        onClick={() => {
          if (!disabled) {
            !isAccountMenuOpen && this.context.metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Home',
                name: 'Opened Main Menu',
              },
            })
            toggleAccountMenu()
          }
        }}
      >
        {/* <Identicon
          address={selectedAddress}
          diameter={32}
          addBorder
        /> */}
        <div className="account-menu__icon-container">
          {accountMenuIcon}
        </div>
      </div>
    )
  }

  render () {
    const {
      history,
      network,
      provider,
      isUnlocked,
      hideNetworkIndicator,
      disabled,
      getPostBox,
    } = this.props
    const { userimage } = this.state

    // if (!userimage && this.isMounted) {
    //   getPostBox().then((postBox) => {
    //     const { userInfo } = postBox
    //     this.setState({ userimage: userInfo && userInfo.profileImage ? userInfo.profileImage : '' })
    //   })
    // }

    this.updateUserImage()

    return (
      <div
        className={classnames('app-header', 'app-header--back-drop')}
      >
        <div className="app-header__contents">
          <MetaFoxLogo
            unsetIconHeight
            onClick={() => history.push(DEFAULT_ROUTE)}
          />
          <div className="app-header__account-menu-container">
            {
              !hideNetworkIndicator && (
                <div className="app-header__network-component-wrapper">
                  <NetworkIndicator
                    network={network}
                    provider={provider}
                    onClick={(event) => this.handleNetworkIndicatorClick(event)}
                    disabled={disabled}
                  />
                </div>
              )
            }
            { this.renderAccountMenu() }
          </div>
        </div>
      </div>
    )
  }
}
