import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Easing,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import Card from '../card'
import { colors } from 'theme'

const { View: AnimatedView, Image: AnimatedImage } = Animated

const TITLE_HEIGHT = 46

export default class CollapsibleCard extends React.PureComponent {
  static titleHeight = TITLE_HEIGHT

  static propTypes = {
    title: PropTypes.string,
    titleStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array
    ]),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    animationDuration: PropTypes.number,
    defaultCollapsible: PropTypes.bool
  }

  constructor(props) {
    super(props)

    const { defaultCollapsible = false } = props

    this.state = {
      height: TITLE_HEIGHT,
      collapsible: !!defaultCollapsible,
      animation: new Animated.Value(defaultCollapsible ? 0 : 1)
    }
  }

  toggleCollapsible = () => {
    const { collapsible, animation } = this.state

    const { animationDuration: duration = 150 } = this.props

    Animated.timing(animation, {
      toValue: collapsible ? 1 : 0,
      duration,
      easing: Easing.linear
    }).start()
    this.setState({
      collapsible: !collapsible
    })
  }

  handleContentLayoutChange = ({ nativeEvent }) => {
    const { layout } = nativeEvent
    const { height } = layout

    if (this.contentHeight !== height) {
      this.contentHeight = height
      const fullHeight = this.contentHeight + TITLE_HEIGHT
      this.setState({
        height: fullHeight
      })
    }
  }

  render() {
    const {
      title,
      titleStyle,
      children,
      defaultCollapsible,
      ...otherProps
    } = this.props
    const { animation, height: fullHeight } = this.state
    const rotateZ = animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['90deg', '0deg']
    })
    const height = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [fullHeight, TITLE_HEIGHT]
    })
    return (
      <Card {...otherProps}>
        <AnimatedView
          style={[
            styles.animatedView,
            {
              height:
                defaultCollapsible && !this.contentHeight ? undefined : height
            }
          ]}>
          <TouchableWithoutFeedback onPress={this.toggleCollapsible}>
            <View style={styles.titleView}>
              <Text style={[styles.title, titleStyle]}>{title}</Text>
              <AnimatedImage
                style={[
                  styles.collapsibleIcon,
                  {
                    transform: [
                      {
                        rotateZ
                      }
                    ]
                  }
                ]}
                source={require('assets/arrow_right.png')}
              />
            </View>
          </TouchableWithoutFeedback>
          <View onLayout={this.handleContentLayoutChange}>{children}</View>
        </AnimatedView>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  animatedView: {
    overflow: 'hidden'
  },
  titleView: {
    height: TITLE_HEIGHT,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    color: colors.titleColor,
    fontSize: 16
  },
  collapsibleIcon: {
    width: 9,
    height: 16
  }
})
