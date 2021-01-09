//   resToState() {
//     this.set;
//     const url = `http://numbersapi.com/random/trivia?json`;
//     let i = 3;

//     while (i) {
//       if (url) {
//         fetch(url)
//           .then(response => response.text())
//           .catch(err => console.warn('fetch error' + err))
//           .then(json => {
//             this.state.data.push(json);

//             // this.setState(prev => {
//             //   const data = prev.data.concat(json);

//             //   return {
//             //     data: data,
//             //   };
//             //   // console.log(data);
//             // });
//           })
//           .catch(err => console.warn('json not loaded' + err));
//       }
//       i--;
//     }
//   }

//   componentDidMount() {
//     // const answerEqwl = this.props.route.params.answerEqwl;
//     // // console.log(answerEqwl);
//     // const {route} = this.props;
//     // // this.state.data.concat(this.props.route.params.data);
//     // const newFact = this.props.route.params.data;
//     // this.setState({
//     //   data: newFact,
//     //   answerEqwl: answerEqwl,
//     // });
//   }

//   getData = async () => {
//     try {
//       this.inputText = await AsyncStorage.getItem('score');
//       this.getTrivia(this.inputText);
//     } catch (error) {
//       // error
//     }
//   };
//   storeData = async () => {
//     try {
//       await AsyncStorage.setItem('score', this.inputText);
//     } catch (error) {
//       // Error saving data
//     }
//   };
//   onChangeInput = number => {
//     this.inputText = number;
//   };

//   onCorrect = key => {
//     // const eqwlNumber = this.props.route.params.answerEqwl;
//     // console.log(key);
//     this.props.navigation.navigate('Home', {});

//     // // console.log(eqwlNumber);
//     // const newArray = Object.values(this.state.data);
//     // console.log(newArray);
//     // const newData = newArray.filter(item => {
//     //   return item !== key;
//     // });
//     // console.log(newData);
//     // this.setState({
//     //   data: [],
//     // });
//     // const newArray = [];
//     // this.state.data = newArray;
//     // console.log(this.state.data);
//   };
//   onWrong = key => {
//     const eqwlNumber = this.props.route.params.data;
//     const newArray = Object.values(eqwlNumber);
//     console.log(key);
//     console.log(newArray);
//     const newData = newArray.filter(item => {
//       return item !== key;
//     });
//     this.setState({
//       data: newData,
//     });
//     console.log(newData);

//     // this.props.navigation.navigate('Home', {});
//     // this.setState({data: []});
//     // console.log(this.state.data);

//     // console.log('wrong');

//     // console.log(key);
//     // console.log(eqwlNumber);
//   };
//   onIndex = key => {};

//   onEqwl = key => {};

//   render() {
//     // const {itemId} = route.params;
//     const {route} = this.props;

//     const data = this.state.data;
//     const answerEqwl = this.state.answerEqwl;

//     // data.push(this.props.route.params);

//     return (
//       <View style={styles.header}>
//         <Text style={styles.text}>Your Score: {this.state.score}</Text>

//         {this.state.data ? (
//           <SlidingList
//             data={this.state.data}
//             answerEqwl={this.state.answerEqwl}
//             onScoreChange={this.setScore}
//             onScoreCorrect={this.onCorrect}
//             onScoreWrong={this.onWrong}
//           />
//         ) : (
//           <ActivityIndicator />
//         )}
//         <Text>this.props.route.params.data</Text>
//       </View>
//     );
//   }
// }

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import SlidingList from '../components/SlidingList';
import QuizList from '../components/QuizList';
import CalculatorButton from '../components/CalculatorButton';
import Colors from '../constants/Colors';
import Constants from '../constants/Constants';
import axios from 'axios';

type Props = {
  handleButtonPress: string => any,
  reset: () => any,
  deleteLast: () => any,
  switchButton: () => any,
};
export default function Quiz() {
  const itemsSize = (Dimensions.get('screen').width - 12) / 3;
  const {width, height} = Dimensions.get('screen');
  const [questions, setQuestions] = useState([]);
  const [date, setDate] = useState([]);
  const [month, setMonth] = useState(null);
  const [score, setScore] = useState('');
  const [answerEqwl, setAnswerEqwl] = useState('');
  const [query, setQuery] = useState();
  const [state, setState] = useState({data: null, loading: true});
  const [text, setText] = useState('');
  const [questionNumber, setQuestionNumber] = useState('');
  var imagesurls = [];
  const isMounted = useRef(true);

  useEffect(() => {
    // console.log(RandomNumber);
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    const url = 'http://numbersapi.com/random/trivia?json&fragment';
    let i = 4;
    let day = [];

    if (url) {
      fetch(url).then(data => {
        data.json().then(returned => {
          if (isMounted.current) {
            day.push(returned);
            setQuestions(returned.text);
            setQuestionNumber(returned.number);
            setDate(returned);
          }
        });
      });
    }
  }, []);
  onSubmit = answer => {
    if (questionNumber == answer) {
      alert('correct answer!');
    }
  };
  handleButtonPress = operator => {
    console.log(operator);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.resultsContainer}>
        {/* <ScrollView style={styles.resultContainer}>
          <Text style={styles.topDisplay}>{text}</Text>
        </ScrollView> */}
      </SafeAreaView>

      {questions ? (
        <View style={styles.buttonContainer}>
          <Text style={styles.question}>{questions}</Text>

          {/* <TouchableOpacity
            style={styles.buttonTopQuize}
            onPress={() => {
              onSubmit(questionNumber);
            }}>
            <Text style={styles.buttonStyle}>{questionNumber}</Text>
          </TouchableOpacity> */}
          <QuizList
            questions={date}
            // answerEqwl={this.state.answerEqwl}
            // onScoreChange={this.setScore}
            // onScoreCorrect={this.onCorrect}
            // onScoreWrong={this.onWrong}
          />
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}

{
  /* <View style={styles.container}>
  <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.buttonGroup}>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(7)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'7'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(8)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'8'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(9)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'9'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(4)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'4'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(5)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'5'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(6)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'6'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(1)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'1'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(2)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'2'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(3)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'3'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(0)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'0'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit('send')}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'SEND'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
          <ActivityIndicator />

          <View style={styles.row}>
            <View style={styles.buttonGroup}>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => onSubmit(7)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'7'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => handleButtonPress(8)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'8'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => handleButtonPress(9)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'9'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => handleButtonPress(4)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'4'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => handleButtonPress(5)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'5'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => handleButtonPress(6)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'6'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => handleButtonPress(1)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'1'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => handleButtonPress(2)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'2'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => handleButtonPress(3)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'3'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => handleButtonPress(0)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'.'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numberContainer}
                  onPress={value => handleButtonPress(0)}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.item}>
                    {'0'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View> */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: '#000000',
  },
  row: {
    flex: 2,
    flexDirection: 'row',
  },
  item: {
    color: Colors.BLACK,
    fontSize: 20 * (Constants.maxDimension / Constants.baseMaxDimension),
    fontFamily: 'AvenirNext-Regular',
  },
  buttonGroup: {
    flex: 10,
  },
  numberContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.BLACK,
  },
  resultsContainer: {
    backgroundColor: 'green',
  },
  resultContainer: {
    backgroundColor: Colors.WHITE,
    // flex: 1,
  },
  topDisplay: {
    color: Colors.BLACK,
    fontSize: 40 * (Constants.maxDimension / Constants.baseMaxDimension),
    textAlignVertical: 'center',
    margin: 5,
    fontFamily: 'AvenirNext-Regular',
  },
  buttonStyle: {
    // justifyContent: 'space-around',
    // alignItems: 'center',
    color: 'yellow',
    textAlign: 'center',
    fontSize: 28,
    // backgroundColor: 'white',
    fontFamily: 'AvenirNext-Regular',
    margin: 5,
  },
  question: {
    // justifyContent: 'space-around',
    // alignItems: 'center',
    textAlign: 'center',
    fontSize: 20,
    // backgroundColor: 'white',
    fontFamily: 'AvenirNext-Regular',
    margin: 5,
  },
  buttonTopQuize: {
    // width: DeviceWidth * 0.4,
    // height: DeviceWidth * 0.3,
    margin: 5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // textAlign: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'white',
  },
});
