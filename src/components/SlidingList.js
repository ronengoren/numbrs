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
} from 'react-native';

const window = Dimensions.get('window');
const DeviceWidth = Dimensions.get('window').width;

export default class SlidingList extends Component {
  // state = {next: ['0', '1', '2']};

  render() {
    return (
      <View>
        <FlatList
          data={this.props.data}
          renderItem={({item}) => (
            <View>
              <TouchableOpacity
                style={styles.twoTopQuize}
                onPress={() => {
                  this.setQuizeModalVisible(!quizeModalVisible);
                }}>
                <Text style={styles.textStyle}>{item.text}</Text>
              </TouchableOpacity>
            </View>
          )}
          // renderRow={this._renderRow}
          numColumns={2}
          keyExtractor={item => item.id}
        />
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
    // borderWidth: 1,
    // borderColor: 'white',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // backgroundColor: 'yellow',
    // ...Platform.select({
    //   ios: {
    //     paddingTop: 20,
    //   },
    // }),
  },

  button: {
    // backgroundColor: 'white',
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
    fontSize: 15,
    // // backgroundColor: 'white',
    fontFamily: 'AvenirNext-Regular',
    margin: 5,
  },
  twoTopQuize: {
    width: DeviceWidth * 0.4,
    height: DeviceWidth * 0.4,
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
