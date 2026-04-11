import React from "react";
import { View, StyleSheet } from "react-native";

// ============================
// Gradient Diagonal Circle
// ============================
const GradientDiagonalCircle = ({
  size,
  top,
  left,
  right,
  bottom,
  rotate = 0,
}) => {
  const stripes = Array.from({ length: 60 });

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
          transform: [{ rotate: `${rotate}deg` }],
        },
      ]}
    >
      {stripes.map((_, index) => {
        const progress = index / stripes.length;
        const whiteIntensity = 1 - progress * 0.8;
        const blueIntensity = progress * 0.8;

        const r = Math.floor(255 * whiteIntensity + 100 * blueIntensity);
        const g = Math.floor(255 * whiteIntensity + 150 * blueIntensity);
        const b = Math.floor(255 * whiteIntensity + 255 * blueIntensity);
        const opacity = 0.7 + progress * 0.2;

        return (
          <View
            key={index}
            style={[
              styles.gradientStripe,
              {
                top: index * 4.5,
                backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

// ============================
// Diagonal White Striped Circle
// ============================
const DiagonalStripedCircle = ({
  size,
  top,
  left,
  right,
  bottom,
  rotate = 0,
}) => {
  const stripes = Array.from({ length: 50 });

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
          transform: [{ rotate: `${rotate}deg` }],
        },
      ]}
    >
      {stripes.map((_, index) => (
        <View
          key={index}
          style={[
            styles.diagonalStripe,
            {
              top: index * 4,
            },
          ]}
        />
      ))}
    </View>
  );
};

// ============================
// Background Layout
// ============================
export default function Background() {
  return (
    <View style={styles.container}>
      {/* Large top-left */}
      <GradientDiagonalCircle
        size={300}
        top={-100}
        left={-120}
        rotate={45}
      />

      {/* Small top-right */}
      <GradientDiagonalCircle
        size={110}
        top={40}
        right={10}
        rotate={-20}
      />

      {/* Middle-right */}
      <GradientDiagonalCircle
        size={150}
        top={180}
        right={-20}
        rotate={25}
      />

      {/* Bottom-left */}
      <DiagonalStripedCircle
        size={200}
        bottom={-100}
        left={-90}
        rotate={-15}
      />
    </View>
  );
}

// ============================
// Styles
// ============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09111E",
    position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  },
  circle: {
    position: "absolute",
    overflow: "hidden",
    backfaceVisibility: "hidden",
  },
  gradientStripe: {
    position: "absolute",
    width: "250%",
    height: 3,
    transform: [{ rotate: "45deg" }],
    left: "-50%",
  },
  diagonalStripe: {
    position: "absolute",
    width: "250%",
    height: 1.5,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
    left: "-50%",
    opacity: 0.6,
  },
});




