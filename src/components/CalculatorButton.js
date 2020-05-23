import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';
import Constants from '../constants/Constants';

type Props = {
  operator: string,
  handleButtonPress: string => any,
};

class CalculatorButton extends Component<Props> {
  render() {
    const {operator, handleButtonPress} = this.props;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => handleButtonPress(operator)}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.item}>
          {operator}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.BLACK,
    margin: 1,
  },
  item: {
    color: Colors.BLACK,
    fontSize: 20 * (Constants.maxDimension / Constants.baseMaxDimension),
    fontFamily: 'AvenirNext-Regular',
  },
});

export default CalculatorButton;
