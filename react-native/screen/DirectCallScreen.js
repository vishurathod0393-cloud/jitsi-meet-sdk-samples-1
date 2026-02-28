// screens/DirectCallScreen.js
import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function DirectCallScreen({ route }) {
  const navigation = useNavigation();
  const { roomName, patientName, doctorName } = route.params;
  const jitsiMeeting = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReadyToClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleConferenceJoined = useCallback(() => {
    setIsLoading(false);
    console.log('Conference joined successfully');
  }, []);

  const handleConferenceTerminated = useCallback(() => {
    console.log('Conference terminated');
    navigation.goBack();
  }, [navigation]);

  const handleParticipantJoined = useCallback(() => {
    console.log('Participant joined');
  }, []);

  const handleParticipantLeft = useCallback(() => {
    console.log('Participant left');
  }, []);

  const handleError = useCallback((error) => {
    console.error('Jitsi error:', error);
    Alert.alert(
      'Connection Error',
      'Failed to connect to the meeting. Please try again.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }, [navigation]);

  const eventListeners = {
    onReadyToClose: handleReadyToClose,
    onConferenceJoined: handleConferenceJoined,
    onConferenceTerminated: handleConferenceTerminated,
    onParticipantJoined: handleParticipantJoined,
    onParticipantLeft: handleParticipantLeft,
    onError: handleError,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#00A8E8" />
            <Text style={styles.loadingText}>Connecting to {patientName}...</Text>
            <Text style={styles.loadingSubText}>Setting up secure video call</Text>
            <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
          </View>
        </View>
      )}

      {/* Custom Header (visible during loading) */}
      {isLoading && (
        <SafeAreaView style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                Alert.alert(
                  'End Call',
                  'Are you sure you want to end this call?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'End Call', style: 'destructive', onPress: () => navigation.goBack() }
                  ]
                );
              }}
            >
              <Icon name="x" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Text style={styles.patientName}>{patientName}</Text>
              <Text style={styles.doctorName}>{doctorName || 'Dr. Michael Smith'}</Text>
            </View>
            
            <View style={styles.duration}>
              <Icon name="clock" size={16} color="#fff" />
              <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
            </View>
          </View>
        </SafeAreaView>
      )}

      {/* Jitsi Meeting */}
      <JitsiMeeting
        ref={jitsiMeeting}
        style={styles.jitsiContainer}
        room={roomName}
        serverURL="https://meet.jit.si"
        userInfo={{
          displayName: doctorName || 'Dr. Michael Smith',
          email: 'doctor@tia.com',
          avatar: 'https://example.com/avatar.png', // Optional
        }}
        config={{
          // Feature flags
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          enableClosePage: true,
          prejoinPageEnabled: false,
          disableInviteFunctions: true,
          enableEmailInStats: false,
          
          // UI Customization
          toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop',
            'fullscreen', 'fodeviceselection', 'hangup',
            'profile', 'chat', 'raisehand', 'settings',
            'tileview', 'videoquality', 'pip'
          ],
          
          // Conference settings
          disableTileView: false,
          enableCalendarIntegration: false,
          enableP2P: true,
          enableTalkWhileMuted: true,
          requireDisplayName: true,
        }}
        flags={{
          'video-sharing.enabled': true,
          'audio-mute.enabled': true,
          'video-mute.enabled': true,
          'chat.enabled': true,
          'raise-hand.enabled': true,
          'recording.enabled': false,
          'live-streaming.enabled': false,
          'screen-sharing.enabled': true,
          'fullscreen.enabled': true,
          'pip.enabled': true,
          'tile-view.enabled': true,
          'toolbox.enabled': true,
          'welcome-page.enabled': false,
          'invite.enabled': false,
        }}
        eventListeners={eventListeners}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1B2A',
  },
  jitsiContainer: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A1B2A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  loadingSubText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 10,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
    backgroundColor: 'rgba(10,27,42,0.9)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  patientName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  doctorName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  durationText: {
    color: '#00A8E8',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
});
