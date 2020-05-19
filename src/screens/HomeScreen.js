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
  Animated,
  Easing,
  TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-modal';

import Slider from '@react-native-community/slider';
import Display from '../../src/components/Display';
import Buttons from '../../src/components/Buttons';
import colors from '../../src/utils/colors';
import LottieView from 'lottie-react-native';
import ExamplePicker from './animations/ExamplePicker';
const AnimatedSlider = Animated.createAnimatedComponent(Slider);
const playIcon = require('../../assets/play.png');
const pauseIcon = require('../../assets/pause.png');
const loopIcon = require('../../assets/loop.png');
const inverseIcon = require('../../assets/inverse.png');

const makeExample = (name, getJson, width) => ({name, getJson, width});
const EXAMPLES = [
  makeExample(
    'Hamburger Arrow',
    () => require('./animations/HamburgerArrow.json'),
    makeExample(
      'Hamburger Arrow (200 px)',
      () => require('./animations/HamburgerArrow.json'),
      200,
    ),
    makeExample('Line Animation', () =>
      require('./animations/LineAnimation.json'),
    ),
    makeExample('Lottie Logo 1', () =>
      require('./animations/LottieLogo1.json'),
    ),
    makeExample('Lottie Logo 2', () =>
      require('./animations/LottieLogo2.json'),
    ),
    makeExample('Lottie Walkthrough', () =>
      require('./animations/LottieWalkthrough.json'),
    ),
    makeExample('Pin Jump', () => require('./animations/PinJump.json')),
    makeExample('Twitter Heart', () =>
      require('./animations/TwitterHeart.json'),
    ),
    makeExample('Watermelon', () => require('./animations/Watermelon.json')),
    makeExample('Motion Corpse', () =>
      require('./animations/MotionCorpse-Jrcanest.json'),
    ),
  ),
];
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
      loader: false,
      dateData: {},
      dateIcon: false,
      modalVisible: false,
      modalLoop: false,
    };
    state = {
      example: EXAMPLES[0],
      duration: 3000,
      isPlaying: true,
      isInverse: false,
      loop: false,
    };
  }

  manageAnimation = shouldPlay => {
    if (!this.state.progress) {
      if (shouldPlay) {
        this.anim.play();
      } else {
        this.anim.reset();
      }
    } else {
      this.state.progress.setValue(0);

      if (shouldPlay) {
        Animated.timing(this.state.progress, {
          toValue: 1,
          duration: this.state.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          this.setState({isPlaying: false});
        });
      }
    }

    this.setState({isPlaying: shouldPlay});
  };
  onPlayPress = () => this.manageAnimation(!this.state.isPlaying);
  stopAnimation = () => this.manageAnimation(false);

  onInversePress = () =>
    this.setState(state => ({isInverse: !state.isInverse}));
  onProgressChange = progress => this.state.progress.setValue(progress);
  onDurationChange = duration => this.setState({duration});

  setAnim = anim => {
    this.anim = anim;
  };
  componentDidMount() {
    this.resToState();
  }
  getTrivia = async number => {
    const round = Math.round(number);
    const response = await fetch(`http://numbersapi.com/${round}/trivia`);
    const data = await response.text();
    if (response.status !== 200) {
      this.setState({trivia: 'We couldn’t find a fact for this number YET :('});
    } else {
      this.setState({trivia: data});
      console.log(response);
    }
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
          console.log(json);
        })
        .catch(err => console.warn('json not loaded' + err));
    }
  }
  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  // alert(this.state.dateData.text);
  onDatePress = () => {
    if (this.state.dateData.text) {
      alert(this.state.dateData.text);
    }
  };

  handleOperation = operation => {
    if (operation === 'C') {
      this.setState({
        display: '',
        result: '',
        trivia: '',
        loader: false,
      });
    } else if (operation === '=') {
      if (!this.state.result) {
        this.setState({
          display: this.state.result,
          result: '',
          loader: false,
        });
      }
      if (this.state.result) {
        this.setState({
          display: this.state.result,
          // result: '',
          loader: true,
        });
      }

      this.getTrivia(this.state.result);
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
      {this.state.trivia}
      {/* <Text style={styles.lightText}>{data.item.name}</Text>
      <Text style={styles.lightText}>{data.item.email}</Text>
      <Text style={styles.lightText}>{data.item.company.name}</Text> */}
    </TouchableOpacity>
  );

  render() {
    const {
      duration,
      isPlaying,
      isInverse,
      progress,
      loop,
      example,
      modalVisible,
      modalLoop,
    } = this.state;

    const {toggled} = this.state;
    const themetext = {
      color: toggled ? '#F5FCFF' : '#114511',
    };

    if (this.state.loader) {
      return (
        <View style={styles.container} accessible={true}>
          <View style={styles.fact}>
            {this.state.trivia ? (
              <Text style={[styles.random]} adjustsFontSizeToFit>
                {this.state.trivia}
              </Text>
            ) : (
              <LottieView
                ref={this.setAnim}
                autoPlay={!progress}
                source={require('../screens/animations/HamburgerArrow.json')}
                progress={progress}
                loop={loop}
                enableMergePathsAndroidForKitKatAndAbove
              />
            )}
          </View>

          <StatusBar barStyle="light-content" />

          <Display state={this.state} />

          <Buttons operation={this.handleOperation} />
        </View>
      );
    }
    // this.state.dateData.text
    return (
      <View style={styles.container}>
        <View style={styles.fact}>
          <View style={styles.centeredView}>
            <Modal
              backdropColor="#B4B3DB"
              backdropOpacity={0.8}
              animationIn="zoomInDown"
              animationOut="zoomOutUp"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}
              backdropColor="#B4B3DB"
              backdropOpacity={0.8}
              // animationIn="zoomInDown"
              // animationOut="zoomInDown"
              // transparent={true}
              visible={modalVisible}
              // animationIn="zoomInDown"
              onRequestClose={() => {
                console.log('Modal has been closed.');
              }}>
              <View style={styles.modalView}>
                <View style={styles.content}>
                  {/* <LottieView
                    ref={this.setAnim}
                    autoPlay={!progress}
                    source={require('../screens/animations/modalAnimation.json')}
                    progress={progress}
                    loop={modalLoop}
                    enableMergePathsAndroidForKitKatAndAbove
                  /> */}

                  <Text style={styles.modalText}>
                    {this.state.dateData.text}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{...styles.openButton, backgroundColor: '#001A54'}}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>Nice!</Text>
                </TouchableOpacity>
              </View>
            </Modal>
            <View style={styles.headerIcons}>
              {this.state.dateData.text ? (
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => {
                    this.setModalVisible(true);
                  }}>
                  <LottieView
                    ref={this.setAnim}
                    autoPlay={!progress}
                    source={require('../screens/animations/dateAnimation.json')}
                    progress={progress}
                    loop={false}
                    enableMergePathsAndroidForKitKatAndAbove
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.playButton}>
                  <LottieView
                    ref={this.setAnim}
                    autoPlay={progress}
                    source={require('../screens/animations/dateAnimation.json')}
                    progress={progress}
                    loop={false}
                    enableMergePathsAndroidForKitKatAndAbove
                  />
                </View>
              )}
              <View style={styles.playButtonSecond}>
                {/* <TouchableOpacity
                  style={styles.playButtonSecond}
                  onPress={() => {
                    this.setModalVisible(true);
                  }}> */}
                <LottieView
                  ref={this.setAnim}
                  autoPlay={!progress}
                  source={require('../screens/animations/comingSoon.json')}
                  progress={progress}
                  loop={false}
                  enableMergePathsAndroidForKitKatAndAbove
                />
                {/* </TouchableOpacity> */}
              </View>
              <View style={styles.playButtonThird}>
                {/* <TouchableOpacity
                  style={styles.playButtonThird}
                  onPress={() => {
                    this.setModalVisible(true);
                  }}> */}
                <LottieView
                  ref={this.setAnim}
                  autoPlay={!progress}
                  source={require('../screens/animations/comingSoon.json')}
                  progress={progress}
                  loop={false}
                  enableMergePathsAndroidForKitKatAndAbove
                />
                {/* </TouchableOpacity> */}
              </View>
            </View>

            <Text style={[styles.random]}>Welcome to EQWL!</Text>

            <Text style={[styles.randomText]}>Calculate for A Fact!</Text>
          </View>
        </View>

        <StatusBar barStyle="light-content" />

        <Display state={this.state} />

        <Buttons operation={this.handleOperation} />
      </View>
    );
  }
}
const PLAY_BUTTON_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    //calc
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    //numbers
    // alignSelf: 'stretch',
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 20,
  },

  loader: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fact: {
    margin: 5,
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    // height: 0.5,
    height: '100%',
    width: '80%',
    backgroundColor: '#fff',
    color: '#008033',
    borderBottomWidth: 0.5,
    borderColor: '#000000',
    marginTop: 80,
  },
  list: {
    paddingVertical: 4,
    margin: 5,
    backgroundColor: '#000000',
  },
  random: {
    flex: 1,
    fontSize: 25,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 0,

    // margin: 30,
    // marginTop: 10,

    color: '#000000',
    fontFamily: 'AvenirNext-Regular',
    textShadowColor: 'black',
    textShadowRadius: 1,
  },
  randomText: {
    flex: 1,
    fontSize: 21,

    color: '#000000',
    fontFamily: 'AvenirNext-Regular',
    textShadowColor: 'black',
    textShadowRadius: 1,
    padding: 2,
  },

  text: {
    alignSelf: 'stretch',
    fontSize: 30,
    textAlign: 'left',
    marginBottom: 40,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headerIcons: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 80,
    // padding: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    // marginRight: 40,
  },
  playButton: {
    flex: 1,
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: PLAY_BUTTON_SIZE / 2,
    // marginRight: -60,
    // padding: -140,
    // backgroundColor: 'pink',

    // marginTop: 10,
    // marginRight: 240,
  },
  playButtonSecond: {
    flex: 1,
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: PLAY_BUTTON_SIZE / 2,
    // backgroundColor: '#fff',

    // marginTop: 10,
  },
  playButtonThird: {
    flex: 1,
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: PLAY_BUTTON_SIZE / 2,
    // backgroundColor: '#fff',

    // marginTop: 10,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // // flexDirection: 'column',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    margin: 20,
    marginTop: 80,
    // backgroundColor: 'white',
    borderRadius: 20,
    // padding: 20,
    // alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    // height: 390,
    // width: 100 + '%',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  openButton: {
    backgroundColor: '#001A54',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: '#DDE6EF',
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 12,
    // flex: 1,
    // justifyContent: 'center',
    marginTop: 170,
    // alignContent: 'center',
    // // marginBottom: 15,
    // textAlign: 'center',
    // // fontWeight: 'bold',
    fontFamily: 'AvenirNext-Regular',
    // fontSize: 20,
    // flexWrap: 'wrap',
    // // textShadowColor: 'black',
    // // textShadowRadius: 2,
    // // padding: 50,
    // // borderWidth: 2,
    // borderRadius: 20,
    // // lineHeight: 100,
    // marginRight: 40,
    // marginLeft: 40,
  },
  date: {
    backgroundColor: 'black',
    color: 'red',
    // flex: 1,
    // justifyContent: 'center',
    alignContent: 'center',
  },
});

// <View style={{flex: 1}}>
//   <ExamplePicker
//     example={example}
//     examples={EXAMPLES}
//     onChange={(e, index) => {
//       this.stopAnimation();
//       this.setState({example: EXAMPLES[index]});
//     }}
//   />
//   <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//     <LottieView
//       ref={this.setAnim}
//       autoPlay={!progress}
//       // style={[
//       //   example.width && {width: example.width},
//       //   isInverse && styles.lottieViewInvse,
//       // ]}
//       // source={example.getJson()}
//       source={require('./animations/HamburgerArrow.json')}
//       progress={progress}
//       loop={loop}
//       enableMergePathsAndroidForKitKatAndAbove
//     />
//   </View>
//   <View style={{paddingBottom: 20, paddingHorizontal: 10}}>
//     <View style={styles.controlsRow}>
//       <TouchableOpacity
//         onPress={() => {
//           this.stopAnimation();
//           this.setState(state => ({loop: !state.loop}));
//         }}
//         disabled={!!progress}>
//         <Image
//           style={[
//             styles.controlsIcon,
//             loop && styles.controlsIconEnabled,
//             !!progress && styles.controlsIconDisabled,
//           ]}
//           resizeMode="contain"
//           source={loopIcon}
//         />
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.playButton}
//         onPress={this.onPlayPress}>
//         <Image
//           style={styles.playButtonIcon}
//           resizeMode="contain"
//           source={isPlaying ? pauseIcon : playIcon}
//         />
//       </TouchableOpacity>
//       <TouchableOpacity onPress={this.onInversePress}>
//         <Image
//           style={styles.controlsIcon}
//           resizeMode="contain"
//           source={inverseIcon}
//         />
//       </TouchableOpacity>
//     </View>
//     <View
//       style={{
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingBottom: 10,
//       }}>
//       <Text>Use Imperative API:</Text>
//     </View>
//     <Switch
//       onValueChange={i => {
//         this.stopAnimation();
//         this.setState(() => ({
//           progress: !i ? new Animated.Value(0) : undefined,
//         }));
//       }}
//       value={!progress}
//     />
//   </View>
//   <View style={{paddingBottom: 10}} />
//   <View>
//     <Text>Progress:</Text>
//   </View>
//   <AnimatedSlider
//     minimumValue={0}
//     maximumValue={1}
//     value={progress || 0}
//     onValueChange={this.onProgressChange}
//     disabled={!progress}
//   />
// </View>
