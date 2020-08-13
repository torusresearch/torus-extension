import { connect } from 'react-redux'
import {getTotalDeviceShares, copyShareUsingIndexAndStoreLocally, generateAndStoreNewDeviceShare} from '../../../store/actions'
import DeviceForm from './device-form.component'
// import { getMostRecentOverviewPage } from '../../ducks/history/history'

const mapStateToProps = (state) => {
  const { metamask: { network, selectedAddress, identities = {} } } = state
  const numberOfExistingAccounts = Object.keys(identities).length
  const newAccountNumber = numberOfExistingAccounts + 1

  return {
    network,
    address: selectedAddress,
    newAccountNumber,
    // mostRecentOverviewPage: getMostRecentOverviewPage(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTotalDeviceShares: () => dispatch(getTotalDeviceShares()),
    copyShareUsingIndexAndStoreLocally: (el) => dispatch(copyShareUsingIndexAndStoreLocally(el)),
    generateAndStoreNewDeviceShare: (el) => dispatch(generateAndStoreNewDeviceShare(el))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceForm)
