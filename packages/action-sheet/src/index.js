import React from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import Popup from '../popup'
import Button from '../button'
import { colors } from 'theme'
import __ from 'utils/i18n'

const { height: windowHeight } = Dimensions.get('window')

export default class ActionSheet extends React.PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
        value: PropTypes.string
      })
    ),
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string
  }

  static defaultProps = {
    onClose: () => {}
  }

  handleOptionPress = value => {
    this.props.onClose(value)
  }

  renderOptionLabel = item => {
    const { label, render } = item
    if (typeof render === 'function') {
      return render(item)
    } else if (typeof label === 'string') {
      return (
        <View style={styles.optionItem}>
          <Text style={styles.optionLabel}>{label}</Text>
        </View>
      )
    } else {
      return <View style={styles.optionItem}>{label}</View>
    }
  }

  renderItem = item => {
    const { value } = item
    return (
      <TouchableOpacity
        key={value}
        activeOpacity={0.6}
        onPress={() => this.handleOptionPress(value)}>
        {this.renderOptionLabel(item)}
      </TouchableOpacity>
    )
  }

  render() {
    const { visible, options, title } = this.props
    return (
      <Popup visible={visible} onClose={this.handleOptionPress}>
        <View style={styles.optionView}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <ScrollView style={styles.optionList} alwaysBounceVertical={false}>
            {options.map(this.renderItem)}
          </ScrollView>
          <Button
            style={styles.cancelBtn}
            onPress={() => this.handleOptionPress()}>
            {__('取消')}
          </Button>
        </View>
      </Popup>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.textColor
  },
  optionView: {
    paddingTop: 16,
    height: windowHeight * 0.4 + 2 * 16
  },
  optionList: {
    flex: 1,
    marginHorizontal: 16
  },
  optionItem: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderColor
  },
  optionLabel: {
    fontSize: 16,
    color: colors.textColor,
    textAlign: 'center'
  },
  cancelBtn: {
    marginVertical: 30
  }
})
