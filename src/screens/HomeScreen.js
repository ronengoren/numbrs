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
} from 'react-native';
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
    // this.getTrivia();
  }
  getTrivia = async number => {
    const response = await fetch(`http://numbersapi.com/${number}/trivia`);
    const data = await response.text();
    this.setState({trivia: data});

    console.log(response);
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

  handleOperation = operation => {
    if (operation === 'C') {
      this.setState({
        display: '',
        result: '',
        trivia: '',
        loader: false,
      });
    } else if (operation === '=') {
      this.setState({
        display: this.state.result,
        result: '',
        loader: true,
      });
      // this.setState({loader: true});

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
    } = this.state;

    const {toggled} = this.state;
    const themetext = {
      color: toggled ? '#F5FCFF' : '#114511',
    };

    if (this.state.loader) {
      return (
        <View style={styles.container}>
          <View style={styles.fact}>
            {this.state.trivia ? (
              <Text style={[styles.random]}>{this.state.trivia}</Text>
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

            <View style={[styles.resultCcontainer]}>
              {/* {this.state.trivia ? (
              <Text style={[styles.random]}>{this.state.trivia}</Text>
            ) : (
              <View style={[styles.resultCcontainer]}>
                <Text style={[styles.random]}>
                  Make a calculation to see a fact!
                </Text>
                <LottieView
                  ref={this.setAnim}
                  autoPlay={!progress}
                  source={require('../screens/animations/HamburgerArrow.json')}
                  progress={progress}
                  loop={loop}
                  enableMergePathsAndroidForKitKatAndAbove
                />
              </View>
                    <ActivityIndicator />
            )} */}
            </View>
          </View>

          <StatusBar barStyle="light-content" />

          <Display state={this.state} />

          <Buttons operation={this.handleOperation} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.fact}>
          <Text style={[styles.random]}>Make a calculation to see a fact!</Text>
          {/* {this.state.trivia ? (
            <Text style={[styles.random]}>{this.state.trivia}</Text>
          ) : (
            <LottieView
              ref={this.setAnim}
              autoPlay={!progress}
              source={require('../screens/animations/HamburgerArrow.json')}
              progress={progress}
              loop={loop}
              enableMergePathsAndroidForKitKatAndAbove
            />
          )} */}

          <View style={[styles.resultCcontainer]}>
            {/* {this.state.trivia ? (
              <Text style={[styles.random]}>{this.state.trivia}</Text>
            ) : (
              <View style={[styles.resultCcontainer]}>
                <Text style={[styles.random]}>
                  Make a calculation to see a fact!
                </Text>
                <LottieView
                  ref={this.setAnim}
                  autoPlay={!progress}
                  source={require('../screens/animations/HamburgerArrow.json')}
                  progress={progress}
                  loop={loop}
                  enableMergePathsAndroidForKitKatAndAbove
                />
              </View>
                    <ActivityIndicator />
            )} */}
          </View>
        </View>

        <StatusBar barStyle="light-content" />

        <Display state={this.state} />

        <Buttons operation={this.handleOperation} />
      </View>
    );
  }
}
const PLAY_BUTTON_SIZE = 60;

const styles = StyleSheet.create({
  container: {
    //calc
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'stretch',
    backgroundColor: '#fff',
    //numbers
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loader: {
    flex: 1,
    width: '100%',
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
    backgroundColor: '#fff',
    color: '#008033',
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  list: {
    paddingVertical: 4,
    margin: 5,
    backgroundColor: '#000000',
  },
  random: {
    fontSize: 20,
    textAlign: 'center',
    // margin: 10,
    // marginTop: 25,
    color: '#000000',
    fontFamily: 'AvenirNext-UltraLight',
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
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  playButton: {
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: PLAY_BUTTON_SIZE / 2,
    backgroundColor: '#1d8bf1',
    justifyContent: 'center',
    alignItems: 'center',
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
