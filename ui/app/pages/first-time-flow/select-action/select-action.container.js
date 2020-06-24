import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { setFirstTimeFlowType, importNewAccount, setSelectedAddress } from '../../../store/actions'
import { getFirstTimeFlowTypeRoute } from '../../../selectors'
import Welcome from './select-action.component'

const mapStateToProps = (state) => {
  return {
    nextRoute: getFirstTimeFlowTypeRoute(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFirstTimeFlowType: (type) => dispatch(setFirstTimeFlowType(type)),
    importNewAccount: (strategy, [ privateKey ]) => {
      return dispatch(importNewAccount(strategy, [ privateKey ]))
    },
    setSelectedAddress: (address) => dispatch(setSelectedAddress(address)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Welcome)
