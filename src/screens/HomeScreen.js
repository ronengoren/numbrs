import React from 'react';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Switch,
} from 'react-native';

import Display from '../../src/components/Display';
import Buttons from '../../src/components/Buttons';
import colors from '../../src/utils/colors';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: [],
      display: '',
      result: '',
      data: {},
      date: 9,
      month: 10,
      trivia: '',
      toggled: false,
    };
  }
  componentDidMount() {
    this.resToState();
    this.getTrivia(22);
  }
  getTrivia = async number => {
    const response = await fetch(
      `http://numbersapi.com/${number}/trivia?fragment`,
    );
    const data = await response._bodyText;
    this.setState({trivia: data});
    console.log(this.trivia);
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

  showNumber(str) {
    console.log(str);
  }
  handleOperation = operation => {
    if (operation === 'C') {
      this.setState({
        display: '',
        result: '',
      });
    } else if (operation === '=') {
      this.setState({
        display: this.state.result,
        result: '',
      });
    } else {
      const display = this.state.display + operation;
      let result = this.state.result;
      try {
        let fixedOperation = display.split('×').join('*');
        fixedOperation = fixedOperation.split('÷').join('/');
        fixedOperation = fixedOperation.split(',').join('.');

        result = new String(eval(fixedOperation)).toString();
      } catch (e) {}
      this.setState({
        display,
        result,
      });
    }
  };
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />
    );
  };
  renderItem = data => (
    <TouchableOpacity style={styles.list}>
      {/* <Text style={styles.lightText}>{data.item.name}</Text>
      <Text style={styles.lightText}>{data.item.email}</Text>
      <Text style={styles.lightText}>{data.item.company.name}</Text> */}
    </TouchableOpacity>
  );

  render() {
    const {toggled} = this.state;
    const themetext = {
      color: toggled ? '#F5FCFF' : '#114511',
    };
    const themebg = {
      backgroundColor: toggled ? '#114511' : '#F5FCFF',
    };
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Image
          source={
            toggled
              ? require('../../assets/nmbrs-logo-white.png')
              : require('../../assets/nmbrs-logo.png')
          }
          style={styles.logo}
        />
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('RandomFact', {
              toggled: this.state.toggled,
            });
          }}>
          <Text style={[styles.text, themetext]}>Random Text</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('FavNumber');
          }}>
          <Text style={[styles.text, themetext]}>Favorite Number</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Quiz', {
              toggled: this.state.toggled,
            });
          }}>
          <Text style={[styles.text, themetext]}>History Quiz</Text>
        </TouchableOpacity>
        <Switch
          trackColor={{false: '#114511', true: '#F5FCFF'}}
          onValueChange={value => this.setState({toggled: value})}
          value={this.state.toggled}
        />
        {/* <View style={styles.fact}>
          <View style={[styles.resultCcontainer]}>
            {this.state.data ? (
              <Text style={[styles.random]}>{this.state.data.text}</Text>
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </View>

        <StatusBar barStyle="light-content" />
        <Display state={this.state} />
        <Buttons operation={this.handleOperation} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //calc
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'stretch',
    // backgroundColor: '#71541e',
    //numbers
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fact: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 0.5,
    height: '20%',
    width: '100%',
    backgroundColor: '#03313e',
    color: '#1ad09a',
  },
  list: {
    paddingVertical: 4,
    margin: 5,
    backgroundColor: '#fff',
  },
  random: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop: 25,
    color: '#bf5d27',
  },
  logo: {
    height: 135,
    width: 166,
    marginTop: 20,
    marginBottom: 20,
  },
  text: {
    alignSelf: 'stretch',
    fontSize: 30,
    textAlign: 'left',
    marginBottom: 20,
  },
});
