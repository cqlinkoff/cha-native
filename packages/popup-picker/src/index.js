import React from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  ViewPropTypes,
  TouchableWithoutFeedback
} from 'react-native'
import PropTypes from 'prop-types'
import Popup from '../popup'
import Button from '../button'
import icon from 'assets/arrow_down.png'
import selectedIcon from 'assets/selected.png'
import { colors } from 'theme'
import __ from 'utils/i18n'

const { height: windowHeight } = Dimensions.get('window')

export default class PopupPicker extends React.PureComponent {
  static propTypes = {
    ...ViewPropTypes,
    icon: PropTypes.number,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
        value: PropTypes.string
      })
    ),
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    onValueChange: PropTypes.func,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    icon,
    disabled: false,
    onValueChange: () => {}
  }

  constructor(props) {
    super(props)

    const { defaultValue } = props

    this.state = {
      value: defaultValue,
      showPicker: false
    }

    this.value = defaultValue
  }

  findOptionByValue = val => {
    const { options = [] } = this.props
    const option = options.find(({ value }) => val === value)
    return option || {}
  }

  showPicker = () => {
    this.setState({
      showPicker: true
    })
  }

  handleConfirm = () => {
    if (this.state.value !== this.value) {
      this.value = this.state.value
      this.props.onValueChange(this.state.value)
    }
    this.setState({
      showPicker: false
    })
  }

  handleCancel = () => {
    this.setState({
      value: this.value,
      showPicker: false
    })
  }

  handleOptionPress = value => {
    this.setState({
      value
    })
  }

  renderOptionLabel = item => {
    const val = this.state.value
    const { value, label, render } = item
    if (typeof render === 'function') {
      return render(item, val)
    } else if (typeof label === 'string') {
      return (
        <View style={styles.optionItem}>
          <Text
            style={[
              styles.optionLabel,
              val === value && styles.selectedOptionLabel
            ]}>
            {label}
          </Text>
          {val === value && (
            <Image style={styles.selectedIcon} source={selectedIcon} />
          )}
        </View>
      )
    } else {
      return (
        <View style={styles.optionItem}>
          {label}
          {val === value && (
            <Image style={styles.selectedIcon} source={selectedIcon} />
          )}
        </View>
      )
    }
  }

  renderSelectedLabel = ({ label, value, render }) => {
    if (typeof render === 'function') {
      return render({ label, value }, value, true)
    } else if (typeof label === 'string' || !label) {
      return (
        <Text style={styles.selectedLabel}>
          {label || this.props.placeholder}
        </Text>
      )
    } else {
      return label
    }
  }

  renderItem = item => {
    const { value } = item
    return (
      <TouchableWithoutFeedback
        key={value}
        activeOpacity={0.6}
        onPress={() => this.handleOptionPress(value)}>
        {this.renderOptionLabel(item)}
      </TouchableWithoutFeedback>
    )
  }

  render() {
    const { icon, options, disabled, style } = this.props
    const { showPicker } = this.state
    const option = this.findOptionByValue(this.value)
    return (
      <View style={[styles.pickerView, style]}>
        <TouchableWithoutFeedback
          activeOpacity={disabled ? 1 : 0.6}
          onPress={disabled ? null : this.showPicker}>
          <View style={styles.labelView}>
            {this.renderSelectedLabel(option)}
            {!disabled && <Image style={styles.pickerIcon} source={icon} />}
          </View>
        </TouchableWithoutFeedback>
        <Popup visible={showPicker} onClose={this.handleCancel}>
          <View>
            <View style={styles.optionView}>
              <ScrollView
                style={styles.optionList}
                alwaysBounceVertical={false}>
                {options.map(this.renderItem)}
              </ScrollView>
            </View>
            <View style={styles.confirmBtn}>
              <Button onPress={this.handleConfirm}>
                <Text style={styles.confirmBtnText}>{__('确定')}</Text>
              </Button>
            </View>
          </View>
        </Popup>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pickerView: {},
  labelView: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedLabel: {
    fontSize: 12,
    color: '#626262'
  },
  pickerIcon: {
    marginLeft: 14
  },
  optionView: {
    padding: 16,
    paddingRight: 0,
    height: windowHeight * 0.4
  },
  optionList: {
    flex: 1
  },
  optionItem: {
    height: 64,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderColor
  },
  optionLabel: {
    fontSize: 16,
    color: colors.textColor
  },
  selectedOptionLabel: {
    color: colors.primaryColor
  },
  selectedIcon: {
    width: 16,
    height: 16
  },
  confirmBtn: {
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '25%',
    marginVertical: 30
  },
  confirmBtnText: {
    color: colors.primaryColor
  }
})
