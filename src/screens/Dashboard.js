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
} from 'react-native';
import colors from '../../src/utils/colors';
import calculatePortraitDimension from '../constants/calculatePortraitDimension';
import LottieView from 'lottie-react-native';

const {width} = Dimensions.get('window');
const {width: deviceWidth, height: deviceHeight} = calculatePortraitDimension();
const DATA = [
  {
    id: '1',
    title: 'Calculator',
    lottiAnimation: require('../screens/animations/Calculator.json'),
    screen: 'Home',
  },
  {
    id: '2',
    title: 'Quiz',
    lottiAnimation: require('../screens/animations/Quiz.json'),
    screen: 'Quiz',
  },
  {
    id: '3',
    title: 'Recipes',
    lottiAnimation: require('../screens/animations/Recipes.json'),
    screen: 'Quiz',
  },
  {
    id: '4',
    title: 'Dates',
    lottiAnimation: require('../screens/animations/Dates.json'),
    screen: 'Quiz',
  },
  {
    id: '5',
    title: 'Scales',
    lottiAnimation: require('../screens/animations/Scales.json'),
    screen: 'Quiz',
  },
  {
    id: '6',
    title: 'Currency',
    lottiAnimation: require('../screens/animations/Currency.json'),
    screen: 'Quiz',
  },
  {
    id: '7',
    title: 'Degrees',
    lottiAnimation: require('../screens/animations/Degrees.json'),
    screen: 'Quiz',
  },
  {
    id: '8',
    title: 'Cloth Sizes',
    lottiAnimation: require('../screens/animations/Clothes.json'),
    screen: 'Quiz',
  },
  {
    id: '9',
    title: 'Times',
    lottiAnimation: require('../screens/animations/Times.json'),
    screen: 'Quiz',
  },
];
export default function Dashboard({navigation}) {
  const [progress, setProgress] = useState();
  const [duration, setduration] = useState();
  const [isPlaying, setIsPlaying] = useState();
  const [isInvers, setIsInvers] = useState();
  const [loop, setLoop] = useState();
  const [modalVisibal, setModalVisibal] = useState();
  const [modalLoop, setModalLoop] = useState();
  const [toggled, setToggled] = useState();
  manageAnimation = shouldPlay => {
    if (!progress) {
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
  getDashboardItem = item => {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => {
              navigation.navigate(item.screen);
            }}>
            {/* <Image
                source={{uri: 'https://picsum.photos/536/354'}}
                style={styles.profileImage}
              /> */}
            <LottieView
              ref={this.setAnim}
              autoPlay={!progress}
              source={item.lottiAnimation}
              progress={progress}
              loop={loop}
              enableMergePathsAndroidForKitKatAndAbove
            />
          </TouchableOpacity>
          <Text style={styles.text}>{item.title}</Text>
        </View>
      </View>
    );
  };

  renderItem = ({item}) => {
    // console.log(JSON.stringify(item, null, 2));

    return getDashboardItem(item);
  };
  renderDashboardGrid = () => {
    return (
      <FlatList
        data={DATA}
        renderItem={renderItem}
        // ListFooterComponent={renderFooterComponent()}
        refreshing={false}
        keyExtractor={item => item.id}
        // onRefresh={props.onRefresh}
        numColumns={3}
      />
    );
  };

  return <View style={styles.container}>{renderDashboardGrid()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignSelf: 'center',
  },
  profileContainer: {
    height: deviceWidth / 4,
    width: deviceWidth / 4,
    flexDirection: 'column',
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 30,
    marginTop: 50,
    // marginLeft: 40,
    // backgroundColor: '#39b54a',
  },
  profileImage: {
    backgroundColor: 'black',
    height: deviceWidth / 3 - 1,
    width: deviceWidth / 3 - 1,
  },
  lottieView: {
    flex: 1,
  },
  lottieViewInvse: {
    backgroundColor: 'black',
  },
  text: {
    // flex: 1,
    // alignItems: 'center',
    alignSelf: 'center',
    // justifyContent: 'center',
    color: 'red',
  },
});
