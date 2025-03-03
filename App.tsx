import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, FlatList, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons, FontAwesome6, Feather } from '@expo/vector-icons';
import equalTo, { addDot, addDoubleZero, addNumber, addOperator, addZero } from './functions/Functions';
import Button from './components/Button';

const DisplayBoxHeight = Dimensions.get('window').height - (((Dimensions.get('window').width / 5) + 5) * 5) - 140;
const W = Dimensions.get('window').width;

const Calculator = () => {
  const buttonTexts = ["C", "%", 'D', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', 'Z', '0', '.', '='];
  const scrollViewRef = useRef<ScrollView | null>(null);  // Explicitly typing the scrollViewRef
  const [expState, setExpState] = useState('');
  const [ansState, setAnsState] = useState('');
  const [textBoxWidth, setTextBoxWidth] = useState(0);
  const [allowAnimate, setAllowAnimate] = useState(false);
  const [newAnsFontSize, setNewAnsFontSize] = useState(50);
  const [newExpFontSize, setNewExpFontSize] = useState(25);
  const [pressedEqualTo, setPressedEqualTo] = useState(false);
  const [modifiedExp, setModifiedExp] = useState(expState);
  const [mode, setMode] = useState(false);
  const ansAnimatedFontSize = useRef(new Animated.Value(25)).current;
  const expAnimatedFontSize = useRef(new Animated.Value(50)).current;
  const [showScroll,setShowScroll] = useState(false);





  




  useEffect(() => {
    let data = equalTo(expState);
    if (data.status === 2) setAnsState(data.ans.toString());
    let exp = "";
    for (let i = 0; i < expState.length; i++) {
      if (expState[i] === '*') exp += 'x';
      else exp += expState[i];
    }
    setModifiedExp(exp);
    if (expState.length === 0) setAnsState('');
    // scrollFunc();

  }, [expState]);

  const scrollFunc = () =>{
    if(textBoxWidth > (W - 30)) setShowScroll(true);
    else setShowScroll(false);
  }
  useLayoutEffect(()=>{

    scrollFunc();


  },[textBoxWidth])
// },[expState])

  useEffect(() => {
    if (ansState.length > 18) {
      setNewAnsFontSize(23);
    } else if(ansState.length > 10)
      setNewAnsFontSize(29);
      else setNewAnsFontSize(50);
  }, [ansState]);

  const startFontAnimation = () => {
   
    Animated.timing(ansAnimatedFontSize, {
      toValue: newAnsFontSize,
      duration: 500,
      // easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    Animated.timing(expAnimatedFontSize, {
      toValue: newExpFontSize,
      duration: 500,
      // easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const resetFontAnimation = () => {
    Animated.timing(ansAnimatedFontSize, {
      toValue: 25,
      duration: 5,
      useNativeDriver: false,
    }).start();

    Animated.timing(expAnimatedFontSize, {
      toValue: 50,
      duration: 5,
      useNativeDriver: false,
    }).start();
  };


  const handlePress = (e:string) => {
    if (allowAnimate && e !== '=') {
      resetFontAnimation();
      setAllowAnimate(false);
    }

    if ((ansState === "Expression Error" || ansState === "Cannot be divided by 0") && e !== '=') {
      setExpState('');
      return;
    }

    if (e !== '=' && pressedEqualTo) {
      setPressedEqualTo(false);
      setExpState(ansState);
      setAnsState('');
    }

    if (e === '=') {
      setPressedEqualTo(true);
      let data = equalTo(expState);
      if (data.status === 3) setAnsState('Expression Error');
      else if (data.status === 2) setAnsState(data.ans.toString());
      else if (data.status === 1) setAnsState(data.ans.toString());
      else {
        setAnsState('');
        return;
      }
      setAllowAnimate(true);
      startFontAnimation();
    } else if ("+-/*%".includes(e)) {
      if (addOperator(e, expState, ansState) === 2) {
        setExpState((prev) => prev + e);
      } else if (addOperator(e, expState, ansState) === 1) {
        setExpState((prev) => prev.slice(0, -1) + e);
      }
    } else if (e === '.') {
      if (addDot(e, expState, ansState) === 1) setExpState((prev) => prev + "0.");
      else if (addDot(e, expState, ansState) === 2) setExpState((prev) => prev + '.');
    } else if (e === 'C') {
      setAnsState('');
      setExpState('');
    } else if (e === 'D') {
      if (expState.length > 0) {
        setExpState((prev) => prev.slice(0, -1));
      }
    } else if (e === 'Z') {
      if (addDoubleZero(e, expState, ansState) === 1) setExpState((prev) => prev + '0');
      else if (addDoubleZero(e, expState, ansState) === 2) setExpState((prev) => prev + '00');
    } else if (e === '0') {
      if (addZero(e, expState, ansState) === 2) setExpState((prev) => prev + '0');
    } else {
      if (addNumber(e, expState, ansState) === 1) setExpState((prev) => prev.slice(0, -1) + e);
      else setExpState((prev) => prev + e);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [expState, textBoxWidth]);

  return (
    <View style={[styles.main, { backgroundColor: mode ? "#191B1F" : "#E7E9ED" }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={"#191B1F"} />
      <View style={styles.header}>
        <Pressable onPress={() => setMode(!mode)} style={{ paddingLeft: 12 }}>
          <FontAwesome6 size={30} color={mode ? 'white' : 'black'} name={mode ? "toggle-off" : "toggle-on"} />
        </Pressable>
        <Feather size={30} name={"more-vertical"} color={mode ? "white" : "black"} />
      </View>

      <View style={styles.displayBox}>
        <View style={styles.expBox}>
          {
          showScroll ? 
          (
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ width: '100%',paddingRight:8 }}
              contentContainerStyle={{
                alignSelf: 'flex-end',
                height: 70,
                flexDirection: 'row',
                backgroundColor: 'none',
                justifyContent: 'flex-end',
                alignItems: allowAnimate ? 'center' : 'flex-start',
                // paddingRight: 0,
                // marginRight:90,
              }}
            >
              <Animated.Text
                style={[
                  styles.expText,
                  {
                    fontSize: expAnimatedFontSize,
                    // color: mode ? 'white' : 'black',
                    color: mode ? (allowAnimate ? 'grey' : 'white') : allowAnimate ? 'grey' : 'black',
                  },
                ]}
                onLayout={(e) => {
                  const { width: elementWidth } = e.nativeEvent.layout;
                  setTextBoxWidth(elementWidth);
                }}
              >
                {modifiedExp}
              </Animated.Text>
            </ScrollView>
          ) : (
            <View
              style={{
                paddingRight: 2,
                height: 70,
                backgroundColor: 'none',
                display: 'flex',
                flexDirection: 'row',
                alignItems: allowAnimate ? 'center' : 'flex-start',
                justifyContent: 'flex-end',
              }}
            >
              <Animated.Text
                style={[
                  styles.expText,
                  {
                    fontSize: expAnimatedFontSize,
                    color: mode ? (allowAnimate ? 'grey' : 'white') : allowAnimate ? 'grey' : 'black',
                  },
                ]}
                onLayout={(e) => {
                  const { width: elementWidth } = e.nativeEvent.layout;
                  setTextBoxWidth(elementWidth);
                }}
                
              >
                {modifiedExp}
              </Animated.Text>
            </View>
          )}
        </View>
        <View style={styles.ansBox}>
          <Animated.Text
            style={[
              styles.ansText,
              { fontSize: ansAnimatedFontSize, color: mode ? (allowAnimate ? 'white' : 'grey') : allowAnimate ? 'black' : 'grey' },
            ]}
          >
            {ansState}
          </Animated.Text>
        </View>
      </View>

      <View style={styles.allButtons}>
        {buttonTexts.map((item, index) => (
          <Button buttonName={item} handlePress={handlePress} key={index} mode={mode} />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: mode ? "white" : "black" }]}>{"Calc By Suraj"}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({

  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    // backgroundColor: '#191B1F',
    backgroundColor: '#E7E9ED',
    height: Dimensions.get('window').height,
    // overflowX:scroll
  },

  header: {
    height: 60,
    // backgroundColor: 'brown',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  displayBox: {
    // height:(Dimensions.get('window').height - Dimensions.get('window').width / 5)
    // backgroundColor: 'violet',
    height: DisplayBoxHeight,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // height: 300
    // overflowX:scroll
  },
  expBox: {
    // backgroundColor: 'green',
    height: '60%',
    paddingRight: 6,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    // alignItems: 'end',
    // alignItems: 'center',
    width: Dimensions.get('window').width
    // overflowX:'scroll'
  },
  expText: {
    fontSize: 50,
    textAlign: 'right',

    paddingRight: 5,
    color: 'white',
    // width:'300%',
    // overflowX:'scroll'
    // overflow: 'scroll', // Allows horizontal scrolling if the text exceeds container width
    // whiteSpace: 'nowrap',
  },
  ansBox: {
    // backgroundColor: 'blue',
    height: '40%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems:'center',
    paddingRight: 11,
  },
  ansText: {
    fontSize: 27,
    textAlign: 'right',
    color: 'white'
  },


  allButtons: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#191B1F',
    // padding:10,
    // backgroundColor: 'red',
    // width:'500px',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  functionButton: {
    backgroundColor: '#a5a5a5', // Light gray for functional buttons
  },
  numberButton: {
    backgroundColor: '#333333', // Dark gray for number buttons
  },
  zeroButton: {
    backgroundColor: '#333333',
    width: 160, // Wider button for "0"
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  operatorButton: {
    backgroundColor: '#fe9e09', // Orange for operator buttons
  },
  functionText: {
    color: '#000', // Black text for functional buttons
    fontSize: 24,
    fontWeight: 'bold',
  },
  numberText: {
    color: '#fff', // White text for number buttons
    fontSize: 24,
    fontWeight: 'bold',
  },
  operatorText: {
    color: '#fff', // White text for operator buttons
    fontSize: 28,
    fontWeight: 'bold',
  },
  footer: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    // backgroundColor:'yellow',

  },
  footerText: {
    fontSize: 30,
    fontWeight: 600,
    color: "white",
  }
});

export default Calculator;
