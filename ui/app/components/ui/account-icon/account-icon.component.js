import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class AccountIcon extends PureComponent {
  static propTypes = {
    getPostBox: PropTypes.func,
    name: PropTypes.string,
    size: PropTypes.number,
  }

  static defaultProps = {
    name: '',
    size: 46,
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
    const { name, size } = this.props

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
      <div className="account-icon">
        {accountMenuIcon}
      </div>
    )
  }
}