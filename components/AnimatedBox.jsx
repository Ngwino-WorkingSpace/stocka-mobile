import React, { useRef, useEffect } from "react";
import { Animated, Pressable } from "react-native";

/**
 * Universal Animation Container
 * Props:
 * @param {React.ReactNode} children - Content to be animated
 * @param {number} delay - Initial delay before animation starts (ms)
 * @param {number} duration - Animation duration (ms)
 * @param {boolean} isButton - If true, adds press reactions (scale effect)
 * @param {string} type - Animation entry type ('fade', 'slideUp', 'slideDown', 'slideLeft', 'slideRight')
 * @param {object} style - Additional styles for the container
 * @param {function} onPress - Callback for when pressed (only if isButton is true)
 */
export default function AnimatedBox({ 
  children, 
  delay = 0, 
  duration = 500, 
  isButton = false, 
  type = "slideUp",
  style = {},
  onPress,
  usePulse = false
}) {
  // Core values
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(isButton ? 1 : 1)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  
  // Positional values based on type
  const translateY = useRef(new Animated.Value(type === "slideUp" ? 30 : type === "slideDown" ? -30 : 0)).current;
  const translateX = useRef(new Animated.Value(type === "slideRight" ? -30 : type === "slideLeft" ? 30 : 0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ]).start();

    // Pulse loop (optional)
    if (usePulse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  // Button press scale
  const onPressIn = () => {
    if (isButton) {
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, tension: 40, friction: 3 }).start();
    }
  };

  const onPressOut = () => {
    if (isButton) {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 40, friction: 3 }).start();
    }
  };

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const triggerRotate = () => {
    Animated.sequence([
        Animated.timing(rotate, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          })
    ]).start();
  };

  const handlePress = () => {
    if (onPress) {
        triggerRotate();
        onPress();
    }
  };

  const AnimatedComponent = isButton ? Pressable : Animated.View;
  
  // If it's a button, we wrap it in a Pressable and then an Animated.View
  // To allow for both entry animations and press effects
  
  const content = (
    <Animated.View
      style={[
        {
          opacity,
          transform: [
            { translateY },
            { translateX },
            { scale: Animated.multiply(scale, pulse) },
            { rotate: spin },
          ],
        },
        style
      ]}
    >
      {children}
    </Animated.View>
  );

  if (isButton) {
    return (
      <Pressable 
        onPressIn={onPressIn} 
        onPressOut={onPressOut} 
        onPress={handlePress}
        style={({ pressed }) => [
            { opacity: pressed ? 0.9 : 1 }
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
