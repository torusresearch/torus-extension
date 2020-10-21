import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

// Subviews
import JsonImportView from './json.js'

import PrivateKeyImportView from './private-key.js'

import SeedPhraseImportView from "./seed-phrase.js"

export default class AccountImportSubview extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  state = {}

  getMenuItemTexts () {
    return [
      this.context.t('privateKey'),
      this.context.t('jsonFile'),
      'Seed Phrase'
    ]
  }

  renderImportView () {
    const { type } = this.state
    const menuItems = this.getMenuItemTexts()
    const current = typeof(type) === "object" ? type : menuItems[0]
    // console.log(type, current.value, menuItems)
    switch (current.value || current) {
      case this.context.t('privateKey'):
        return <PrivateKeyImportView />
      case this.context.t('jsonFile'):
        return <JsonImportView />
      case "Seed Phrase":
        return <SeedPhraseImportView />
      default:
        return <JsonImportView />
    }
  }

  render () {
    const menuItems = this.getMenuItemTexts()
    const { type } = this.state
    
    return (
      <div className="new-account-import-form">
        <div className="new-account-import-disclaimer">
          <span>{this.context.t('importAccountMsg')}</span>
          <span
            style={{
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={() => {
              global.platform.openTab({
                url: 'https://metamask.zendesk.com/hc/en-us/articles/360015289932',
              })
            }}
          >
            {this.context.t('here')}
          </span>
        </div>
        <div className="new-account-import-form__select-section">
          <div className="new-account-import-form__select-label">
            {this.context.t('selectType')}
          </div>

          <Select
            className="new-account-import-form__select new-account-import-form__select--no-border"
            name="import-type-select"
            clearable={false}
            defaultValue={{ label: menuItems[0], value: menuItems[0] }}
            value={type}
            options={menuItems.map((type) => {
              return {
                value: type,
                label: type,
              }
            })}
            onChange={(opt) => {
              this.setState({ type: opt })
            }}
          />
        </div>
        {this.renderImportView()}
      </div>
    )
  }
}
