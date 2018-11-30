import React from 'react'
import PropTypes from 'prop-types'
import {
  // View,
  // Text,
  Modal,
  Animated,
  // Platform,
  StyleSheet,
  Dimensions,
  // TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native'

const { View: AnimatedView } = Animated
const { width } = Dimensions.get('window')

export default class MaskModal extends React.PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    maskCloseable: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.element
  }

  static defaultProps = {
    maskCloseable: true
  }

  constructor(props) {
    super(props)

    this.state = {
      animation: new Animated.Value(0),
      visible: false
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
        Animated.timing(this.state.animation, {
          toValue: 1,
          duration: 150
        }).start()
      }
    )
  }

  handleMaskPress = () => {
    if (this.props.maskCloseable) {
      this.handleClose()
    }
  }

  handleClose = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 150
    }).start(() => {
      this.setState({
        visible: false
      })
      this.props.onClose()
    })
  }

  render() {
    const { visible, animation } = this.state
    const { children } = this.props
    return (
      <Modal
        transparent
        visible={visible}
        hardwareAccelerated
        onRequestClose={this.handleClose}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          enabled
          contentContainerStyle={styles.avoidView}>
          <TouchableWithoutFeedback onPress={this.handleMaskPress}>
            <AnimatedView
              style={[
                styles.container,
                {
                  opacity: animation
                }
              ]}>
              <AnimatedView
                style={[
                  styles.modal,
                  {
                    transform: [
                      {
                        scaleX: animation
                      },
                      {
                        scaleY: animation
                      }
                    ]
                  }
                ]}>
                <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
              </AnimatedView>
            </AnimatedView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    width: width - 2 * 16,
    borderRadius: 5
  }
})
