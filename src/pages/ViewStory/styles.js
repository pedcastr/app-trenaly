import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 10,
    gap: 4,
  },
  progressBarBackground: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  storyTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  closeButton: {
    padding: 5,
  },
  storyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: width,
    height: height * 0.7,
  },
  noContentContainer: {
    alignItems: 'center',
  },
  noContentText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  },
  leftTouchArea: {
    position: 'absolute',
    left: 0,
    top: 100,
    bottom: 100,
    width: width * 0.3,
  },
  rightTouchArea: {
    position: 'absolute',
    right: 0,
    top: 100,
    bottom: 100,
    width: width * 0.7,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 30,
  },
  actionButton: {
    padding: 10,
  },
});