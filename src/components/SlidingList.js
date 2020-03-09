import React, {Component} from 'react';
import {
  Animated,
  Button,
  Easing,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  AsyncStorage,
} from 'react-native';
import SortableList from 'react-native-sortable-list';

const window = Dimensions.get('window');

export default class SlidingList extends Component {
  state = {next: ['0', '1', '2']};

  onReorder(next) {
    this.setState({next});
    const anno = [];
    this.props.data.forEach(d => {
      anno.push(d.number);
    });
    // console.warn(next,anno)
  }

  onAnswer() {
    const anno = [];
    this.props.data.forEach(d => {
      anno.push(d.number);
    });
    const reOrderedYears = [];
    const {next} = this.state;
    next.forEach(n => {
      n = parseInt(n);
      reOrderedYears.push(anno[n]);
    });
    if (
      reOrderedYears[0] < reOrderedYears[1] &&
      reOrderedYears[1] < reOrderedYears[2]
    ) {
      const answer = 'Correct!!!';
      this.setState({answer});

      let score;
      _storeData = async () => {
        try {
          score = await AsyncStorage.getItem('score');
          if (score === null) {
            await AsyncStorage.setItem('score', '1');
            this.props.onScoreChange('1');
          } else {
            score = parseInt(score) + 1;
            this.props.onScoreChange(score.toString());
            await AsyncStorage.setItem('score', score.toString());
          }
        } catch (error) {
          console.log('error setting win');
        }
      };
      _storeData();
    } else {
      const answer = 'False';
      this.setState({answer});
      this.props.onScoreChange('0');
      try {
        AsyncStorage.setItem('score', '0');
      } catch (error) {
        console.log('error setting win');
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text>{AsyncStorage.getItem('score')}</Text> */}
        <SortableList
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          data={this.props.data}
          renderRow={this._renderRow}
          onChangeOrder={nextOrder => {
            this.onReorder(nextOrder);
          }}
        />
        <Text style={styles.answer}>{this.state.answer}</Text>
        <Button
          onPress={() => this.onAnswer()}
          style={styles.button}
          title="Submit Answer"
        />
      </View>
    );
  }

  _renderRow = ({data, active}) => {
    return <Row data={data} active={active} />;
  };
}

class Row extends Component {
  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [
            {
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            },
          ],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [
            {
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            },
          ],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      }),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  render() {
    const {data, active} = this.props;
    const {text, number} = data;
    const array = text.split('is the year that');
    const year = array[0];
    let newText = array[1].trim();

    if (newText.indexOf('(')) {
      newText = newText.split('(')[0];
    }
    newText = newText.charAt(0).toUpperCase() + newText.substr(1);

    return (
      <Animated.View style={[styles.row, this._style]}>
        <Text style={styles.text}>
          {newText}
          {number}
        </Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',

    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },

  button: {
    backgroundColor: 'white',
  },

  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: '#999999',
  },

  list: {
    flex: 1,
  },

  contentContainer: {
    width: window.width,

    ...Platform.select({
      ios: {
        paddingHorizontal: 30,
      },

      android: {
        paddingHorizontal: 0,
      },
    }),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    flex: 1,
    marginTop: 7,
    marginBottom: 12,
    borderRadius: 4,

    ...Platform.select({
      ios: {
        width: window.width - 30 * 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 2,
      },

      android: {
        width: window.width - 30 * 2,
        elevation: 0,
        marginHorizontal: 30,
      },
    }),
  },

  image: {
    width: 50,
    height: 50,
    marginRight: 30,
    borderRadius: 25,
  },

  text: {
    fontSize: 18,
    color: '#222222',
  },
});
