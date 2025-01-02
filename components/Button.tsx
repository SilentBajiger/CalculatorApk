import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Animated } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';

const colorGradient = {
  silver: ['#353842', '#3C424B', '#4C505C', '#4F5460'] as const,
  grey: ['#1D1E24', '#1E1F25', '#25262E', '#262931'] as const,
  orange: ['#BB450A', '#C6510A', '#D4660A', '#DA6F08'] as const,
  green: ['#006400', '#228B22', '#32CD32', '#7CFC00'] as const,
  white: ['#D3D6DE', '#DCDFE7', '#EBEFF4', '#F1F5F9'] as const,
  silverwhite: ['#9EA5B2', '#A9AFBD', '#BAC1CC', '#B6BDC8'] as const,
};

const bgOuter = {
  grey: '#24252B',
  silver: '#52565D',
  orange: '#BF743D',
  green: '#6FA34A',
  white: '#E5E8F0',
  silverwhite: '#B3BACA',
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type ColorKey = keyof typeof colorGradient; // This ensures only valid keys are used

interface ButtonProps {
  buttonName: string;
  handlePress: (buttonName: string) => void;
  mode: boolean;
}

const Button: React.FC<ButtonProps> = ({ buttonName, handlePress, mode }) => {
  const [state, setState] = useState<boolean>(true);
  const [currColor, setCurrColor] = useState<ColorKey>('grey'); // Make sure currColor is typed correctly
  const [btnCliked, setBtnClicked] = useState<boolean>(false);
  const animation = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    handlePress(buttonName);
    Animated.timing(animation, {
      toValue: btnCliked ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setBtnClicked(!btnCliked);
  };

  useEffect(() => {
    // Dynamically set color based on button name
    if ('+-*/'.includes(buttonName)) {
      setCurrColor('orange');
    } else if ('ADC%'.includes(buttonName)) {
      setCurrColor('silver');
    } else if (buttonName === '=') {
      setCurrColor('green');
    } else {
      setCurrColor('grey'); // Default color
    }
  }, [mode, buttonName]);

  return (
    <Pressable onPress={startAnimation}>
      <Animated.View
        style={[
          styles.outerButton,
          {
            backgroundColor: bgOuter[
              // Conditional color assignment for dynamic button types
              "/*+-=".includes(buttonName)
                ? currColor
                : "C%D".includes(buttonName)
                ? mode
                  ? "silver"
                  : "silverwhite"
                : mode
                ? "grey"
                : "white"
            ],
            boxShadow: `2px 2px 4px 1px ${mode ? 'black' : 'grey'}`,
            transform: [
              {
                scale: animation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={colorGradient[
            // Conditional gradient selection
            "/*+-=".includes(buttonName)
              ? currColor
              : "C%D".includes(buttonName)
              ? mode
                ? "silver"
                : "silverwhite"
              : mode
              ? "grey"
              : "white"
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, styles.innerButton]}
        >
          {buttonName === 'Z' ? (
            <Text style={[styles.numberText, { color: mode ? 'white' : 'black' }]}>
              {'00'}
            </Text>
          ) : buttonName === '*' ? (
            <Text style={[styles.numberText, { fontWeight: 600, color: mode ? 'white' : 'black' }]}>
              {'X'}
            </Text>
          ) : buttonName === 'D' ? (
            <Feather name={'delete'} color={mode ? 'white' : 'black'} size={27} />
          ) : buttonName === '/' ? (
            <FontAwesome6 name={'divide'} color={mode ? 'white' : 'black'} size={27} />
          ) : (
            <Text style={[styles.numberText, { color: mode ? 'white' : 'black' }]}>
              {buttonName}
            </Text>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerButton: {
    height: screenWidth / 5 + 5,
    width: screenWidth / 5 + 5,
    borderRadius: 30,
    backgroundColor: '#24252B',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  innerButton: {
    height: screenWidth / 5,
    width: screenWidth / 5,
    borderRadius: 30,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: 'white',
    fontSize: 27,
    fontWeight: 'bold',
  },
});

export default Button;
