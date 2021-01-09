import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../../src/utils/colors';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
const window = Dimensions.get('window');

const DeviceWidth = Dimensions.get('window').width;

export default function QuizList(props) {
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState('');

  const [wrongModalVisible, setWrongModalVisible] = useState(false);
  const [correctModalVisible, setCorrectModalVisible] = useState(false);
  const [disableItem, setDisableItem] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loop, setLoop] = useState(null);
  const [state, setState] = useState();
  const [answered, setAnswered] = useState(false);
  const [wrongAnswered, setWrongAnswered] = useState();
  const [score, setScore] = useState(0);
  const [isShowingText, setIsShowingText] = useState(true);
  const [profileState, setProfileState] = useState(props);

  const DATA = [
    {
      id: '1',
      title: 'First Item',
    },
    {
      id: '2',
      title: 'Second Item',
    },
    {
      id: '3',
      title: 'Third Item',
    },
    {
      id: '4',
      title: 'Forth Item',
    },
  ];
  offModalVisible = () => {
    setWrongModalVisible(true);
  };
  onModalVisible = () => {
    setCorrectModalVisible(true);
  };

  useEffect(() => {
    if (props.questions.number != null) {
      rndmNumber(props.questions.number);
    }
  }, [props, score]);

  onAnwer = async userAnswer => {
    try {
      if (props.questions.number == userAnswer) {
        setAnswered(true);
        setCorrectModalVisible(true);
        setTimeout(() => {
          setCorrectModalVisible(false);
        }, 2000);
        // setScore(+1);
        // await AsyncStorage.setItem('score', new score());
        // const newScore = await AsyncStorage.getItem('score');
        console.log(newScore);
      } else {
        setWrongModalVisible(true);
        setTimeout(() => {
          setWrongModalVisible(false);
        }, 2000);

        // const newList = state.filter(item => item.id !== userAnswer);
        // console.log(newList);
      }
    } catch (error) {
      // error
    }
  };
  const rndmNumber = ques => {
    let numbers = [];

    for (let i = 0; i < 3; i++) {
      let RandomNumber = Math.floor(Math.random() * 1000) + 1;
      numbers.push({id: RandomNumber.toString(), num: RandomNumber.toString()});
    }

    numbers.push({id: ques, num: ques});

    setState(numbers.sort(() => Math.random() - 0.5));
  };
  const Item = ({title}) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.twoTopQuize}
        onPress={() => {
          onAnwer(title);
        }}
        disabled={title.id === title ? true : false}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
  const renderItem = ({item}) => <Item title={item.num} />;
  setAnim = anim => {
    anim = anim;
  };
  return (
    <View style={styles.container}>
      <Modal
        isVisible={wrongModalVisible}
        onSwipeComplete={() => offModalVisible(!wrongModalVisible)}
        swipeDirection="left"
        animationInTiming={1000}
        animationOutTiming={1000}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        animationIn="zoomInDown"
        animationOut="zoomOutUp">
        <LottieView
          ref={setAnim}
          autoPlay={!progress}
          source={require('../screens/animations/wrongAnswer')}
          progress={progress}
          loop={false}
          enableMergePathsAndroidForKitKatAndAbove
        />
      </Modal>
      <Modal
        isVisible={correctModalVisible}
        onSwipeComplete={() => onModalVisible(!correctModalVisible)}
        swipeDirection="left"
        animationInTiming={1000}
        animationOutTiming={1000}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        animationIn="zoomInDown"
        animationOut="zoomOutUp">
        <LottieView
          ref={setAnim}
          autoPlay={!progress}
          source={require('../screens/animations/correctAnswer')}
          progress={progress}
          loop={false}
          enableMergePathsAndroidForKitKatAndAbove
        />
      </Modal>
      <Text style={styles.textHeader}>{score}</Text>

      {answered ? (
        <Text style={styles.textHeader}>GOOD ONE!</Text>
      ) : (
        <Text style={styles.textHeader}>CHOOSE THE CORRECT ANSWER</Text>
      )}
      {state ? (
        <FlatList
          data={state}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          numColumns={1}
          style={{flex: 0}}
          initialNumToRender={state.length}
        />
      ) : (
        <ActivityIndicator />
      )}
      {/* <FlatList
          data={props.questions}
          // data={this.props.data}
          renderItem={({index, item}) => (
            <TouchableOpacity
              disabled={disableItem}
              style={styles.twoTopQuize}
              //   onPress={() => {
              //     this.onAnswer(
              //       item,
              //       index,
              //       answerEqwl,
              //       this.props.data[item],
              //     ),
              //       this.deleteTask(item, index, answerEqwl);
              //   }}
            >
              <Text style={styles.textStyle}>number</Text>

              <Text style={styles.textStyle}>{props.questions[item]}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
        /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 80,
    // borderWidth: 1,
    // borderColor: 'white',
    // justifyContent: 'center',
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
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  title: {
    fontSize: 20,
    paddingVertical: 5,
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
    // color: 'white',
    // textAlign: 'center',
    // fontSize: 18,
    // backgroundColor: 'white',
    // fontFamily: 'AvenirNext-Regular',
    // margin: 5,
  },
  buttonStyle: {
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // color: 'yellow',
    // textAlign: 'center',
    // fontSize: 28,
    // backgroundColor: 'white',
    // fontFamily: 'AvenirNext-Regular',
    // margin: 5,
  },
  buttonTopQuize: {
    // width: DeviceWidth * 0.4,
    // height: DeviceWidth * 0.3,
    // margin: 5,
    // backgroundColor: 'black',
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'row',
    // textAlign: 'center',
    // alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'white',
  },
  textHeader: {
    color: 'black',
    fontFamily: 'AvenirNext-Regular',
    fontSize: 20,
  },
  twoTopQuize: {
    width: DeviceWidth * 0.4,
    height: DeviceWidth * 0.3,
    margin: 15,
    backgroundColor: 'pink',
    borderRadius: 100,
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'row',
    // textAlign: 'center',
    // alignContent: 'center',
    borderWidth: 1,
    // borderColor: 'white',
    flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    // flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
