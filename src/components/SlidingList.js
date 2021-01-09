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
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const window = Dimensions.get('window');
const DeviceWidth = Dimensions.get('window').width;

export default class SlidingList extends Component {
  constructor(props) {
    super(props);

    // state = {next: ['0', '1', '2']};
    this.state = {
      answer: [],
      // data: [],
      answerEqwl: this.props.answerEqwl,
      wrongModalVisible: false,
      correctModalVisible: false,
      disableItem: false,
    };
  }
  // componentDidMount() {
  //   this.setState({data: this.props.data});
  //   console.log('this.state');

  //   console.log(this.state);
  // }

  setWrongModalVisible(visible) {
    this.setState({wrongModalVisible: visible});
  }
  setCorrectModalVisible = visible => {
    this.setState({correctModalVisible: visible});
  };
  deleteTask(index) {
    // console.log(this.state);
    const filteredData = Object.keys(this.props.data);
    // console.log(filteredData);

    // const newData = this.props.data.filter(item => {
    //   return index !== index;
    // });
    // console.log('TRYING TO DELETE', index);
  }

  onAnswer(answer, index, answerEqwl, item) {
    const {progress, loop} = this.state;
    this.state.answer.push(answer);

    if (answer == answerEqwl) {
      this.props.onScoreCorrect(item);

      // const newArray = this.state.data.slice(index, 1);
      // this.setState({
      //   data: newArray,
      // });
      // console.log(answer);
      this.setState({correctModalVisible: true});

      this.setState({answerEqwl: ''});

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
      // this.props.navigation.goBack();
    } else {
      this.setState({wrongModalVisible: true});
      this.props.onScoreChange('0');
      this.props.onScoreWrong(answer);

      try {
        // AsyncStorage.setItem('score', '0');
      } catch (error) {
        console.log('error setting win');
      }
    }

    // this.setState({
    //   answer: answer,
    // });
  }

  render() {
    const data = this.props.data;
    const answerEqwl = this.props.answerEqwl;
    const {wrongModalVisible, progress, correctModalVisible} = this.state;
    // console.log(this.props);

    // console.log(this.props.answerEqwl);

    // console.log(this.props.data);
    // var x = [];
    // var txt = '';

    // for (x in data) {
    //   txt += data[x];
    //   console.log(data[x]);
    // }

    // this.setState(prev => {
    //   const data = prev.data.concat(json);

    //   return {
    //     data: data,
    //   };
    //   // console.log(data);
    // });

    return (
      <View style={styles.container}>
        {/* <Text>{AsyncStorage.getItem('score')}</Text> */}

        <Modal
          isVisible={wrongModalVisible}
          onSwipeComplete={() => this.setWrongModalVisible(!wrongModalVisible)}
          swipeDirection="left"
          // animationInTiming={1000}
          // animationOutTiming={1000}
          // backdropTransitionInTiming={800}
          // backdropTransitionOutTiming={800}
          // animationIn="zoomInDown"
          // animationOut="zoomOutUp"
        >
          {/* <View style={styles.centeredView}> */}
          <LottieView
            ref={this.setAnim}
            autoPlay={!progress}
            source={require('../screens/animations/wrongAnswer')}
            progress={progress}
            loop={false}
            enableMergePathsAndroidForKitKatAndAbove
          />
          {/* <Button
            title="Hide modal"
            onPress={() => {
              navigation.navigate('Home')}
            }}
          /> */}
          {/* </View> */}
          {/* <View style={styles.modal}>
            <Text style={{color: 'yellow'}}>wrongModalVisible!</Text>

            <Button
              title="Hide modal"
              onPress={() => {
                this.setWrongModalVisible(!wrongModalVisible);
              }}
            />
          </View> */}
        </Modal>
        <Modal
          isVisible={correctModalVisible}
          onSwipeComplete={() =>
            this.setCorrectModalVisible(!correctModalVisible)
          }
          swipeDirection="left"
          // animationInTiming={1000}
          // animationOutTiming={1000}
          // backdropTransitionInTiming={800}
          // backdropTransitionOutTiming={800}
          // animationIn="zoomInDown"
          // animationOut="zoomOutUp"
        >
          <LottieView
            ref={this.setAnim}
            autoPlay={!progress}
            source={require('../screens/animations/correctAnswer')}
            progress={progress}
            loop={false}
            enableMergePathsAndroidForKitKatAndAbove
          />
          {/* <View style={styles.modal}>
            <Text style={{color: 'yellow'}}>correctModalVisible!</Text>

            <Button
              title="Hide modal"
              onPress={() => {
                this.setCorrectModalVisible(!correctModalVisible);
              }}
            />
          </View> */}
        </Modal>
        <Text style={styles.textHeader}>
          Number {this.props.answerEqwl} is:
        </Text>
        <View>
          <FlatList
            data={Object.keys(this.props.data)}
            // data={this.props.data}
            renderItem={({index, item}) => (
              <View>
                <TouchableOpacity
                  disabled={this.state.disableItem}
                  style={styles.twoTopQuize}
                  onPress={() => {
                    this.onAnswer(
                      item,
                      index,
                      answerEqwl,
                      this.props.data[item],
                    ),
                      this.deleteTask(item, index, answerEqwl);
                  }}>
                  <Text style={styles.textStyle}>{this.props.data[item]}</Text>
                </TouchableOpacity>
              </View>
            )}
            // renderRow={this._renderRow}
            keyExtractor={(item, index) => index.toString()}
            numColumns={1}
          />
        </View>

        {/* <Text style={styles.answer}>{this.state.answer}</Text> */}
        {/* <Button
          onPress={() => this.onAnswer()}
          style={styles.button}
          title="Submit Answer"
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    // borderWidth: 1,
    // borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },

  button: {
    // backgroundColor: 'white',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    // fontSize: 20,
    // paddingVertical: 20,
    // color: '#999999',
  },

  list: {
    // flex: 1,
  },

  contentContainer: {
    // width: window.width,
    // ...Platform.select({
    //   ios: {
    //     paddingHorizontal: 30,
    //   },
    //   android: {
    //     paddingHorizontal: 0,
    //   },
    // }),
  },

  textStyle: {
    // justifyContent: 'space-around',
    // alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    // // backgroundColor: 'white',
    fontFamily: 'AvenirNext-Regular',
    margin: 5,
  },
  textHeader: {
    color: 'black',
    fontFamily: 'AvenirNext-Regular',
    fontSize: 30,
  },
  twoTopQuize: {
    // width: DeviceWidth * 0.4,
    height: DeviceWidth * 0.3,
    margin: 5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
    // textAlign: 'center',
    // alignContent: 'center',
    // borderWidth: 1,
    // borderColor: 'white',
  },
});
