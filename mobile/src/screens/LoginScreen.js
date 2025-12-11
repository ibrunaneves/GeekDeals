/**
 * LoginScreen - Tela de login com 2FA
 * O fluxo é: email/senha -> código por email -> acesso
 */

import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen() {
    const { signIn } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Controla se tá na etapa do 2FA
    const [is2FAStep, setIs2FAStep] = useState(false);
    const [tempToken, setTempToken] = useState(null);

    // Login normal - manda email e senha
    async function handleLogin() {
        if (!email || !password) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('api/auth/login', { email, password });

            // Se vier tempToken, precisa do 2FA
            if (response.data.tempToken) {
                setTempToken(response.data.tempToken);
                setIs2FAStep(true);
                Alert.alert('Código Enviado', 'Verifique seu email!');
            } else {
                // Login direto sem 2FA (caso desabilite depois)
                const token = response.data.accessToken || response.data.token;
                if (token) {
                    await signIn(token);
                } else {
                    Alert.alert('Erro', 'Resposta inválida do servidor');
                }
            }
        } catch (error) {
            console.log('Erro no login:', error.response?.data || error.message);
            const message = error.response?.data?.message || 'Credenciais inválidas.';
            Alert.alert('Erro', message);
        } finally {
            setIsLoading(false);
        }
    }

    // Verifica o código 2FA
    async function handleTwoFactor() {
        if (!twoFactorCode || twoFactorCode.length !== 6) {
            Alert.alert('Atenção', 'Digite o código de 6 dígitos!');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('api/auth/2fa/verify', {
                token: tempToken,
                code: twoFactorCode
            });

            const token = response.data.token || response.data.accessToken;
            if (token) {
                await signIn(token);
            }
        } catch (error) {
            Alert.alert('Erro', 'Código inválido ou expirado.');
        } finally {
            setIsLoading(false);
        }
    }

    // Volta pro login normal
    function handleBack() {
        setIs2FAStep(false);
        setTwoFactorCode('');
        setTempToken(null);
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                style={styles.gradient}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                {/* Logo e título */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="game-controller" size={40} color="#fff" />
                    </View>
                    <Text style={styles.title}>Geek Deals</Text>
                    <Text style={styles.subtitle}>
                        {is2FAStep ? 'Verificação de Segurança' : 'Entre na sua conta'}
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.card}>
                    {!is2FAStep ? (
                        <>
                            {/* Email */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#667eea" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            {/* Senha */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#667eea" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Senha"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color="rgba(255,255,255,0.4)"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Botão de login */}
                            <TouchableOpacity
                                style={[styles.button, isLoading && styles.buttonDisabled]}
                                onPress={handleLogin}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.buttonText}>
                                        {isLoading ? 'Entrando...' : 'Entrar'}
                                    </Text>
                                    {!isLoading && (
                                        <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {/* Tela do 2FA */}
                            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={24} color="#667eea" />
                                <Text style={styles.backText}>Voltar</Text>
                            </TouchableOpacity>

                            <Text style={styles.twoFaInfo}>
                                Digite o código de 6 dígitos enviado para seu email.
                            </Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[styles.input, styles.codeInput]}
                                    placeholder="000000"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    value={twoFactorCode}
                                    onChangeText={setTwoFactorCode}
                                    keyboardType="numeric"
                                    maxLength={6}
                                    textAlign="center"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, isLoading && styles.buttonDisabled]}
                                onPress={handleTwoFactor}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.buttonText}>
                                        {isLoading ? 'Verificando...' : 'Confirmar'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <Text style={styles.footer}>Unifacisa - 2025</Text>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },

    header: { alignItems: 'center', marginBottom: 40 },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(102, 126, 234, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    title: { fontSize: 32, fontWeight: '700', color: '#fff', letterSpacing: 1 },
    subtitle: { fontSize: 15, color: 'rgba(255, 255, 255, 0.6)', marginTop: 8 },

    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        height: 56,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: '#fff' },
    codeInput: { fontSize: 28, letterSpacing: 10, fontWeight: '600' },

    button: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
    buttonDisabled: { opacity: 0.7 },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },

    backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backText: { color: '#667eea', fontSize: 16, marginLeft: 8 },
    twoFaInfo: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, marginBottom: 20, lineHeight: 20 },

    footer: { textAlign: 'center', color: 'rgba(255, 255, 255, 0.3)', marginTop: 40, fontSize: 12 },
});