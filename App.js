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
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Display from './src/components/Display';
import Buttons from './src/components/Buttons';
import colors from './src/utils/colors';

export default class App extends React.Component {
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
    };
  }

  resToState() {
    const date = new Date();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    let url;

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
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.fact}>
          <View style={[styles.resultCcontainer]}>
            {this.state.data ? (
              <Text style={[styles.random]}>{this.state.data.text}</Text>
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </View>
        {/* <FlatList
          data={this.state.dataSource}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={item => this.renderItem(item)}
          keyExtractor={item => item.id.toString()}
        /> */}
        <StatusBar barStyle="light-content" />
        <Display state={this.state} />
        <Buttons operation={this.handleOperation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: colors.darker,
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
    backgroundColor: 'white',
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
  },
});
