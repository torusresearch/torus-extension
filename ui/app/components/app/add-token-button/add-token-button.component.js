import React from 'react'
import { useMetricEvent } from '../../../hooks/useMetricEvent'
import { useI18nContext } from '../../../hooks/useI18nContext'
import { useHistory } from 'react-router-dom'
import { ADD_TOKEN_ROUTE } from '../../../helpers/constants/routes'
import Button from '../../ui/button'
import Plus from '../../ui/icon/plus-icon'


export default function AddTokenButton () {
  const addTokenEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Token Menu',
      name: 'Clicked "Add Token"',
    },
  })
  const t = useI18nContext()
  const history = useHistory()

  return (
    <div className="add-token-button">
      <Button
        className="add-token-button__button"
        type="raised"
        small
        icon={<Plus color="#0364FF" size={20} />}
        onClick={() => {
          history.push(ADD_TOKEN_ROUTE)
          addTokenEvent()
        }}
      >
        {t('addToken')}
      </Button>
    </div>
  )
}
