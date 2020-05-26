import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import SlidingList from '../components/SlidingList';

export default class Quiz extends Component {
  state = {
    data: [],
    date: 9,
    month: 10,
    score: '',
  };

  resToState() {
    // this.set;
    const url = `http://numbersapi.com/random/trivia?json`;
    let i = 3;

    while (i) {
      if (url) {
        fetch(url)
          .then(response => response.json())
          .catch(err => console.warn('fetch error' + err))
          .then(json => {
            console.log(json);

            this.setState(prev => {
              const data = prev.data.concat(json);
              return {
                data: data,
              };
            });
          })
          .catch(err => console.warn('json not loaded' + err));
      }
      i--;
    }
  }

  componentDidMount() {
    this.resToState();
  }

  // renderQuestion({item}) {
  //   const {text} = item;
  //   const array = text.split('is the year that');
  //   const year = array[0];
  //   let newText = array[1].trim();

  //   if (newText.indexOf('(')) {
  //     newText = newText.split('(')[0];
  //   }
  //   newText = newText.charAt(0).toUpperCase() + newText.substr(1);

  //   return <Text style={styles.slider}>{newText}</Text>;
  // }

  render() {
    return (
      <View>
        {/* <View style={styles.header}>
          <Text style={styles.text}>
            Organize three world events in the right order
          </Text>
          <Text style={styles.text}>{this.state.score}</Text>
        </View> */}
        {this.state.data ? (
          <SlidingList data={this.state.data} />
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'white',
    // backgroundColor: 'black',

    justifyContent: 'space-between',
    alignItems: 'center',
    // alignContent: 'center',

    // flexDirection: 'column',
    // margin: 5,
  },
  // header: {
  //   flex: 1,
  // },
  questions: {
    // backgroundColor: '#fff',
    // flex: 5,
  },
  footer: {
    // flex: 1,
  },
  slider: {
    // paddingLeft: 10,
    // paddingRight: 10,
    // backgroundColor: 'yellow',
    // fontSize: 20,
    // textAlign: 'center',
    // borderRadius: 5,
    // borderColor: 'lightgrey',
    // borderStyle: 'solid',
    // borderWidth: 2,
  },
  text: {
    // fontSize: 20,
    // textAlign: 'center',
    // margin: 10,
  },
  button: {
    // backgroundColor: '#fff',
    // color: 'black',
  },
});
