import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApiOptimization } from '../hooks/useApiOptimization';

// Componente apenas para desenvolvimento - remover em produção
export const ApiUsageMonitor = () => {
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState(null);
  const { getApiUsageStats } = useApiOptimization();

  const updateStats = () => {
    const currentStats = getApiUsageStats();
    setStats(currentStats);
  };

  useEffect(() => {
    if (visible) {
      updateStats();
    }
  }, [visible]);

  if (__DEV__) {
    return (
      <>
        <TouchableOpacity
          style={styles.monitorButton}
          onPress={() => setVisible(true)}
        >
          <Ionicons name="analytics-outline" size={20} color="#fff" />
        </TouchableOpacity>

        <Modal
          visible={visible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Monitoramento de APIs</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📺 YouTube API</Text>
                <Text style={styles.stat}>
                  Cache: {stats?.youtube?.totalCached || 0} consultas
                </Text>
                <Text style={styles.stat}>
                  Exercícios em cache: {stats?.youtube?.cacheKeys?.length || 0}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🗺️ Google Places API</Text>
                <Text style={styles.stat}>
                  Cache: {stats?.places?.totalCached || 0} consultas
                </Text>
                <Text style={styles.stat}>
                  Locais em cache: {stats?.places?.cacheKeys?.length || 0}
                </Text>
              </View>

              <TouchableOpacity style={styles.refreshButton} onPress={updateStats}>
                <Text style={styles.refreshText}>Atualizar Estatísticas</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  monitorButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#276999',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  stat: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  refreshButton: {
    backgroundColor: '#276999',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});