import React, { useRef, useEffect } from "react";
import { Animated, Pressable } from "react-native";

export default function AnimatedBox({
  children,
  delay = 0,
  duration = 500,
  isButton = false,
  type = "slideUp",
  style,
  onPress,
  usePulse = false,
}) {
  // 🎯 Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const translateY = useRef(
    new Animated.Value(type === "slideUp" ? 30 : type === "slideDown" ? -30 : 0)
  ).current;

  const translateX = useRef(
    new Animated.Value(type === "slideRight" ? -30 : type === "slideLeft" ? 30 : 0)
  ).current;

  const rotate = useRef(new Animated.Value(0)).current;

  // 🚀 Entry animation
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

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

  // 👆 Press animation
  const handlePressIn = () => {
    if (!isButton) return;

    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 40,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    if (!isButton) return;

    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 3,
    }).start();
  };

  // 🔄 rotate
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const triggerRotate = () => {
    Animated.sequence([
      Animated.timing(rotate, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    triggerRotate();
    onPress?.();
  };

  // 🎬 ONLY animation styles (NO layout styles here)
  const animatedStyle = {
    opacity,
    transform: [
      { translateY },
      { translateX },
      { scale: Animated.multiply(scale, pulse) },
      { rotate: spin },
    ],
  };

 const AnimatedContent = (
  <Animated.View style={[animatedStyle, style]}>
    {children}
  </Animated.View>
);

  // 🔥 BUTTON MODE (IMPORTANT FIX)
  if (isButton) {
  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

  // 📦 NORMAL MODE
  return <Animated.View style={style}>{AnimatedContent}</Animated.View>;
}