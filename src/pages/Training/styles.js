import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header Styles
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  headerLeft: {
    flex: 1,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  // Workout Type Indicator
  workoutTypeIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  
  typeIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Calendar Styles
  daySelector: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  
  daysContainer: {
    paddingHorizontal: 20,
  },
  
  dayButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 60,
    position: 'relative',
  },
  
  selectedDayButton: {
    backgroundColor: '#276999',
  },
  
  todayDayButton: {
    borderWidth: 2,
    borderColor: '#ffc107',
  },
  
  dayStatusContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  
  dayStatusIcon: {
    // Positioned absolutely
  },
  
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  
  selectedDayText: {
    color: '#fff',
  },
  
  todayDayText: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  
  selectedDayNumber: {
    color: '#fff',
  },
  
  todayDayNumber: {
    color: '#ffc107',
  },

  // Web Calendar Styles
  webCalendarContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  
  webCalendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  
  webDayButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 80,
    position: 'relative',
  },
  
  selectedWebDayButton: {
    backgroundColor: '#276999',
  },
  
  todayWebDayButton: {
    borderWidth: 2,
    borderColor: '#ffc107',
  },
  
  webDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  
  selectedWebDayText: {
    color: '#fff',
  },
  
  todayWebDayText: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  
  webDayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  
  selectedWebDayNumber: {
    color: '#fff',
  },
  
  todayWebDayNumber: {
    color: '#ffc107',
  },

  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  workoutHeader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  
  workoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },

  // Exercise List Styles
  exercisesList: {
    paddingBottom: 20,
  },
  
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  
  completedCard: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#276999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  completedNumber: {
    backgroundColor: '#28a745',
  },
  
  exerciseNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  
  exerciseNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  
    completedText: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  
  customBadge: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  
  customBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  
  exerciseSets: {
    fontSize: 14,
    fontWeight: '600',
    color: '#276999',
    marginRight: 12,
  },
  
  exerciseRest: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  
  exerciseMuscle: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '500',
  },
  
  videoButton: {
    padding: 4,
  },
  
  exerciseActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
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
  
  completedActionButton: {
    backgroundColor: '#28a745',
  },
  
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#276999',
    marginLeft: 4,
  },

  // Rest Day Styles
  restDay: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  
  restDayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  
  restDayText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },

  // Add Exercise Button
  addExerciseButton: {
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  addExerciseGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  
  addExerciseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // Workout Type Modal
  workoutTypeModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  
  workoutTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  selectedWorkoutTypeOption: {
    borderColor: '#276999',
    backgroundColor: '#e3f2fd',
  },
  
  workoutTypeOptionText: {
    marginLeft: 16,
    flex: 1,
  },
  
  workoutTypeOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  
  workoutTypeOptionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },

  // Level Modal
  levelModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  
  levelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  selectedLevelOption: {
    borderColor: '#276999',
    backgroundColor: '#e3f2fd',
  },
  
  levelOptionText: {
    marginLeft: 16,
    flex: 1,
  },
  
  levelOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  
  levelOptionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },

  // Cancel Button
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },

  // Timer Modal
  timerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  timerModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 280,
  },
  
  timerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  
  timerTime: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#276999',
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 4,
  },
  
  stopButton: {
    backgroundColor: '#dc3545',
  },
  
  timerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#276999',
    marginLeft: 4,
  },
  
  timerProgress: {
    width: '100%',
    alignItems: 'center',
  },
  
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 3,
  },
  
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // Video Modal
  videoModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  videoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  
  videoModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 15,
  },
  
  closeButton: {
    padding: 4,
  },
  
  videoContainer: {
    backgroundColor: '#000',
  },
  
  videoInfo: {
    flex: 1,
    padding: 20,
  },
  
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  
  videoChannel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  
  videoActions: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  
  videoActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginRight: 12,
  },
  
  videoActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#276999',
    marginLeft: 6,
  },
  
  videoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // Calendar Modal
  calendarModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  calendarModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  
  calendarModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  
  calendarContent: {
    flex: 1,
    padding: 20,
  },
  
  weekSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  
  weekSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  summaryStatItem: {
    alignItems: 'center',
  },
  
  summaryStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#276999',
    marginBottom: 4,
  },
  
  summaryStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  calendarDayItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  
  calendarDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  calendarDayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  calendarDayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  
  todayLabel: {
    backgroundColor: '#ffc107',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  
  calendarDayStatus: {
    // Icon container
  },
  
  calendarWorkoutTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  
  progressInfo: {
    // Progress container
  },
  
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  progressPercentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    fontWeight: '500',
  },

  // Edit Modal
  editModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  editModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  
  editModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  
  editContent: {
    flex: 1,
    padding: 20,
  },
  
  inputGroup: {
    marginBottom: 20,
  },
  
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  
  cancelModalButton: {
    flex: 1,
        paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#fff',
    marginRight: 10,
    alignItems: 'center',
  },
  
  cancelModalButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#276999',
    marginLeft: 10,
    alignItems: 'center',
  },
  
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },

  // Responsive Design for Web
  ...Platform.select({
    web: {
      container: {
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
      },
      
      exerciseCard: {
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
      
      addExerciseButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },
      
      videoActionButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      },
      
      timerButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      },
      
      dayButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      },
      
      webDayButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      },
      
      headerButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
      },
      
      workoutTypeOption: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#f1f3f4',
        },
      },
      
      levelOption: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#f1f3f4',
        },
      },
      
      calendarDayItem: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#f8f9fa',
          borderColor: '#276999',
        },
      },
      
      textInput: {
        outline: 'none',
        '&:focus': {
          borderColor: '#276999',
          boxShadow: '0 0 0 2px rgba(39, 105, 153, 0.2)',
        },
      },
      
      saveButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#1e5a7a',
        },
      },
      
      cancelModalButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#f8f9fa',
        },
      },
      
      cancelButton: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
      },
      
      closeButton: {
        cursor: 'pointer',
        borderRadius: 20,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#f8f9fa',
        },
      },
      
      videoButton: {
        cursor: 'pointer',
        borderRadius: 20,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(39, 105, 153, 0.1)',
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
      
      exerciseCard: {
        backgroundColor: '#2d2d2d',
        borderColor: '#404040',
      },
      
      workoutTitle: {
        color: '#fff',
      },
      
      exerciseName: {
        color: '#fff',
      },
      
      statText: {
        color: '#ccc',
      },
      
      dayText: {
        color: '#ccc',
      },
      
      dayNumber: {
        color: '#fff',
      },
      
      restDayTitle: {
        color: '#ccc',
      },
      
      restDayText: {
        color: '#999',
      },
      
      modalTitle: {
        color: '#fff',
      },
      
      workoutTypeModal: {
        backgroundColor: '#2d2d2d',
      },
      
      levelModal: {
        backgroundColor: '#2d2d2d',
      },
      
      timerModal: {
        backgroundColor: '#2d2d2d',
      },
      
      videoModal: {
        backgroundColor: '#1a1a1a',
      },
      
      calendarModal: {
        backgroundColor: '#1a1a1a',
      },
      
      editModal: {
        backgroundColor: '#1a1a1a',
      },
      
      textInput: {
        backgroundColor: '#2d2d2d',
        borderColor: '#404040',
        color: '#fff',
      },
      
      inputLabel: {
        color: '#fff',
      },
      
      videoTitle: {
        color: '#fff',
      },
      
      calendarModalTitle: {
        color: '#fff',
      },
      
      editModalTitle: {
        color: '#fff',
      },
      
      videoModalTitle: {
        color: '#fff',
      },
    },
  }),

  // Accessibility Improvements
  exerciseCardAccessible: {
    accessibilityRole: 'button',
    accessibilityHint: 'Toque duas vezes para ver detalhes do exercício',
  },
  
  actionButtonAccessible: {
    accessibilityRole: 'button',
    accessibilityHint: 'Toque para executar ação',
  },
  
  dayButtonAccessible: {
    accessibilityRole: 'button',
    accessibilityHint: 'Toque para selecionar este dia',
  },
  
  videoButtonAccessible: {
    accessibilityRole: 'button',
    accessibilityHint: 'Toque para assistir vídeo demonstrativo',
  },
  
  timerButtonAccessible: {
    accessibilityRole: 'button',
    accessibilityHint: 'Toque para controlar o timer',
  },

  // Animation Support
  fadeIn: {
    opacity: 0,
    animation: Platform.OS === 'web' ? 'fadeIn 0.3s ease-in-out forwards' : undefined,
  },
  
  slideUp: {
    transform: Platform.OS === 'web' ? [{ translateY: 20 }] : undefined,
    animation: Platform.OS === 'web' ? 'slideUp 0.3s ease-out forwards' : undefined,
  },
  
  scaleIn: {
    transform: Platform.OS === 'web' ? [{ scale: 0.95 }] : undefined,
    animation: Platform.OS === 'web' ? 'scaleIn 0.2s ease-out forwards' : undefined,
  },

  // Print Styles (para web)
  '@media print': Platform.select({
    web: {
      container: {
        backgroundColor: '#fff',
      },
      
      header: {
        backgroundColor: '#fff',
        color: '#000',
      },
      
      headerTitle: {
        color: '#000',
      },
      
      headerSubtitle: {
        color: '#666',
      },
      
      exerciseCard: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        boxShadow: 'none',
        pageBreakInside: 'avoid',
      },
      
      videoButton: {
        display: 'none',
      },
      
      exerciseActions: {
        display: 'none',
      },
      
      addExerciseButton: {
        display: 'none',
      },
    },
  }),
});

// CSS Animations for Web
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px); 
      }
      to { 
        opacity: 1;
        transform: translateY(0); 
      }
    }
    
    @keyframes scaleIn {
      from { 
        opacity: 0;
        transform: scale(0.95); 
      }
      to { 
        opacity: 1;
        transform: scale(1); 
      }
    }
    
    @keyframes pulse {
      0%, 100% { 
        transform: scale(1); 
      }
      50% { 
        transform: scale(1.05); 
      }
    }
    
    .pulse-animation {
      animation: pulse 2s infinite;
    }
    
    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #276999;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #1e5a7a;
    }
  `;
  document.head.appendChild(style);
}


