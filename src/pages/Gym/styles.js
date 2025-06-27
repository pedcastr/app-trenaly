import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  headerIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },

  // Filters - Agora Centralizados
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center', // Centralizar
  },

  filtersWrapper: {
    flexDirection: 'row',
    justifyContent: 'center', // Centralizar os botões
    alignItems: 'center',
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 8, // Espaçamento entre botões
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedFilter: {
    backgroundColor: '#276999',
    borderColor: '#276999',
  },

  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#276999',
    marginLeft: 8,
  },

  selectedFilterText: {
    color: '#fff',
  },

  // Content
  content: {
    flex: 1,
  },

  // Location Status com Loading
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  locationLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  locationLoadingSpinner: {
    marginRight: 8,
  },

  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },

  // Places List
  placesList: {
    padding: 20,
  },

  placeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  placeHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  placeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  placeInfo: {
    flex: 1,
  },

  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  placeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },

  placeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },

  distanceText: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  openBadge: {
    backgroundColor: '#d4edda',
  },

  closedBadge: {
    backgroundColor: '#f8d7da',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },

  openText: {
    color: '#155724',
  },

  closedText: {
    color: '#721c24',
  },

  // Place Actions
  placeActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },

  actionButtonText: {
    fontSize: 12,
    color: '#276999',
    fontWeight: '500',
    marginLeft: 4,
  },

  // No Results
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },

  noResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },

  noResultsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  // Map Button
  mapButton: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },

  mapButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },

  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#fff',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 15,
  },

  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },

  modalContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Info Section
  infoSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },

  // Hours Section
  hoursSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  hoursContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },

  hourText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    paddingVertical: 2,
  },

  // Website Section
  websiteSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  websiteText: {
    fontSize: 14,
    color: '#276999',
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
  },

  // Reviews Section
  reviewsSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  reviewsSummary: {
    marginBottom: 20,
  },

  ratingOverview: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },

  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  overallRating: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#276999',
    marginRight: 12,
  },

  starsContainer: {
    flexDirection: 'row',
  },

  ratingCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // Reviews List
  reviewsList: {
    marginTop: 10,
  },

  reviewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  reviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#276999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  authorInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  authorInfo: {
    flex: 1,
  },

  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },

  reviewTime: {
    fontSize: 12,
    color: '#999',
  },

  reviewRating: {
    flexDirection: 'row',
    marginLeft: 12,
  },

  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 8,
  },

  // No Reviews
  noReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  noReviewsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },

  noReviewsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // More Reviews Button
  moreReviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#276999',
    marginTop: 15,
  },

  moreReviewsText: {
    fontSize: 14,
    color: '#276999',
    fontWeight: '500',
    marginRight: 8,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    margin: 15,
    marginTop: 0,
    gap: 10,
  },

  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  callButton: {
    backgroundColor: '#28a745',
  },

  routeButton: {
    backgroundColor: '#276999',
  },

  quickActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Modal Footer Space
  modalFooterSpace: {
    height: 20,
  },

  // Responsive Design for Web
  ...Platform.select({
    web: {
      container: {
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
      },

      placeCard: {
        cursor: 'default',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        },
      },

      actionButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      },

      filterButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      },

      selectedFilter: {
        '&:hover': {
          backgroundColor: '#1e5a7a',
        },
      },

      mapButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },

      quickActionButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },

      callButton: {
        '&:hover': {
          backgroundColor: '#218838',
        },
      },

      routeButton: {
        '&:hover': {
          backgroundColor: '#1e5a7a',
        },
      },

      websiteButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#e9ecef',
          borderColor: '#276999',
        },
      },

      moreReviewsButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      },

      closeButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      },
    },
  }),

  // Dark Mode Support
  '@media (prefers-color-scheme: dark)': Platform.select({
    web: {
      container: {
        backgroundColor: '#1a1a1a',
      },

      placeCard: {
        backgroundColor: '#2d2d2d',
        borderColor: '#404040',
      },

      modalContainer: {
        backgroundColor: '#1a1a1a',
      },

      modalHeader: {
        backgroundColor: '#2d2d2d',
        borderBottomColor: '#404040',
      },

      modalContent: {
        backgroundColor: '#1a1a1a',
      },

      infoSection: {
        backgroundColor: '#2d2d2d',
      },

      hoursSection: {
        backgroundColor: '#2d2d2d',
      },

      websiteSection: {
        backgroundColor: '#2d2d2d',
      },

      reviewsSection: {
        backgroundColor: '#2d2d2d',
      },

      searchContainer: {
        backgroundColor: '#2d2d2d',
        borderBottomColor: '#404040',
      },

      searchBar: {
        backgroundColor: '#404040',
      },

      filtersContainer: {
        backgroundColor: '#2d2d2d',
        borderBottomColor: '#404040',
      },

      locationStatus: {
        backgroundColor: '#2d2d2d',
        borderBottomColor: '#404040',
      },

      placeName: {
        color: '#fff',
      },

      modalTitle: {
        color: '#fff',
      },

      sectionTitle: {
        color: '#fff',
      },

      authorName: {
        color: '#fff',
      },

      reviewText: {
        color: '#ccc',
      },

      infoText: {
        color: '#ccc',
      },

      locationText: {
        color: '#ccc',
      },

      loadingText: {
        color: '#ccc',
      },

      noResultsTitle: {
        color: '#ccc',
      },

      noResultsText: {
        color: '#999',
      },

      noReviewsTitle: {
        color: '#ccc',
      },

      noReviewsText: {
        color: '#999',
      },

      hourText: {
        color: '#ccc',
      },

      ratingCount: {
        color: '#ccc',
      },

      reviewTime: {
        color: '#999',
      },

      placeAddress: {
        color: '#ccc',
      },

      distanceText: {
        color: '#ccc',
      },

      ratingText: {
        color: '#fff',
      },

      websiteText: {
        color: '#4a9eff',
      },

      moreReviewsText: {
        color: '#4a9eff',
      },

      actionButtonText: {
        color: '#4a9eff',
      },

      filterText: {
        color: '#4a9eff',
      },

      hoursContainer: {
        backgroundColor: '#404040',
      },

      reviewCard: {
        backgroundColor: '#404040',
        borderColor: '#555',
      },

      reviewsSummary: {
        backgroundColor: '#404040',
      },

      ratingOverview: {
        backgroundColor: '#404040',
      },

      websiteButton: {
        backgroundColor: '#404040',
        borderColor: '#555',
      },

      moreReviewsButton: {
        backgroundColor: '#404040',
        borderColor: '#4a9eff',
      },

      actionButton: {
        backgroundColor: '#404040',
      },

      filterButton: {
        backgroundColor: '#404040',
      },

      closeButton: {
        backgroundColor: '#404040',
      },

      placeIcon: {
        backgroundColor: '#404040',
      },

      authorAvatar: {
        backgroundColor: '#4a9eff',
      },

      overallRating: {
        color: '#4a9eff',
      },
    },
  }),
});


