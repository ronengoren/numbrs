import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Alert,
  Clipboard,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Button,
} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import ExamplePicker from '../screens/animations/ExamplePicker';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  useNavigationState,
  CommonActions,
} from '@react-navigation/native';
import {Orientation, OrientationType} from '../utils/Orientation';
import CalculatorResponse from '../components/CalculatorResponse';
import CalculatorBrain from '../core/CalculatorBrain';
import Colors from '../constants/Colors';
import Constants from '../constants/Constants';
import LayoutBuilder from '../utils/LayoutBuilder';
import {isNumeric} from '../utils/Utils';
import Quiz from './Quiz';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationEvents} from 'react-navigation';

import Toast, {DURATION} from 'react-native-easy-toast';
const DeviceWidth = Dimensions.get('window').width;

const eqwlIcon = require('../../assets/icon.png');
const makeExample = (name, getJson, width) => ({name, getJson, width});

const EXAMPLES = [
  makeExample(
    'Hamburger Arrow',
    () => require('../screens/animations/HamburgerArrow.json'),
    makeExample(
      'Hamburger Arrow (200 px)',
      () => require('../screens/animations/HamburgerArrow.json'),
      200,
    ),
  ),
];
type Props = {
  brain: CalculatorBrain,
};

type State = {
  topDisplay: string,
  bottomDisplay: string,
  altButtons: boolean,
  orientation: number,
};

export default class Home extends React.Component {
  static defaultProps = {
    brain: new CalculatorBrain(),
  };

  constructor(props) {
    super(props);
    ((this.array = []), (this.numberEqwl = [])),
      (this.state = {
        display: '',
        // data: [],
        date: '',
        month: '',
        trivia: '',
        loader: false,
        dateData: {},
        quizeData: [],
        quize4Data: false,
        numberEqwl: [],
        modalVisible: false,
        quizeModalVisible: false,
        eqwlButton: 0,
        score: '',
      });
    state = {
      example: EXAMPLES[0],
      duration: 3000,
      isPlaying: true,
      isInverse: false,
      loop: false,
      topDisplay: ' ',
      bottomDisplay: ' ',
      altButtons: false,
      orientation: OrientationType.Portrait,
      answer: [],
      score: '',
    };
  }

  componentDidMount() {
    this._updateOrientation();
    this.getData();
    // this.willFocusSubscription = this.props.navigation.addListener(
    //   'willFocus',
    //   () => {
    //     this.getData();
    //   },
    // );
    // console.log(this.props.navigation.state);

    // this.resToState();

    // this.randomNumber();
  }
  UNSAFE_componentWillReceiveProps() {
    this.getData();

    // console.log(this);
  }
  // componentWillUnmount() {
  //   this.willFocusSubscription.remove();
  // }
  _updateOrientation() {
    const orientation = Orientation.getOrientation();
    this.setState({
      orientation: orientation,
    });
  }

  _orientationDidChange() {
    this._updateOrientation();
  }

  _reset() {
    this.setState({dateData: []});
    // console.log(this.state);

    this.props.brain.clear();
    // this.state.dateData.splice(0, this.array.length);
    // console.log(this.state.dateData);
    // const emptyArray = {};
    // this.state.dateData.push(emptyArray);
    // console.log(this.state.dateData);

    this.updateDisplay();
    this.setState({
      loader: false,
      trivia: '',
      topDisplay: null,
    });
  }

  _handleCopyPress() {
    const bottomDisplay: string = this.props.brain
      .getResult()
      .replace(' ', '')
      .replace(',', '');
    const topDisplay: string = this.props.brain
      .getDisplay()
      .replace(' ', '')
      .replace(',', '');
    const saveString = isNumeric(bottomDisplay)
      ? bottomDisplay
      : isNumeric(topDisplay)
      ? topDisplay
      : null;

    if (saveString) {
      Clipboard.setString(saveString);
      this.refs.toast.show(
        'Copied ' + saveString + ' to clipboard',
        DURATION.LENGTH_SHORT,
        () => {},
      );
    } else {
      this.refs.toast.show(
        'Unable to copy to clipboard',
        DURATION.LENGTH_SHORT,
        () => {},
      );
    }
  }

  async _handlePastePress() {
    const value = await Clipboard.getString();

    if (isNumeric(value)) {
      this.props.brain.clear();
      this.props.brain.setItem(value);
      this.updateDisplay();
    } else {
      this.refs.toast.show('Invalid clipboard value of ' + value);
    }
  }

  _handleButtonPress(button: string) {
    this.props.brain.setItem(button);

    this.updateDisplay(button);
  }
  _deleteLast() {
    this.props.brain.deleteLast();
    this.updateDisplay();
  }
  _switchButtons() {
    this.setState({altButtons: !this.state.altButtons});
  }
  updateDisplay(button) {
    const {navigation} = this.props;

    const newTopDisplay = this.props.brain.getDisplay();
    const newBottomDisplay = this.props.brain.getResult();
    // console.log(button);

    if (button === '=') {
      if (this.state.eqwlButton == 0) {
        // console.log(this.array);

        this.randomNumber();
        this.setState({
          eqwlButton: this.state.eqwlButton + 1,
        });
        // console.log('first click');
        // console.log(this.state.eqwlButton);
      } else if (this.state.eqwlButton == 1) {
        // this.array = [];

        const round = Math.round(newTopDisplay);

        this.array.push(round);
        this.numberEqwl.push(round);
        // const answerEqwdl = this.props.route.params.answerEqwl;

        // console.log(this.numberEqwl);
        this.checkAnswer(this.array);
        this.setState({
          loader: false,
          numberEqwl: round,
          eqwlButton: 0,
        });
      }
    } else if (button === undefined) {
      // this.forceRemount(this.array);

      // console.log(this.state);
      this.randomNumber();

      // this.array = [];
      // console.log(this.array);
    }

    this.setState({
      topDisplay: newTopDisplay,
      bottomDisplay: newBottomDisplay,
    });
  }
  getTrivia = async number => {
    // console.log(number);

    const {navigation} = this.props;

    const round = Math.round(number);
    const response = await fetch(`http://numbersapi.com/${round}/trivia?json`);

    const data = await response.text();

    if (response.status !== 200) {
      this.setState({trivia: 'We couldn’t find a fact for this number YET :('});
    } else {
      // this.array.push(data);
      // console.log(this.array);

      // navigation.navigate('Quiz', {
      //   data: data,
      // });
      // console.log(data);

      this.setState({trivia: data, quize4Data: true});
    }
    // console.log(data);
  };

  resToState() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getUTCMonth() + 1;
    let url;
    let triviaNumberUrl;
    url = `http://numbersapi.com/${month}/${day}/date?json`;
    if (url) {
      fetch(url)
        .then(response => response.json())
        .catch(err => console.warn('fetch error' + err))
        .then(json => {
          this.setState({dateData: json, date: date});
          // console.log(json);
        })
        .catch(err => console.warn('json not loaded' + err));
    }
  }

  randomNumber() {
    const randomNumber = [];
    for (let index = 0; index < 3; index++) {
      this.array.push(Math.floor(Math.random() * 100) + 1);
    }
    // console.log(this.array);

    // this.array.push({title : this.state.textInput_Holder});
  }

  quizeToState() {
    // this.array.push(number);
    // const quizeStrings = this.array.toString();
    // console.log(quizeStrings);

    let url;
    url = `http://numbersapi.com/random/trivia?fragment`;
    let i = 3;
    while (i) {
      if (url) {
        fetch(url)
          .then(response => response.text())
          .catch(err => console.warn('fetch error' + err))
          .then(json => {
            this.array.push(json);

            // this.setState({quizeData: json});

            // console.log('quizeData');
            // console.log(this.array);
          })
          .catch(err => console.warn('json not loaded' + err));
      }
      i--;
    }
  }
  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  setQuizeModalVisible = visible => {
    this.array.sort(function(a, b) {
      return 0.5 - Math.random();
    });
    this.setState({quizeModalVisible: visible});
  };
  checkAnswer = number => {
    // console.log(number);
    let url;
    url = `http://numbersapi.com/${number}`;
    if (url) {
      fetch(url)
        .then(response => response.json())
        .catch(err => console.warn('fetch error' + err))
        .then(json => {
          this.setState({dateData: json});
          this.loopFacts(json);
          // console.log(json);
        })
        .catch(err => console.warn('json not loaded' + err));
    }
  };

  loopFacts = facts => {
    const answerEqwl = this.state.numberEqwl;
    const {navigation} = this.props;
    const {route} = this.props;
    this.props.navigation.navigate('Quiz', {
      data: facts,
      answerEqwl: answerEqwl,
      onSelect: this.onSelect,
    });
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('score');
      // console.log(value);

      this.setState({score: value});
      // console.log(value);

      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  };

  onSelect = data => {
    this.setState(data);
  };
  forceRemount = () => {
    this.setState(({data}) => ({
      data: data + 1,
    }));
  };

  render() {
    const buttonContainer = LayoutBuilder.buildButtonContainer(
      this,
      this.state.orientation,
      this.state.altButtons,
      this._handleButtonPress,
      this._reset,
      this._deleteLast,
      this._handleCopyPress,
      this._handlePastePress,
      this._switchButtons,
    );
    const {
      duration,
      isPlaying,
      isInverse,
      progress,
      loop,
      example,
      modalVisible,
      quizeModalVisible,
      numberEqwl,
      dateData,
    } = this.state;

    return (
      <View
        style={styles.container}
        accessible={true}
        onLayout={this._updateOrientation.bind(this)}>
        <Toast ref="toast" position="top" opacity={0.8} />

        <View style={styles.fact}>
          <Text style={styles.text}>EQWL Points: {this.state.score}</Text>
        </View>

        <CalculatorResponse
          topDisplay={this.state.topDisplay}
          bottomDisplay={this.state.bottomDisplay}
          orientation={this.state.orientation}
        />
        {buttonContainer}
      </View>
    );
  }
}

const PLAY_BUTTON_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sideMenu: {
    backgroundColor: Colors.BLUE_DARK,
  },
  loader: {
    flex: 0.5,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fact: {
    alignItems: 'center',

    marginTop: 45,
    // flex: 1,
    // justifyContent: 'center',
    height: '7%',
    width: '100%',
    // backgroundColor: 'pink',
    // color: '#008033',
    // borderBottomWidth: 0.5,
    // borderColor: '#000000',
    // paddingBottom: 40,
  },
  eqwlFact: {
    marginTop: 45,
    flex: 0.7,
    justifyContent: 'center',

    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    color: '#008033',
    // borderBottomWidth: 0.5,
    borderColor: '#000000',
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  random: {
    flex: 1,
    fontSize: 40,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 0,
    marginBottom: 0,
    marginTop: 25,

    color: 'black',
    fontFamily: 'AvenirNext-Regular',
  },
  randomEqwl: {
    flex: 1,
    fontSize: 40,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 0,
    marginBottom: 0,
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,
    height: '100%',

    color: 'black',
    fontFamily: 'AvenirNext-Regular',
  },
  randomText: {
    // marginTop: 10,
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    justifyContent: 'center',
    color: '#000000',
    fontFamily: 'AvenirNext-Regular',
    // marginBottom: 40,

    padding: 2,
  },
  text: {
    marginTop: 20,
    width: '80%',
    fontSize: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    fontFamily: 'AvenirNext-Regular',
  },
  headerIcons: {
    flex: 1,
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  playButton: {
    flex: 1,
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: PLAY_BUTTON_SIZE / 2,
  },
  playButtonSecond: {
    flex: 1,
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: PLAY_BUTTON_SIZE / 2,
  },
  playButtonThird: {
    flex: 1,
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: PLAY_BUTTON_SIZE / 2,
  },
  playButtonIcon: {
    width: 16,
    height: 16,
  },
  controlsIcon: {
    width: 24,
    height: 24,
    padding: 8,
  },
  controlsIconEnabled: {
    tintColor: '#1d8bf1',
  },
  controlsIconDisabled: {
    tintColor: '#aaa',
  },
  lottieView: {
    flex: 1,
  },
  lottieViewInvse: {
    backgroundColor: 'black',
  },
  button: {
    borderRadius: 5,
    padding: 5,
  },

  modalView: {},
  content: {
    fontSize: 20,
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',

    backgroundColor: 'white',
  },
  buttonsModal: {
    // flex: 1,
    // flexDirection: 'row',
    // backgroundColor: 'pink',
  },
  openButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    // justifyContent: 'space-around',
    // alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    // backgroundColor: 'white',
    fontFamily: 'AvenirNext-Regular',
    margin: 5,
  },
  textStyleHeaderQuiz: {
    textAlign: 'center',
    color: 'white',

    fontFamily: 'AvenirNext-Regular',
    fontSize: 30,
  },
  modalText: {
    marginBottom: 12,

    fontSize: 20,

    fontFamily: 'AvenirNext-Regular',
  },
  date: {
    backgroundColor: 'black',
    color: 'red',
    alignContent: 'center',
  },
  quizeContainer: {
    borderWidth: 1,
    borderColor: 'white',
    // backgroundColor: 'black',

    justifyContent: 'space-between',
    alignItems: 'center',
    // alignContent: 'center',

    // flexDirection: 'column',
    // margin: 5,
  },
  twoBottomQuize: {
    width: DeviceWidth * 0.3,
    height: DeviceWidth * 0.4,
    marginBottom: 1,
    marginLeft: 1,
    // backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  twoTopQuize: {
    width: DeviceWidth * 0.4,
    height: DeviceWidth * 0.4,
    margin: 5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    textAlign: 'center',
    alignContent: 'center',
    // borderWidth: 1,
    // borderColor: 'white',
  },
});
