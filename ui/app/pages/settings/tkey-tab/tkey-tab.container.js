import tkeyTab from './tkey-tab.component'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  setFeatureFlag,
  setParticipateInMetaMetrics,
  setUsePhishDetect,
  getTkeyState,
  getTkeyState2,
  getTkeyDataForSettingsPage,
  addPasswordShare
} from '../../../store/actions'

const mapStateToProps = (state) => {
  const { appState: { warning }, metamask } = state
  const {
    featureFlags: {
      showIncomingTransactions,
    } = {},
    participateInMetaMetrics,
    usePhishDetect,
  } = metamask

  return {
    warning,
    showIncomingTransactions,
    participateInMetaMetrics,
    usePhishDetect,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setParticipateInMetaMetrics: (val) => dispatch(setParticipateInMetaMetrics(val)),
    setShowIncomingTransactionsFeatureFlag: (shouldShow) => dispatch(setFeatureFlag('showIncomingTransactions', shouldShow)),
    setUsePhishDetect: (val) => dispatch(setUsePhishDetect(val)),
    getTkeyState: () => dispatch(getTkeyState()),
    getTkeyState2: () => dispatch(getTkeyState2()),
    getTkeyDataForSettingsPage: () => dispatch(getTkeyDataForSettingsPage()),
    addPasswordShare: (el) => dispatch(addPasswordShare(el))
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(tkeyTab)
