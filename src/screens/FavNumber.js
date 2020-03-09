import React, {Component} from 'react';
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Favnumber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trivia: '',
    };

    this.inputText = '';
  }

  componentDidMount() {
    this.getData();
  }

  getTrivia = async number => {
    const response = await fetch(
      `http://numbersapi.com/${number}/trivia?fragment`,
    );
    const data = await response._bodyText;
    this.setState({trivia: data});
  };

  getData = async () => {
    try {
      this.inputText = await AsyncStorage.getItem('favNumber');
      this.getTrivia(this.inputText);
    } catch (error) {
      // error
    }
  };

  storeData = async () => {
    try {
      await AsyncStorage.setItem('favNumber', this.inputText);
    } catch (error) {
      // Error saving data
    }
  };

  onChangeInput = number => {
    this.inputText = number;
  };

  onPress = () => {
    const number = this.inputText;
    if (!number || isNaN(number)) return;
    this.getTrivia(number);
    this.storeData();
    this.setState({favNumber: true});
  };

  render() {
    // const toggled = this.props.navigation.getParam('toggled');
    const themetext = {
      color: '#114511',
    };
    const themeborder = {
      borderBottomColor: '#114511',
    };
    const themebg = {
      backgroundColor: '#F5FCFF',
    };
    const themebutton = {
      backgroundColor: '#fff',
      color: '#fff',
    };
    return (
      <View style={[styles.container, themebg]}>
        <View style={styles.favnum}>
          {this.inputText ? (
            <Text style={[styles.text, themetext]}>
              Your favorite number is {this.inputText}
            </Text>
          ) : (
            <Text style={[styles.text, themetext]}>
              Set your favorite number
            </Text>
          )}
        </View>
        <View style={[styles.inputContainer, themebg]}>
          <TextInput
            onChangeText={this.onChangeInput}
            placeholder="put a number"
            style={[styles.input, themeborder, themetext]}
          />
          <TouchableHighlight onPress={this.onPress} style={[styles.button]}>
            <Text style={[styles.button]}>SAVE</Text>
          </TouchableHighlight>
        </View>

        {this.state.trivia ? (
          <View style={styles.info}>
            <Text style={[styles.number, themetext]}>{this.inputText}</Text>
            <Text style={[styles.text, themetext]} numberOfLines={5}>
              {this.state.trivia}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F5FCFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  favnum: {
    width: 300,
    height: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 30,
    alignSelf: 'center',
  },
  info: {
    width: 300,
    height: 300,
  },
  input: {
    width: 100,
    borderBottomWidth: 1,
    padding: 5,
    marginRight: 20,
  },
  text: {
    fontSize: 20,
  },
  button: {
    borderRadius: 5,
    padding: 5,
  },
});
