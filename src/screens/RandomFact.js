import React, {Component} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';

class RandomFact extends Component {
  static navigationOptions = {
    title: 'Fact Of The Day',
  };
  state = {
    data: {},
    date: 9,
    month: 10,
  };

  resToState() {
    const date = new Date();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    let url;
    let triviaNumberUrl;
    url = `http://numbersapi.com/${month}/${day}/date?json`;
    if (url) {
      fetch(url)
        .then(response => response.json())

        .catch(err => console.warn('fetch error' + err))
        .then(json => {
          this.setState({data: json});
        })
        .catch(err => console.warn('json not loaded' + err));
    }
  }

  componentDidMount() {
    this.resToState();
  }

  render() {
    // const toggled = this.props.navigation.getParam('toggled');

    const themetext = {
      color: '#F5FCFF',
    };
    const themebg = {
      backgroundColor: '#F5FCFF',
    };
    return (
      <View style={[styles.container]}>
        {this.state.data ? (
          <Text style={[styles.random]}>{this.state.data.text}</Text>
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
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  random: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default RandomFact;
