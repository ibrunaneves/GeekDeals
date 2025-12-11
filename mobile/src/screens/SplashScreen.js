import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const lineWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Sequência de animações
        Animated.sequence([
            // Logo aparece
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // Linha se expande
            Animated.timing(lineWidth, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }),
            // Texto aparece
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            // Subtítulo aparece
            Animated.timing(subtitleOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            // Pausa
            Animated.delay(800),
        ]).start(() => {
            if (onFinish) {
                onFinish();
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                style={styles.gradient}
            />

            <View style={styles.content}>
                {/* Logo */}
                <Animated.View style={[
                    styles.logoContainer,
                    {
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }]
                    }
                ]}>
                    <View style={styles.logoInner}>
                        <Ionicons name="game-controller" size={50} color="#fff" />
                    </View>
                </Animated.View>

                {/* Linha */}
                <View style={styles.lineContainer}>
                    <Animated.View style={[
                        styles.line,
                        {
                            width: lineWidth.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 80]
                            })
                        }
                    ]} />
                </View>

                {/* Título */}
                <Animated.Text style={[styles.title, { opacity: textOpacity }]}>
                    Geek Deals
                </Animated.Text>

                {/* Subtítulo */}
                <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
                    As melhores ofertas para Geeks
                </Animated.Text>
            </View>

            {/* Footer */}
            <Animated.Text style={[styles.footer, { opacity: subtitleOpacity }]}>
                Unifacisa - 2025
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 24,
    },
    logoInner: {
        width: 100,
        height: 100,
        borderRadius: 28,
        backgroundColor: 'rgba(102, 126, 234, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 30,
        elevation: 20,
    },
    lineContainer: {
        height: 3,
        marginBottom: 24,
        overflow: 'hidden',
    },
    line: {
        height: 3,
        backgroundColor: '#667eea',
        borderRadius: 2,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 8,
        letterSpacing: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.3)',
    },
});
