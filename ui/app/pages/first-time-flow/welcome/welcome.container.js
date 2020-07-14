import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { closeWelcomeScreen, createNewTorusVaultAndRestore } from '../../../store/actions'
import Welcome from './welcome.component'

const mapStateToProps = ({ metamask }) => {
  const { welcomeScreenSeen, participateInMetaMetrics } = metamask

  return {
    welcomeScreenSeen,
    participateInMetaMetrics,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeWelcomeScreen: () => dispatch(closeWelcomeScreen()),
    createNewTorusVaultAndRestore: (password, privateKey) => {
      return dispatch(createNewTorusVaultAndRestore(password, privateKey))
    },
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Welcome)
