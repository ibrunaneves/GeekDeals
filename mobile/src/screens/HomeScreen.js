/**
 * HomeScreen - Tela principal com lista de ofertas
 * Tem filtro por categoria que foi uma adição de última hora
 * mas ficou bom
 */

import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

// Categorias disponíveis pra filtrar
const CATEGORIES = [
    { key: 'all', label: 'Todos', icon: 'grid' },
    { key: 'game', label: 'Games', icon: 'game-controller' },
    { key: 'hardware', label: 'Hardware', icon: 'hardware-chip' },
    { key: 'collectible', label: 'Colecionáveis', icon: 'star' },
    { key: 'accessory', label: 'Acessórios', icon: 'headset' },
];

export default function HomeScreen() {
    const { signOut } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const fetchProducts = useCallback(async () => {
        try {
            const response = await api.get('api/products');
            setProducts(response.data);
        } catch (error) {
            console.log('Erro:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                Alert.alert('Sessão Expirada', 'Faça login novamente.', [
                    { text: 'OK', onPress: signOut }
                ]);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [signOut]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Aplica o filtro quando muda a categoria
    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(p => {
                const type = p.type?.toLowerCase();
                // Trata alguns tipos que vieram diferentes do backend
                if (selectedCategory === 'accessory') {
                    return type === 'accessory' || type === 'acessorio' || type === 'periferico';
                }
                return type === selectedCategory;
            });
            setFilteredProducts(filtered);
        }
    }, [selectedCategory, products]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProducts();
    }, [fetchProducts]);

    const handleLogout = () => {
        Alert.alert('Sair', 'Deseja sair da sua conta?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: signOut }
        ]);
    };

    // Formata preço em BRL
    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    // Cores e ícones pra cada tipo de produto
    const getTypeConfig = (type) => {
        const configs = {
            'game': { icon: 'game-controller', color: '#667eea' },
            'hardware': { icon: 'hardware-chip', color: '#f093fb' },
            'software': { icon: 'code-slash', color: '#4facfe' },
            'collectible': { icon: 'star', color: '#fbbf24' },
            'accessory': { icon: 'headset', color: '#43e97b' },
            'acessorio': { icon: 'headset', color: '#43e97b' },
            'periferico': { icon: 'desktop', color: '#fa709a' },
        };
        return configs[type?.toLowerCase()] || { icon: 'cube', color: '#a8edea' };
    };

    // Renderiza cada chip de categoria
    const renderCategoryChip = ({ key, label, icon }) => {
        const isSelected = selectedCategory === key;
        return (
            <TouchableOpacity
                key={key}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedCategory(key)}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={icon}
                    size={16}
                    color={isSelected ? '#fff' : 'rgba(255,255,255,0.5)'}
                />
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    // Card de produto
    const renderProduct = ({ item }) => {
        const isExpired = new Date(item.expiryDate) < new Date();
        const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        const config = getTypeConfig(item.type);

        return (
            <TouchableOpacity
                style={[styles.productCard, isExpired && styles.expiredCard]}
                activeOpacity={0.9}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.typeBadge, { backgroundColor: config.color + '20' }]}>
                        <Ionicons name={config.icon} size={16} color={config.color} />
                        <Text style={[styles.typeText, { color: config.color }]}>{item.type}</Text>
                    </View>

                    {!isExpired && daysLeft <= 3 && (
                        <View style={styles.urgentBadge}>
                            <Text style={styles.urgentText}>
                                {daysLeft === 0 ? 'HOJE' : daysLeft + 'D'}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.priceValue}>{formatPrice(item.price)}</Text>
                    <View style={styles.timerContainer}>
                        <Ionicons
                            name={isExpired ? "close-circle" : "time-outline"}
                            size={14}
                            color={isExpired ? "#ef4444" : "#6b7280"}
                        />
                        <Text style={[styles.timerText, isExpired && styles.expiredText]}>
                            {isExpired ? 'Expirado' : `${daysLeft}d restantes`}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Quando não tem ofertas
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
                <Ionicons name="bag-outline" size={50} color="#667eea" />
            </View>
            <Text style={styles.emptyTitle}>
                {selectedCategory === 'all' ? 'Sem ofertas no momento' : 'Nenhuma oferta nesta categoria'}
            </Text>
            <Text style={styles.emptySubtitle}>
                {selectedCategory === 'all' ? 'Novas ofertas em breve!' : 'Tente outra categoria'}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradient} />
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Carregando ofertas...</Text>
            </View>
        );
    }

    const activeCount = filteredProducts.filter(p => new Date(p.expiryDate) >= new Date()).length;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradient} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Olá, Geek!</Text>
                    <Text style={styles.headerTitle}>Ofertas</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="exit-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Filtros horizontais */}
            <View style={styles.chipsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsScroll}
                >
                    {CATEGORIES.map(renderCategoryChip)}
                </ScrollView>
            </View>

            {/* Contagem */}
            <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                    {filteredProducts.length} oferta{filteredProducts.length !== 1 ? 's' : ''}
                    {selectedCategory !== 'all' ? ` em ${CATEGORIES.find(c => c.key === selectedCategory)?.label}` : ''}
                </Text>
                <Text style={styles.statsActive}>{activeCount} ativa{activeCount !== 1 ? 's' : ''}</Text>
            </View>

            {/* Lista de produtos */}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item._id}
                renderItem={renderProduct}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#667eea']}
                        tintColor="#667eea"
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 16 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 55,
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    greeting: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 4 },
    logoutBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    chipsContainer: { paddingBottom: 8 },
    chipsScroll: { paddingHorizontal: 16, gap: 10 },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginRight: 8,
    },
    chipSelected: {
        backgroundColor: 'rgba(102, 126, 234, 0.3)',
        borderColor: '#667eea',
    },
    chipText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '500' },
    chipTextSelected: { color: '#fff' },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    statsText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
    statsActive: { color: '#667eea', fontSize: 13, fontWeight: '600' },

    listContainer: { paddingHorizontal: 20, paddingBottom: 100 },

    productCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    expiredCard: { opacity: 0.5 },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    typeText: { fontSize: 12, fontWeight: '600', marginLeft: 6, textTransform: 'uppercase' },
    urgentBadge: {
        backgroundColor: '#f59e0b',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    urgentText: { color: '#fff', fontSize: 10, fontWeight: '700' },

    productName: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 6 },
    productDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 20,
        marginBottom: 14,
    },

    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    priceValue: { fontSize: 22, fontWeight: '700', color: '#4ade80' },
    timerContainer: { flexDirection: 'row', alignItems: 'center' },
    timerText: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginLeft: 4 },
    expiredText: { color: '#ef4444' },

    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyIcon: {
        width: 90,
        height: 90,
        borderRadius: 25,
        backgroundColor: 'rgba(102, 126, 234, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#fff', textAlign: 'center' },
    emptySubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 8 },
});