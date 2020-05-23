import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import CalculatorButton from './CalculatorButton';
import Colors from '../constants/Colors';

type Props = {
  handleButtonPress: string => any,
  reset: () => any,
  deleteLast: () => any,
  switchButton: () => any,
};

export default class CalculatorButtonsContainer extends Component<Props> {
  render() {
    const {handleButtonPress, reset, deleteLast, switchButton} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.switchButtonGroup}>
            <CalculatorButton operator={'<'} handleButtonPress={switchButton} />
          </View>

          <View style={styles.buttonGroup}>
            <View style={styles.row}>
              <CalculatorButton operator={'c'} handleButtonPress={reset} />
              <CalculatorButton
                operator={'('}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={')'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton operator={'←'} handleButtonPress={deleteLast} />
            </View>

            <View style={styles.row}>
              <CalculatorButton
                operator={'7'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'8'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'9'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'÷'}
                handleButtonPress={handleButtonPress}
              />
            </View>

            <View style={styles.row}>
              <CalculatorButton
                operator={'4'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'5'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'6'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'×'}
                handleButtonPress={handleButtonPress}
              />
            </View>

            <View style={styles.row}>
              <CalculatorButton
                operator={'1'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'2'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'3'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'−'}
                handleButtonPress={handleButtonPress}
              />
            </View>

            <View style={styles.row}>
              <CalculatorButton
                operator={'.'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'0'}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'='}
                handleButtonPress={handleButtonPress}
              />
              <CalculatorButton
                operator={'+'}
                handleButtonPress={handleButtonPress}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 0.5,

    borderColor: '#000000',
  },

  row: {
    flex: 2,
    flexDirection: 'row',
  },

  buttonGroup: {
    flex: 10,
  },

  switchButtonGroup: {
    flex: 1,
  },
});
