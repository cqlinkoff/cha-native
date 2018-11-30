import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, InteractionManager } from 'react-native'
import Radio from '../radio'

export default class RadioGroup extends React.PureComponent {
  static propTypes = {
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      })
    ),
    vertical: PropTypes.bool,
    style: PropTypes.any
  }

  constructor(props) {
    super(props)

    const { defaultValue } = props

    this.state = {
      value: defaultValue
    }
  }

  handleRadioCheck = (value, checked) => {
    if (checked) {
      this.setState({
        value
      })

      InteractionManager.runAfterInteractions(() => {
        this.props.onChange(value)
      })
    }
  }

  render() {
    const { options = [], vertical = false, style } = this.props
    const { value } = this.state
    return (
      <View
        style={[
          styles.radioGroup,
          {
            flexDirection: vertical ? 'column' : 'row'
          },
          style
        ]}>
        {options.map(({ value: key, label }, index) => (
          <View
            key={key}
            style={{
              marginRight: vertical || index === options.length ? 0 : 14,
              marginBottom: !vertical || index === options.length ? 0 : 14
            }}>
            <Radio
              label={label}
              checked={value === key}
              onChange={checked => this.handleRadioCheck(key, checked)}
            />
          </View>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  radioGroup: {}
})
