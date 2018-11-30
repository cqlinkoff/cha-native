import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors } from 'theme'

export default class Card extends React.PureComponent {
  static propTypes = View.PropTypes

  render() {
    const { children, style, ...props } = this.props
    return (
      <View style={[styles.card, style]} {...props}>
        {children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    backgroundColor: '#FFF',
    shadowRadius: 2,
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowColor: colors.shadowColor,
    elevation: 2,
    borderRadius: 4
  }
})
