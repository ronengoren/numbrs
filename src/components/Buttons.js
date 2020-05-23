import React, {Component} from 'react';
import {View, SafeAreaView, Text, StyleSheet} from 'react-native';

import Button from './Button';
import colors from '../utils/colors';

class Buttons extends Component {
  operatorSelected = operation => {
    this.props.operation(operation);
  };

  render() {
    const numbers = [
      ['7', '8', '9'],
      ['4', '5', '6'],
      ['1', '2', '3'],
      ['0', '.', '='],
    ];
    const operations = ['C', '÷', '×', '-', '+'];
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.numbers}>
          {numbers.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map(char => (
                <Button
                  key={char}
                  char={char}
                  operation={this.operatorSelected}
                />
              ))}
            </View>
          ))}
        </SafeAreaView>
        <SafeAreaView style={styles.operations}>
          {operations.map(char => (
            <Button key={char} char={char} operation={this.operatorSelected} />
          ))}
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'row',
    borderTopWidth: 0.5,

    borderColor: '#000000',
    fontFamily: 'AvenirNext-Regular',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    fontFamily: 'AvenirNext-Regular',
  },
  numbers: {
    flex: 3,
    fontFamily: 'AvenirNext-Regular',
  },
  operations: {
    flex: 1,
    backgroundColor: '#fff',
    fontFamily: 'AvenirNext-Regular',
    borderLeftWidth: 0.5,
    borderColor: 'black',
  },
});

export default Buttons;
