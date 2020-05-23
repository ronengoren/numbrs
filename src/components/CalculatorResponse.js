import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Alert,
  Clipboard,
  Dimensions,
} from 'react-native';
import Colors from '../constants/Colors';
import Constants from '../constants/Constants';
import {isNumeric} from '../utils/Utils';
import {OrientationType} from '../utils/Orientation';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import ExamplePicker from '../screens/animations/ExamplePicker';

const eqwlIcon = require('../../assets/icon.png');
const makeExample = (name, getJson, width) => ({name, getJson, width});

const EXAMPLES = [
  makeExample(
    'Hamburger Arrow',
    () => require('../screens/animations/HamburgerArrow.json'),
    makeExample(
      'Hamburger Arrow (200 px)',
      () => require('../screens/animations/HamburgerArrow.json'),
      200,
    ),
  ),
];

type Props = {
  topDisplay: string,
  bottomDisplay: string,
  orientation: number,
};
class CalculatorResponse extends Component<Props> {
  topDisplayScroll: ScrollView;
  bottomDisplayScroll: ScrollView;

  render() {
    const {bottomDisplay, topDisplay, orientation} = this.props;
    const h = Constants.height;
    const w = Constants.width;
    return (
      <SafeAreaView style={styles.resultsContainer}>
        <ScrollView
          style={styles.resultContainer}
          ref={scroll => {
            this.topDisplayScroll = scroll;
          }}
          onContentSizeChange={() => {
            this.topDisplayScroll.scrollToEnd(false);
          }}
          horizontal>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.topDisplay}>
            {topDisplay}
          </Text>
        </ScrollView>
        <ScrollView
          style={styles.resultContainer}
          ref={scroll => {
            this.bottomDisplayScroll = scroll;
          }}
          horizontal>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.topDisplay, styles.bottomDisplay]}>
            {bottomDisplay}
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  resultsContainer: {
    backgroundColor: '#fff',
    flex: 0.5,
    justifyContent: 'space-around',
    paddingHorizontal: 0,
    // backgroundColor: Colors.BLACK,
    alignItems: 'center',
    // margin: 20,
    // flexDirection: 'column',
  },

  resultContainer: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },

  topDisplay: {
    color: Colors.BLACK,
    fontSize: 40 * (Constants.maxDimension / Constants.baseMaxDimension),
    textAlignVertical: 'center',
    margin: 5,
    fontFamily: 'AvenirNext-Regular',
  },

  bottomDisplay: {
    fontSize: 30 * (Constants.maxDimension / Constants.baseMaxDimension),
    fontFamily: 'AvenirNext-Regular',
  },
});

export default CalculatorResponse;
