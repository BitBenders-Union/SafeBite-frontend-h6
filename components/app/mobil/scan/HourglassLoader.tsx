// components/app/mobil/scan/HourglassLoader.tsx
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

type Props = {
    size?: number;
};

export default function HourglassLoader({ size = 30 }: Props) {
    const { theme } = useAppTheme();

    const rotateAnim = useRef(new Animated.Value(0)).current;
    const topSandAnim = useRef(new Animated.Value(0)).current;
    const bottomSandAnim = useRef(new Animated.Value(0)).current;
    const centerLineAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const rotateLoop = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 5000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        const topLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(topSandAnim, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(topSandAnim, {
                    toValue: 0,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        );

        const bottomLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(bottomSandAnim, {
                    toValue: 0,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(bottomSandAnim, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        );

        const centerLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(centerLineAnim, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(centerLineAnim, {
                    toValue: 0,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        );

        rotateLoop.start();
        topLoop.start();
        bottomLoop.start();
        centerLoop.start();

        return () => {
            rotateLoop.stop();
            topLoop.stop();
            bottomLoop.stop();
            centerLoop.stop();
        };
    }, [rotateAnim, topSandAnim, bottomSandAnim, centerLineAnim]);

    const width = size * 0.62;
    const height = size;
    const bulbWidth = width * 0.8;
    const bulbHeight = height * 0.43;
    const barSize = Math.max(2, size * 0.08);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 0.49, 0.51, 0.98, 1],
        outputRange: ["0deg", "0deg", "180deg", "180deg", "360deg"],
    });

    const topSandHeight = topSandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [bulbHeight * 0.95, 0],
    });

    const bottomSandHeight = bottomSandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, bulbHeight * 0.95],
    });

    const centerLineHeight = centerLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, height * 0.45],
    });

    return (
        <Animated.View
            style={{
                width,
                height,
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
                transform: [{ rotate }],
            }}
        >
            <View
                style={{
                    position: "absolute",
                    width,
                    height,
                    borderTopWidth: barSize,
                    borderBottomWidth: barSize,
                    borderTopColor: theme.hourglassFrame,
                    borderBottomColor: theme.hourglassFrame,
                }}
            />

            <Animated.View
                style={{
                    position: "absolute",
                    top: height * 0.27,
                    width: 2,
                    height: centerLineHeight,
                    backgroundColor: theme.hourglassSand,
                }}
            />

            <View
                style={{
                    position: "absolute",
                    top: 0,
                    width: bulbWidth,
                    height: bulbHeight,
                    borderBottomLeftRadius: bulbWidth / 2,
                    borderBottomRightRadius: bulbWidth / 2,
                    backgroundColor: theme.hourglassGlass,
                    overflow: "hidden",
                }}
            >
                <Animated.View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: topSandHeight,
                        backgroundColor: theme.hourglassSand,
                    }}
                />
            </View>

            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    width: bulbWidth,
                    height: bulbHeight,
                    borderTopLeftRadius: bulbWidth / 2,
                    borderTopRightRadius: bulbWidth / 2,
                    backgroundColor: theme.hourglassGlass,
                    overflow: "hidden",
                }}
            >
                <Animated.View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: bottomSandHeight,
                        backgroundColor: theme.hourglassSand,
                    }}
                />
            </View>
        </Animated.View>
    );
}