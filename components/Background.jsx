import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const StripedCircle = ({ size, top, left, right, bottom }) => {
  const stripes = Array.from({ length: 20 });

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          top,
          left,
          right,
          bottom,
        },
      ]}
    >
      {stripes.map((_, index) => (
        <View
          key={index}
          style={[
            styles.stripe,
            { top: index * 10 },
          ]}
        />
      ))}
    </View>
  );
};

export default function Background() {
  return (
    <View style={styles.container}>
      {/* Big top-left circle */}
      <StripedCircle size={260} top={-80} left={-80} />

      {/* Medium top-right circle */}
      <StripedCircle size={120} top={80} right={-40} />

      {/* Medium right circle */}
      <StripedCircle size={160} top={260} right={-20} />

      {/* Bottom-left circle */}
      <StripedCircle size={180} bottom={-60} left={-70} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C3B53", // dark blue background
  },
  circle: {
    position: "absolute",
    overflow: "hidden",
  },
  stripe: {
    position: "absolute",
    width: "150%",
    height: 6,
    backgroundColor: "#6EC1FF",
    transform: [{ rotate: "-20deg" }],
    opacity: 0.85,
  },
});
