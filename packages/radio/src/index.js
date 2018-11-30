import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import { colors } from 'theme'

const { View: AnimatedView } = Animated

export default class Radio extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
  }

  static getDerivedStateFromProps(props, state) {
    return {
      checked: !!props.checked
    }
  }

  constructor(props) {
    super(props)

    const { checked } = props

    this.state = {
      checked,
      animation: new Animated.Value(checked ? 1 : 0)
    }
  }

  componentDidUpdate() {
    const { checked, animation } = this.state

    Animated.timing(animation, {
      toValue: checked ? 1 : 0,
      duration: 150
    }).start()
  }

  toggleRadio = () => {
    const { checked } = this.state
    // this.setState({
    //   checked: !checked
    // })
    this.props.onChange(!checked)
  }

  render() {
    const { label } = this.props
    const { animation } = this.state
    const innerSize = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8]
    })

    const radius = Animated.divide(innerSize, 2)
    return (
      <TouchableWithoutFeedback onPress={this.toggleRadio}>
        <View style={styles.radio}>
          <View style={styles.radioIcon}>
            <AnimatedView
              style={[
                styles.radioInnerIcon,
                {
                  width: innerSize,
                  height: innerSize,
                  borderRadius: radius,
                  opacity: animation
                }
              ]}
            />
          </View>
          <Text style={styles.radioLabel}>{label}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  radio: {
    flexDirection: 'row'
  },
  radioIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: colors.radioColor,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioInnerIcon: {
    backgroundColor: colors.radioColor
  },
  radioLabel: {
    fontSize: 14,
    color: colors.textColor,
    marginLeft: 5
  }
})
