// screens/OutgoingCallScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Animated,
  Easing,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function OutgoingCallScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { patientName, patientAge, patientGender, clinic, nurseName, roomName, isIncoming } = route.params;
  
  const [callState, setCallState] = useState('connecting'); // connecting, connected, ended
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [showJitsi, setShowJitsi] = useState(false);
  const [jitsiError, setJitsiError] = useState(false);
  
  const jitsiMeeting = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rippleAnims = useRef([...Array(3)].map(() => new Animated.Value(0))).current;
  const connectingDots = useRef([...Array(3)].map(() => new Animated.Value(0))).current;
  const durationInterval = useRef(null);

  // Animation for pulse rings
  useEffect(() => {
    // Pulse animation for the main avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ripple animations
    rippleAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 400),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Connecting dots animation
    const animateDots = () => {
      const animations = connectingDots.map((anim, index) => {
        return Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.loop(Animated.parallel(animations)).start();
    };

    animateDots();

    // Start connecting immediately
    setCallState('connecting');
    
    // Show Jitsi after 2 seconds (simulating connection)
    const timer = setTimeout(() => {
      setShowJitsi(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, []);

  const startCallDuration = () => {
    durationInterval.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => {
            if (jitsiMeeting.current) {
              jitsiMeeting.current.close();
            }
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // Jitsi mute control would go here if needed
  };

  const handleSpeakerToggle = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // Jitsi speaker control would go here if needed
  };

  // Jitsi event handlers
  const handleConferenceJoined = () => {
    console.log('Conference joined');
    setCallState('connected');
    startCallDuration();
  };

  const handleConferenceTerminated = () => {
    console.log('Conference terminated');
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
    navigation.goBack();
  };

  const handleReadyToClose = () => {
    console.log('Ready to close');
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
    navigation.goBack();
  };

  const handleError = (error) => {
    console.error('Jitsi error:', error);
    setJitsiError(true);
    Alert.alert(
      'Connection Error',
      'Failed to connect to the call. Please check your internet connection and try again.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  // Get avatar initials
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1B2A" />

      {/* Background gradient */}
      <View style={styles.background}>
        <View style={styles.gradientTop} />
        <View style={styles.gradientBottom} />
      </View>

      {/* Status Bar - Only time */}
      <SafeAreaView style={styles.statusBar}>
        <Text style={styles.timeText}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View style={styles.statusIcons} />
      </SafeAreaView>

      {/* Main Content - Hidden when Jitsi is active */}
      {!showJitsi && !jitsiError && (
        <View style={styles.content}>
          {/* Avatar with ripple rings */}
          <View style={styles.avatarContainer}>
            {/* Ripple rings */}
            {rippleAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.rippleRing,
                  {
                    transform: [
                      {
                        scale: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                    opacity: anim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.3, 0],
                    }),
                  },
                ]}
              />
            ))}

            {/* Outer ring with pulse */}
            <Animated.View
              style={[
                styles.outerRing,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <View style={styles.innerRing}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitials(patientName)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Call Status */}
          <Text style={styles.statusText}>
            {callState === 'connecting' ? 'CONNECTING...' : 'CONNECTED'}
          </Text>

          <Text style={styles.patientName}>{patientName}</Text>
          
          <Text style={styles.patientInfo}>
            {patientAge}{patientGender} · {clinic}
            {'\n'}
            Nurse: {nurseName} will assist
          </Text>

          {/* Connecting Status */}
          <View style={styles.connectingContainer}>
            <View style={styles.dotContainer}>
              {connectingDots.map((anim, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.connectingDot,
                    {
                      opacity: anim,
                      transform: [{
                        scale: anim.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [0.8, 1.2],
                        }),
                      }],
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.connectingText}>
              Connecting to {clinic}...
            </Text>
          </View>
        </View>
      )}

      {/* Loading Error */}
      {jitsiError && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={50} color="#FF5E5E" />
          <Text style={styles.errorText}>Failed to connect</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Jitsi Meeting View */}
      {showJitsi && !jitsiError && (
        <View style={styles.jitsiContainer}>
          <JitsiMeeting
            ref={jitsiMeeting}
            room={roomName}
            serverURL="https://meet.jit.si"
            userInfo={{
              displayName: 'Dr. Michael Smith',
              email: 'doctor@tia.com',
            }}
            config={{
              startWithAudioMuted: isMuted,
              startWithVideoMuted: false,
              enableWelcomePage: false,
              prejoinPageEnabled: false,
              toolbarButtons: [
                'microphone', 'camera', 'closedcaptions', 'desktop',
                'fullscreen', 'hangup', 'profile', 'chat', 
                'raisehand', 'settings', 'tileview', 'videoquality'
              ],
              enableClosePage: true,
              disableInviteFunctions: true,
            }}
            flags={{
              'chat.enabled': true,
              'raise-hand.enabled': true,
              'tile-view.enabled': true,
              'pip.enabled': true,
              'video-sharing.enabled': true,
              'screen-sharing.enabled': true,
            }}
            eventListeners={{
              onConferenceJoined: handleConferenceJoined,
              onConferenceTerminated: handleConferenceTerminated,
              onReadyToClose: handleReadyToClose,
              onError: handleError,
            }}
            style={styles.jitsi}
          />
        </View>
      )}

      {/* Call Controls - Always visible when not in Jitsi */}
      {!showJitsi && !jitsiError && (
        <View style={styles.controlsContainer}>
          {/* Mute Button */}
          <View style={styles.controlItem}>
            <TouchableOpacity
              style={[styles.controlCircle, isMuted && styles.activeControl]}
              onPress={handleMuteToggle}
            >
              <Icon name={isMuted ? 'mic-off' : 'mic'} size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.controlLabel}>Mute</Text>
          </View>

          {/* End/Cancel Button */}
          <View style={styles.controlItem}>
            <TouchableOpacity
              style={[styles.controlCircle, styles.endCallCircle]}
              onPress={handleEndCall}
            >
              <Icon name="phone-off" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.controlLabel}>Cancel</Text>
          </View>

          {/* Speaker Button */}
          <View style={styles.controlItem}>
            <TouchableOpacity
              style={[styles.controlCircle, isSpeakerOn && styles.activeControl]}
              onPress={handleSpeakerToggle}
            >
              <Icon name={isSpeakerOn ? 'speaker' : 'volume-2'} size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.controlLabel}>Speaker</Text>
          </View>
        </View>
      )}

      {/* Call Duration (when connected in Jitsi) */}
      {callState === 'connected' && showJitsi && (
        <View style={styles.durationContainer}>
          <Icon name="clock" size={16} color="#00A8E8" />
          <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1B2A',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#123456',
    opacity: 0.3,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#071C2D',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 5,
    width: 30,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  rippleRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#00A8E8',
    backgroundColor: 'transparent',
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,168,232,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(0,168,232,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#00A8E8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00A8E8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#00A8E8',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 15,
  },
  patientName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  patientInfo: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  connectingContainer: {
    alignItems: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  connectingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00A8E8',
    marginHorizontal: 5,
  },
  connectingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  controlItem: {
    alignItems: 'center',
  },
  controlCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  endCallCircle: {
    backgroundColor: '#ff4444',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  activeControl: {
    backgroundColor: 'rgba(0,168,232,0.5)',
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  jitsiContainer: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
  },
  jitsi: {
    flex: 1,
  },
  durationContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  durationText: {
    color: '#00A8E8',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#00A8E8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
