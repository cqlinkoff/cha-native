import React from 'react'
import PropTypes from 'prop-types'
import {
  // View,
  // Text,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
  // TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native'

const { View: AnimatedView } = Animated
const { width } = Dimensions.get('window')

export default class Popup extends React.PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    animated: PropTypes.bool,
    maskCloseable: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.element,
    height: PropTypes.number
  }

  static defaultProps = {
    maskCloseable: true,
    animated: true
  }

  constructor(props) {
    super(props)

    this.state = {
      animation: new Animated.Value(0),
      visible: false,
      height: 0
    }
  }

  componentDidMount() {
    const { visible } = this.props
    if (visible) {
      this.showModal()
    }
  }

  componentDidUpdate() {
    const { visible } = this.props

    if (visible !== this.state.visible) {
      if (visible) {
        this.showModal()
      } else {
        this.handleClose()
      }
    }
  }

  showModal = () => {
    this.setState(
      {
        visible: true
      },
      () => {
        if (this.props.animated) {
          Animated.timing(this.state.animation, {
            toValue: 1,
            duration: 150
          }).start()
        } else {
          this.state.animation.setValue(1)
        }
      }
    )
  }

  handleMaskPress = () => {
    if (this.props.maskCloseable) {
      this.handleClose()
    }
  }

  handleClose = () => {
    if (this.props.animated) {
      Animated.timing(this.state.animation, {
        toValue: 0,
        duration: 150
      }).start(() => {
        this.setState({
          visible: false
        })
        this.props.onClose()
      })
    } else {
      this.state.animation.setValue(0)
      this.setState({
        visible: false
      })
      this.props.onClose()
    }
  }

  render() {
    const { visible, animation } = this.state
    const { children, height = 200 } = this.props
    const y = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0]
    })
    return (
      <Modal
        transparent
        visible={visible}
        hardwareAccelerated
        onRequestClose={this.handleClose}>
        <TouchableWithoutFeedback onPress={this.handleMaskPress}>
          <AnimatedView
            style={[
              styles.container,
              {
                opacity: animation
              }
            ]}>
            <KeyboardAvoidingView
              behavior={'padding'}
              contentContainerStyle={styles.avoidView}
              enabled>
              <AnimatedView
                style={[
                  styles.content,
                  {
                    transform: [
                      {
                        translateY: y
                      }
                    ]
                  }
                ]}>
                <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
              </AnimatedView>
            </KeyboardAvoidingView>
          </AnimatedView>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  avoidView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  content: {
    backgroundColor: '#fff',
    width
  }
})
