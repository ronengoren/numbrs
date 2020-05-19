import React, {Component} from 'react';
import {View, SafeAreaView, Text, StyleSheet} from 'react-native';
import colors from '../utils/colors';

const Display = ({state}) => (
  <View style={styles.container}>
    <SafeAreaView style={styles.safe}>
      <Text style={styles.display} adjustsFontSizeToFit numberOfLines={1}>
        {state.display}
      </Text>
      {/* {state.result !== '' && (
        <Text style={styles.result} adjustsFontSizeToFit numberOfLines={1}>
          {state.result}
        </Text>
      )} */}
    </SafeAreaView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 0.5,
    justifyContent: 'space-around',
    paddingHorizontal: 0,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-around',
  },
  display: {
    textAlign: 'center',
    // fontWeight: '400',
    color: '#000000',
    fontSize: 40,
    fontFamily: 'AvenirNext-Regular',
  },
  result: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 30,
    fontFamily: 'AvenirNext-Regular',
  },
});

export default Display;
