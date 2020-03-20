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
  static navigationOptions = {
    title: 'History Quiz',
  };

  state = {
    data: [],
    date: 9,
    month: 10,
    score: '',
  };

  setScore = score => {
    this.setState({score});
    this.setState({data: []});
    this.resToState();
  };

  resToState() {
    this.set;
    const url = `http://numbersapi.com/random/year?json`;
    let i = 3;

    while (i) {
      if (url) {
        fetch(url)
          .then(response => response.json())
          .catch(err => console.warn('fetch error' + err))
          .then(json => {
            this.setState(prev => {
              const data = prev.data.concat(json);
              return {
                data: data,
                date: this.state.date,
                month: this.state.month,
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

  renderQuestion({item}) {
    const {text} = item;
    const array = text.split('is the year that');
    const year = array[0];
    let newText = array[1].trim();

    if (newText.indexOf('(')) {
      newText = newText.split('(')[0];
    }
    newText = newText.charAt(0).toUpperCase() + newText.substr(1);

    return <Text style={styles.slider}>{newText}</Text>;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>
            Organize three world events in the right order
          </Text>
          <Text style={styles.text}>{this.state.score}</Text>
        </View>
        {this.state.data ? (
          <View style={styles.questions}>
            <SlidingList data={this.state.data} onScoreChange={this.setScore} />
          </View>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
  },
  questions: {
    backgroundColor: '#F5FCFF',
    flex: 5,
  },
  footer: {
    flex: 1,
  },
  slider: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    fontSize: 20,
    textAlign: 'center',
    borderRadius: 5,
    borderColor: 'lightgrey',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#ff0000',
    color: 'black',
  },
});
