import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class AccountIcon extends PureComponent {
  static propTypes = {
    getPostBox: PropTypes.func,
    name: PropTypes.string,
    size: PropTypes.number,
    className: PropTypes.string,
  }

  static defaultProps = {
    name: '',
    size: 46,
    className: undefined,
  }

  state = {
    userImage: '',
  }

  updateUserImage () {
    const { getPostBox } = this.props
    getPostBox().then((postBox) => {
      const { userInfo } = postBox
      this.setState({ userImage: userInfo && userInfo.profileImage ? userInfo.profileImage : '' })
    })
  }

  render() {
    const { userImage } = this.state
    const { name, size, className } = this.props

    this.updateUserImage()
  
    let accountMenuIcon = <img src="images/account-icon.svg" width={size} height={size} />
    if (name) {
      if (name.toLowerCase() === 'tkey wallet') {
        accountMenuIcon = <img src="images/account-icon-tkey.svg" width={size} height={size} />
      } else if (name.toLowerCase() === 'private key') {
        accountMenuIcon = <img src="images/account-icon-pk.svg" width={size} height={size} />
      } else if (name.toLowerCase() === 'seed phrase') {
        accountMenuIcon = <img src="images/account-icon-sp.svg" width={size} height={size} />
      } else if (name.toLowerCase() === 'google') {
        accountMenuIcon = <img src={userImage} width={size} height={size} style={{ borderRadius: '50%' }} />
      }
    }

    return (
      <div className={classnames('account-icon', className)}>
        {accountMenuIcon}
      </div>
    )
  }
}