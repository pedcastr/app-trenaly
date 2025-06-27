import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { styles } from './styles';
import PlacesService from '../../services/placesService';

export default function Gym() {
  const [searchText, setSearchText] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('gym');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true); // Novo estado para loading da localização

  // Estados para modal de informações (agora inclui avaliações)
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadNearbyPlaces();
    }
  }, [userLocation, selectedFilter]);

  const requestLocationPermission = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da sua localização para encontrar locais próximos.');
        setLoading(false);
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      setLocationLoading(false);

    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização.');
      setLoading(false);
      setLocationLoading(false);
    }
  };

  const loadNearbyPlaces = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      const places = await PlacesService.searchNearbyPlaces(
        userLocation.latitude,
        userLocation.longitude,
        selectedFilter,
        5000
      );
      setNearbyPlaces(places);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
      setNearbyPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNearbyPlaces();
    setRefreshing(false);
  };

  // Função melhorada para ligar com suporte ao WhatsApp
  const handleCall = (place) => {
    console.log('Tentando ligar para:', place);

    // Verificar se tem telefone
    let phoneNumber = null;

    // Verificar diferentes campos onde o telefone pode estar
    if (place.phone && place.phone !== null && place.phone !== '-') {
      phoneNumber = place.phone;
    } else if (place.formatted_phone_number) {
      phoneNumber = place.formatted_phone_number;
    } else if (place.international_phone_number) {
      phoneNumber = place.international_phone_number;
    }

    if (!phoneNumber) {
      Alert.alert('Telefone não disponível', 'Este local não possui telefone cadastrado.');
      return;
    }

    // Limpar o número de telefone removendo caracteres especiais, mas mantendo o +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    console.log('Número limpo:', cleanPhone);

    if (cleanPhone.length < 8) {
      Alert.alert('Telefone inválido', 'O número de telefone não é válido.');
      return;
    }

    // Verificar se é um número brasileiro para oferecer WhatsApp
    const isBrazilianNumber = cleanPhone.startsWith('+55') ||
      (cleanPhone.startsWith('55') && cleanPhone.length >= 12) ||
      (cleanPhone.length >= 10 && cleanPhone.length <= 11 && !cleanPhone.startsWith('+'));

    if (isBrazilianNumber) {
      // Mostrar opções: Ligar ou WhatsApp
      Alert.alert(
        'Como deseja entrar em contato?',
        `${place.name}\n${phoneNumber}`,
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: '📞 Ligar',
            onPress: () => makePhoneCall(cleanPhone)
          },
          {
            text: '💬 WhatsApp',
            onPress: () => openWhatsApp(cleanPhone)
          }
        ]
      );
    } else {
      // Apenas ligar para números não brasileiros
      makePhoneCall(cleanPhone);
    }
  };

  const makePhoneCall = (phoneNumber) => {
    const phoneUrl = `tel:${phoneNumber}`;
    console.log('URL do telefone:', phoneUrl);

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Erro', 'Não foi possível abrir o discador.');
        }
      })
      .catch((error) => {
        console.error('Erro ao tentar ligar:', error);
        Alert.alert('Erro', 'Não foi possível realizar a ligação.');
      });
  };

  const openWhatsApp = (phoneNumber) => {
    // Formatar número para WhatsApp (remover + e garantir que tenha código do país)
    let whatsappNumber = phoneNumber.replace(/\+/g, '');

    // Se for número brasileiro e não tiver código do país, adicionar
    if (whatsappNumber.length <= 11 && !whatsappNumber.startsWith('55')) {
      whatsappNumber = '55' + whatsappNumber;
    }

    const message = encodeURIComponent('Olá! Vi vocês no Trenaly e gostaria de mais informações.');
    const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${message}`;
    const whatsappWebUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    console.log('URL do WhatsApp:', whatsappUrl);

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          // Tentar abrir WhatsApp Web
          return Linking.openURL(whatsappWebUrl);
        }
      })
      .catch((error) => {
        console.error('Erro ao abrir WhatsApp:', error);
        Alert.alert('WhatsApp não disponível', 'Não foi possível abrir o WhatsApp. Tentando ligar...');
        makePhoneCall(phoneNumber);
      });
  };

  const handleRoute = (place) => {
    if (place.location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`;
      Linking.openURL(url);
    } else {
      Alert.alert('Localização não disponível', 'Não foi possível obter a localização deste local.');
    }
  };

  // Função unificada para informações (inclui avaliações)
  const handleInfo = async (place) => {
    setSelectedPlace(place);
    setInfoModalVisible(true);
    setLoadingDetails(true);

    try {
      const details = await PlacesService.getPlaceDetails(place.id);
      setPlaceDetails(details);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      setPlaceDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeInfoModal = () => {
    setInfoModalVisible(false);
    setSelectedPlace(null);
    setPlaceDetails(null);
  };

  const filters = [
    { key: 'gym', label: 'Academias', icon: 'barbell' },
    { key: 'park', label: 'Parques', icon: 'leaf' },
  ];

  const filteredPlaces = nearbyPlaces.filter(place =>
    place.name.toLowerCase().includes(searchText.toLowerCase()) ||
    place.address.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#276999', '#1e5a7a']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Locais Próximos</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={handleRefresh}>
          <Ionicons name="refresh-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar locais..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters - Agora Centralizados */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersWrapper}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterButton, selectedFilter === filter.key && styles.selectedFilter]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Ionicons
                name={filter.icon}
                size={20}
                color={selectedFilter === filter.key ? '#fff' : '#276999'}
              />
              <Text style={[styles.filterText, selectedFilter === filter.key && styles.selectedFilterText]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Status com Loading */}
        <View style={styles.locationStatus}>
          <Ionicons name="location" size={16} color="#276999" />
          {locationLoading ? (
            <View style={styles.locationLoadingContainer}>
              <ActivityIndicator size="small" color="#276999" style={styles.locationLoadingSpinner} />
              <Text style={styles.locationText}>Obtendo localização...</Text>
            </View>
          ) : (
            <Text style={styles.locationText}>
              {userLocation ? `${filteredPlaces.length} locais encontrados` : 'Localização não disponível'}
            </Text>
          )}
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#276999" />
            <Text style={styles.loadingText}>Buscando locais próximos...</Text>
          </View>
        )}

        {/* Places List */}
        {!loading && (
          <View style={styles.placesList}>
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => (
                <View key={place.id} style={styles.placeCard}>
                  <View style={styles.placeHeader}>
                    <View style={styles.placeIcon}>
                      <Ionicons
                        name={selectedFilter === 'gym' ? 'barbell' : 'leaf'}
                        size={24}
                        color="#276999"
                      />
                    </View>
                    <View style={styles.placeInfo}>
                      <Text style={styles.placeName}>{place.name}</Text>
                      <Text style={styles.placeAddress}>{place.address}</Text>
                      <View style={styles.placeDetails}>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={14} color="#ffc107" />
                          <Text style={styles.ratingText}>{place.rating}</Text>
                        </View>
                        <Text style={styles.distanceText}>{place.distance} km</Text>
                        {place.isOpen !== null && (
                          <View style={[styles.statusBadge, place.isOpen ? styles.openBadge : styles.closedBadge]}>
                            <Text style={[styles.statusText, place.isOpen ? styles.openText : styles.closedText]}>
                              {place.isOpen ? 'Aberto' : 'Fechado'}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Botões de Ação - Removido botão de Avaliações */}
                  <View style={styles.placeActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCall(place)}
                    >
                      <Ionicons name="call-outline" size={18} color="#276999" />
                      <Text style={styles.actionButtonText}>Contato</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleRoute(place)}
                    >
                      <Ionicons name="navigate-outline" size={18} color="#276999" />
                      <Text style={styles.actionButtonText}>Rota</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleInfo(place)}
                    >
                      <Ionicons name="information-circle-outline" size={18} color="#276999" />
                      <Text style={styles.actionButtonText}>Detalhes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={64} color="#ccc" />
                <Text style={styles.noResultsTitle}>Nenhum local encontrado</Text>
                <Text style={styles.noResultsText}>
                  Tente ajustar os filtros ou verificar sua localização
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Map Button */}
        {!loading && filteredPlaces.length > 0 && (
          <TouchableOpacity style={styles.mapButton}>
            <LinearGradient
              colors={['#276999', '#1e5a7a']}
              style={styles.mapButtonGradient}
            >
              <Ionicons name="map" size={24} color="#fff" />
              <Text style={styles.mapButtonText}>Ver no Mapa</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal de Informações Unificado (inclui avaliações) */}
      <Modal
        visible={infoModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeInfoModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={2}>
              {selectedPlace?.name || 'Local'}
            </Text>
            <TouchableOpacity onPress={closeInfoModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {loadingDetails ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#276999" />
                <Text style={styles.loadingText}>Carregando informações...</Text>
              </View>
            ) : (
              <>
                {/* Informações Básicas */}
                {selectedPlace && (
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>📍 Informações Gerais</Text>

                    <View style={styles.infoItem}>
                      <Ionicons name="location-outline" size={20} color="#276999" />
                      <Text style={styles.infoText}>{selectedPlace.address}</Text>
                    </View>

                    {(selectedPlace.phone || selectedPlace.formatted_phone_number) && (
                      <View style={styles.infoItem}>
                        <Ionicons name="call-outline" size={20} color="#276999" />
                        <Text style={styles.infoText}>
                          {selectedPlace.phone || selectedPlace.formatted_phone_number}
                        </Text>
                      </View>
                    )}

                    <View style={styles.infoItem}>
                      <Ionicons name="star" size={20} color="#ffc107" />
                      <Text style={styles.infoText}>
                        {selectedPlace.rating} estrelas
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Ionicons name="navigate-outline" size={20} color="#276999" />
                      <Text style={styles.infoText}>
                        {selectedPlace.distance} km de distância
                      </Text>
                    </View>

                    {selectedPlace.isOpen !== null && (
                      <View style={styles.infoItem}>
                        <Ionicons
                          name={selectedPlace.isOpen ? "time-outline" : "close-circle-outline"}
                          size={20}
                          color={selectedPlace.isOpen ? "#28a745" : "#dc3545"}
                        />
                        <Text style={[styles.infoText, {
                          color: selectedPlace.isOpen ? "#28a745" : "#dc3545"
                        }]}>
                          {selectedPlace.isOpen ? 'Aberto agora' : 'Fechado agora'}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Horário de Funcionamento */}
                {placeDetails?.opening_hours && (
                  <View style={styles.hoursSection}>
                    <Text style={styles.sectionTitle}>🕒 Horário de Funcionamento</Text>
                    <View style={styles.hoursContainer}>
                      {placeDetails.opening_hours.weekday_text?.map((day, index) => (
                        <Text key={index} style={styles.hourText}>{day}</Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Website */}
                {placeDetails?.website && (
                  <View style={styles.websiteSection}>
                    <Text style={styles.sectionTitle}>🌐 Website</Text>
                    <TouchableOpacity
                      style={styles.websiteButton}
                      onPress={() => Linking.openURL(placeDetails.website)}
                    >
                      <Ionicons name="globe-outline" size={20} color="#276999" />
                      <Text style={styles.websiteText}>Visitar site oficial</Text>
                      <Ionicons name="open-outline" size={16} color="#276999" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Seção de Avaliações Integrada */}
                <View style={styles.reviewsSection}>
                  <Text style={styles.sectionTitle}>⭐ Avaliações dos Clientes</Text>

                  {/* Resumo das Avaliações */}
                  {selectedPlace && (
                    <View style={styles.reviewsSummary}>
                      <View style={styles.ratingOverview}>
                        <View style={styles.ratingDisplay}>
                          <Text style={styles.overallRating}>{selectedPlace.rating}</Text>
                          <View style={styles.starsContainer}>
                            {[...Array(5)].map((_, i) => (
                              <Ionicons
                                key={i}
                                name={i < Math.floor(selectedPlace.rating) ? "star" : "star-outline"}
                                size={18}
                                color="#ffc107"
                              />
                            ))}
                          </View>
                        </View>
                        <Text style={styles.ratingCount}>
                          Baseado em {placeDetails?.reviews?.length || 0} avaliações
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Lista de Avaliações */}
                  <View style={styles.reviewsList}>
                    {placeDetails?.reviews && placeDetails.reviews.length > 0 ? (
                      placeDetails.reviews.slice(0, 5).map((review, index) => (
                        <View key={index} style={styles.reviewCard}>
                          <View style={styles.reviewHeader}>
                            <View style={styles.reviewAuthor}>
                              <View style={styles.authorAvatar}>
                                <Text style={styles.authorInitial}>
                                  {review.author_name.charAt(0).toUpperCase()}
                                </Text>
                              </View>
                              <View style={styles.authorInfo}>
                                <Text style={styles.authorName}>{review.author_name}</Text>
                                <Text style={styles.reviewTime}>{review.relative_time_description}</Text>
                              </View>
                            </View>
                            <View style={styles.reviewRating}>
                              {[...Array(5)].map((_, i) => (
                                <Ionicons
                                  key={i}
                                  name={i < review.rating ? "star" : "star-outline"}
                                  size={14}
                                  color="#ffc107"
                                />
                              ))}
                            </View>
                          </View>
                          {review.text && (
                            <Text style={styles.reviewText} numberOfLines={4}>
                              {review.text}
                            </Text>
                          )}
                        </View>
                      ))
                    ) : (
                      <View style={styles.noReviewsContainer}>
                        <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                        <Text style={styles.noReviewsTitle}>Nenhuma avaliação disponível</Text>
                        <Text style={styles.noReviewsText}>
                          Este local ainda não possui avaliações públicas no Google.
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Botão para ver mais avaliações */}
                  {placeDetails?.reviews && placeDetails.reviews.length > 5 && (
                    <TouchableOpacity
                      style={styles.moreReviewsButton}
                      onPress={() => {
                        const googleUrl = `https://www.google.com/maps/place/?q=place_id:${selectedPlace.id}`;
                        Linking.openURL(googleUrl);
                      }}
                    >
                      <Text style={styles.moreReviewsText}>
                        Ver todas as {placeDetails.reviews.length} avaliações no Google
                      </Text>
                      <Ionicons name="open-outline" size={16} color="#276999" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Ações Rápidas */}
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    style={[styles.quickActionButton, styles.callButton]}
                    onPress={() => {
                      closeInfoModal();
                      handleCall(selectedPlace);
                    }}
                  >
                    <Ionicons name="call" size={24} color="#fff" />
                    <Text style={styles.quickActionText}>Contato</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.quickActionButton, styles.routeButton]}
                    onPress={() => {
                      closeInfoModal();
                      handleRoute(selectedPlace);
                    }}
                  >
                    <Ionicons name="navigate" size={24} color="#fff" />
                    <Text style={styles.quickActionText}>Como Chegar</Text>
                  </TouchableOpacity>
                </View>

                {/* Espaçamento final */}
                <View style={styles.modalFooterSpace} />
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

