import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { colors } from 'theme'

export default class Button extends React.PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array
    ])
  }
  render() {
    const { children, style, ...props } = this.props
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={[styles.button, style]}
        {...props}>
        <View>
          <Text style={styles.buttonText}>{children}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 30,
    borderRadius: 5,
    height: 48,
    backgroundColor: colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 15,
    color: '#FFF',
    letterSpacing: 10
  }
})
