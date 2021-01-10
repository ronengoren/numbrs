import React, {useState, useEffect} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import NumberPlease from 'react-native-number-please';

const Dates = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [dayModalVisible, setDayModalVisible] = useState(false);

  const [fact, setFact] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const [selectedDate, setSelectedDate] = useState('');
  const initialDayValues = [
    {id: '1', value: 1},
    {id: '2', value: 2},
    {id: '3', value: 3},
    {id: '3', value: 4},
    {id: '5', value: 5},
    {id: '6', value: 6},
    {id: '7', value: 7},
    {id: '8', value: 8},
    {id: '9', value: 9},
    {id: '10', value: 10},
    {id: '11', value: 11},
    {id: '12', value: 12},
    {id: '13', value: 13},
    {id: '14', value: 14},
    {id: '15', value: 15},
    {id: '16', value: 16},
    {id: '17', value: 17},
    {id: '18', value: 18},
    {id: '19', value: 19},
    {id: '20', value: 20},
    {id: '21', value: 21},
    {id: '22', value: 22},
    {id: '23', value: 23},
    {id: '24', value: 24},
    {id: '25', value: 25},
    {id: '26', value: 26},
    {id: '27', value: 27},
    {id: '28', value: 28},
    {id: '29', value: 29},
    {id: '30', value: 30},
    {id: '31', value: 31},
  ];
  const initialMonthValues = [
    {id: '1', value: 'January'},
    {id: '2', value: 'February'},
    {id: '3', value: 'March'},
    {id: '4', value: 'April'},
    {id: '5', value: 'May'},
    {id: '6', value: 'June'},
    {id: '7', value: 'July'},
    {id: '8', value: 'August'},
    {id: '9', value: 'September'},
    {id: '10', value: 'October'},
    {id: '11', value: 'November'},
    {id: '12', value: 'December'},
  ];

  const [days, setDays] = useState(initialDayValues);
  const [months, setMonths] = useState(initialMonthValues);

  const dayNumbers = [{id: 'day', min: 1, max: 31}];
  const monthNumbers = [{id: 'month', min: 1, max: 12}];
  const gregorianConfigs = {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  };
  //   useEffect(() => {
  //     // onMonths();
  //     const url = 'http://numbersapi.com/1/9/date?json';

  //     if (url) {
  //       fetch(url).then(data => {
  //         data.json().then(returned => {
  //           setFact(returned.text);
  //         });
  //       });
  //     }
  //   }, []);

  onMonth = async selectedMonth => {
    console.log(selectedMonth);
    setModalVisible(false);
    setDayModalVisible(true);
    setSelectedMonth(selectedMonth);
  };
  onDay = async selectedDay => {
    setDayModalVisible(false);
    getFact(selectedDay);
  };
  getFact = async selectedDay => {
    console.log(selectedMonth);
    console.log(selectedDay);

    const url =
      'http://numbersapi.com/' +
      selectedMonth +
      '/' +
      selectedDay +
      '/date?json';
    if (url) {
      fetch(url).then(data => {
        data.json().then(returned => {
          console.log(returned.text);
          setFact(returned.text);
        });
      });
    }
    // console.log(months, days);
    // setFact(dateSelected);
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <SafeAreaView style={styles.monthsContainer}>
              <FlatList
                data={months}
                renderItem={({item}) => (
                  <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
                    <TouchableOpacity
                      style={{
                        ...styles.monthsThumbnail,
                        backgroundColor: '#2196F3',
                      }}
                      onPress={() => {
                        onMonth(item.id);
                      }}>
                      <Text style={styles.textStyle}>{item.value}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                //Setting the number of column
                numColumns={3}
                keyExtractor={(item, index) => index}
              />
            </SafeAreaView>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={dayModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <Text style={styles.modalText}>{fact}</Text> */}
            <SafeAreaView style={styles.monthsContainer}>
              <FlatList
                data={days}
                renderItem={({item}) => (
                  <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
                    <TouchableOpacity
                      style={{
                        ...styles.daysThumbnail,
                        backgroundColor: '#2196F3',
                      }}
                      onPress={() => {
                        onDay(item.id);
                      }}>
                      <Text style={styles.textStyle}>{item.value}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                //Setting the number of column
                numColumns={3}
                keyExtractor={(item, index) => index}
              />
            </SafeAreaView>
          </View>
        </View>
      </Modal>
      {fact ? (
        <Text style={styles.factText}>{fact}</Text>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  modalView: {
    flex: 2,
    flexDirection: 'row',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    // flex: 10,
    // justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  monthsButton: {
    backgroundColor: '#F194FF',
    borderRadius: 50,
    padding: 30,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  factText: {
    flex: 1,
    // marginBottom: 15,
    textAlign: 'center',
    fontSize: 30,
  },
  monthsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  monthsThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    borderRadius: 100,
  },
  daysThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 100,
  },
});

export default Dates;
