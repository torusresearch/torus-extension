import { connect } from 'react-redux'
import EndOfFlow from './end-of-flow.component'
import { setCompletedOnboarding, lookForNewRequests } from '../../../store/actions'
import { getOnboardingInitiator } from '../../../selectors'

const firstTimeFlowTypeNameMap = {
  create: 'New Wallet Created',
  'import': 'New Wallet Imported',
}

const mapStateToProps = (state) => {
  const { metamask: { firstTimeFlowType } } = state

  return {
    completionMetaMetricsName: firstTimeFlowTypeNameMap[firstTimeFlowType],
    onboardingInitiator: getOnboardingInitiator(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    completeOnboarding: () => dispatch(setCompletedOnboarding()),
    lookForNewRequests: () => dispatch(lookForNewRequests())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EndOfFlow)
