import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  Platform,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/Feather";

export default function CallScreen({ route, navigation }) {
  // Get all parameters passed from MyPatientsScreen or DoctorDashboard
  const {
    roomName,
    userName = "Doctor",
    patientName = "Patient",
    patientId,
    jitsiConfig = {},
    // You can add more parameters as needed
  } = route.params || {};

  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate roomName
  useEffect(() => {
    if (!roomName) {
      setError("No room name provided");
      Alert.alert("Error", "Invalid room configuration", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }
  }, []);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        confirmEndCall();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  // Confirm end call
  const confirmEndCall = () => {
    Alert.alert(
      "End Call",
      "Are you sure you want to end this consultation?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "End Call", onPress: () => navigation.goBack(), style: "destructive" }
      ]
    );
  };

  // Generate Jitsi HTML with all configurations
  const generateJitsiHTML = () => {
    // Default Jitsi config
    const defaultConfig = {
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      enableWelcomePage: false,
      prejoinPageEnabled: false,
      enableClosePage: false,
      ...jitsiConfig
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <script src='https://meet.jit.si/external_api.js'></script>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              overflow: hidden;
              background-color: #0E2A47;
            }
            #meet { 
              height: 100vh; 
              width: 100vw; 
            }
            .loading {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div id="meet"></div>
          <script>
            const domain = "meet.jit.si";
            
            // Get device type
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            const options = {
              roomName: "${roomName}",
              width: "100%",
              height: "100%",
              parentNode: document.querySelector('#meet'),
              
              // User info
              userInfo: {
                displayName: "${userName}",
                email: "doctor@hospital.com",
              },
              
              // Jitsi configuration
              configOverwrite: {
                startWithAudioMuted: ${defaultConfig.startWithAudioMuted},
                startWithVideoMuted: ${defaultConfig.startWithVideoMuted},
                enableWelcomePage: ${defaultConfig.enableWelcomePage},
                prejoinPageEnabled: ${defaultConfig.prejoinPageEnabled},
                enableClosePage: ${defaultConfig.enableClosePage},
                
                // Mobile optimizations
                disableDeepLinking: isMobile,
                disableInviteFunctions: true,
                
                // Recording and sharing settings
                fileRecordingsEnabled: false,
                liveStreamingEnabled: false,
                
                // UI settings
                enableUserRolesBasedOnToken: false,
                enableFeaturesBasedOnToken: false,
                
                // Performance settings
                disableAudioLevels: true,
                enableLayerSuspension: true,
                
                // Custom settings
                "p2p.enabled": true,
                "requireDisplayName": false,
              },
              
              // Interface configuration
              interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                  'microphone', 'camera', 'closedcaptions', 'desktop', 
                  'fullscreen', 'fodeviceselection', 'hangup', 'profile', 
                  'chat', 'recording', 'livestreaming', 'etherpad', 
                  'sharedvideo', 'settings', 'raisehand', 'videoquality', 
                  'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                  'tileview', 'videobackgroundblur', 'download', 'help'
                ],
                
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                SHOW_BRAND_WATERMARK: false,
                
                DEFAULT_BACKGROUND: '#0E2A47',
                
                // Mobile specific
                MOBILE_APP_PROMO: false,
                
                // UI text
                DEFAULT_LOGO_URL: null,
                HIDE_INVITE_MORE_HEADER: true,
                
                // Initial view
                INITIAL_TOOLBAR_TIMEOUT: 2000,
                TOOLBAR_TIMEOUT: 4000,
                
                // Filmstrip settings
                filmStripOnly: false,
                SHOW_FILMSTRIP: true,
                
                // Connection settings
                CONNECTION_INDICATOR_DISABLED: false,
              },
              
              // Room specific settings
              devices: {
                audioInput: true,
                audioOutput: true,
                videoInput: true,
              }
            };
            
            // Create Jitsi API instance
            const api = new JitsiMeetExternalAPI(domain, options);
            
            // Log success
            console.log('Jitsi Meet API initialized');
            
            // Handle events
            api.addEventListener('readyToClose', () => {
              window.ReactNativeWebView.postMessage('HANGUP');
            });
            
            api.addEventListener('participantJoined', (participant) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'participantJoined',
                participant: participant
              }));
            });
            
            api.addEventListener('participantLeft', (participant) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'participantLeft',
                participant: participant
              }));
            });
            
            api.addEventListener('videoConferenceJoined', () => {
              window.ReactNativeWebView.postMessage('CONFERENCE_JOINED');
            });
            
            api.addEventListener('error', (error) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                error: error
              }));
            });
            
            // Notify that API is ready
            window.ReactNativeWebView.postMessage('API_READY');
            
          </script>
        </body>
      </html>
    `;
  };

  // Handle messages from WebView
  const handleMessage = (event) => {
    try {
      const data = event.nativeEvent.data;
      
      if (data === 'HANGUP') {
        confirmEndCall();
      } 
      else if (data === 'API_READY') {
        setIsLoading(false);
        setError(null);
      }
      else if (data === 'CONFERENCE_JOINED') {
        setIsLoading(false);
        setError(null);
      }
      else {
        // Try to parse JSON messages
        try {
          const parsed = JSON.parse(data);
          console.log('Jitsi event:', parsed);
          
          if (parsed.type === 'error') {
            setError('Connection error');
            Alert.alert('Error', 'Failed to connect to video call');
          }
        } catch (e) {
          // Not JSON, ignore
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  // Handle navigation errors
  const handleNavigationStateChange = (navState) => {
    // Check for errors
    if (navState.error) {
      setError('Failed to load video call');
    }
  };

  // Handle load error
  const handleLoadError = (error) => {
    console.error('WebView load error:', error);
    setError('Failed to load video call');
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={50} color="#ff4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setIsLoading(true);
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4DD9FF" />
          <Text style={styles.loadingText}>
            Connecting to {patientName}...
          </Text>
          <Text style={styles.loadingSubText}>
            Room: {roomName}
          </Text>
        </View>
      )}

      {/* Jitsi WebView */}
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: generateJitsiHTML() }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={false}
        onMessage={handleMessage}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => {
          // Don't set loading false here, wait for API_READY
        }}
        onError={handleLoadError}
        onNavigationStateChange={handleNavigationStateChange}
        style={styles.webview}
      />

      {/* Call Info Overlay (optional) */}
      <View style={styles.callInfoOverlay}>
        <View style={styles.callInfoContainer}>
          <Icon name="video" size={16} color="#4DD9FF" />
          <Text style={styles.callInfoText}>
            Consultation with {patientName}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2A47",
  },
  webview: {
    flex: 1,
    backgroundColor: "#0E2A47",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E2A47",
    zIndex: 10,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
  loadingSubText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E2A47",
    padding: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#4DD9FF",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#0E2A47",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  closeText: {
    color: "rgba(255,255,255,0.7)",
  },
  callInfoOverlay: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  callInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callInfoText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
});
