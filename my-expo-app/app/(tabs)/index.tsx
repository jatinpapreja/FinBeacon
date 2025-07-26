import { Feather } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import FinancialHealthScore from "@/components/FinancialHealthScore";

// Main Navigation Component
export default function HomeScreen() {
  // Keep track of selected tab by its key/id
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const router = useRouter();

  // Voice Assistant State
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcriptionResult, setTranscriptionResult] = useState("");
  const [showTranscription, setShowTranscription] = useState(false);
  const [showSiriAnimation, setShowSiriAnimation] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showSpeakerAnimation, setShowSpeakerAnimation] = useState(false);

  // Audio recording refs
  const recording = useRef<Audio.Recording | null>(null);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const siriWaveAnimation = useRef(new Animated.Value(0)).current;
  const speakerAnimation = useRef(new Animated.Value(0)).current;

  // Voice Assistant Functions

  /**
   * Request microphone permissions and handle permission errors
   */
  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Microphone Access Required",
          "Please allow microphone access to use voice assistant.",
          [{ text: "OK" }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Permission request error:", error);
      Alert.alert("Error", "Failed to request microphone permission.");
      return false;
    }
  };

  /**
   * Configure audio recording settings for optimal speech-to-text
   * Uses pure WAV format across all platforms for best compatibility
   */
  const getRecordingOptions = (): Audio.RecordingOptions => ({
    android: {
      extension: ".wav",
      outputFormat: Audio.AndroidOutputFormat.DEFAULT,
      audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
      sampleRate: 44100, // High quality sample rate
      numberOfChannels: 1,
      bitRate: 128000, // Higher bitrate for better quality
    },
    ios: {
      extension: ".wav",
      audioQuality: Audio.IOSAudioQuality.HIGH, // Highest quality setting
      sampleRate: 44100, // High quality sample rate
      numberOfChannels: 1,
      bitRate: 128000, // Higher bitrate for better quality
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: "audio/wav",
      bitsPerSecond: 128000, // Higher bitrate for better quality
    },
  });

  /**
   * Start pulse animation for recording indicator
   */
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  /**
   * Stop pulse animation
   */
  const stopPulseAnimation = () => {
    Animated.timing(pulseAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Start Siri-like wave animation
   */
  const startSiriAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(siriWaveAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(siriWaveAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  /**
   * Stop Siri-like wave animation
   */
  const stopSiriAnimation = () => {
    Animated.timing(siriWaveAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Start speaker animation for audio playback
   */
  const startSpeakerAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(speakerAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(speakerAnimation, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  /**
   * Stop speaker animation
   */
  const stopSpeakerAnimation = () => {
    Animated.timing(speakerAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Start recording timer
   */
  const startRecordingTimer = () => {
    setRecordingDuration(0);
    recordingTimer.current = setInterval(() => {
      setRecordingDuration((prev: number) => prev + 1);
    }, 1000);
  };

  /**
   * Stop recording timer
   */
  const stopRecordingTimer = () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }
  };

  /**
   * Format recording duration for display
   */
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /**
   * Open voice assistant modal with initial prompt
   */
  const openVoiceAssistant = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    setSelectedTab("voice");
    setIsVoiceModalVisible(true);

    // Show Siri-like animation instead of alert
    setShowSiriAnimation(true);
    startSiriAnimation();

    // Auto-start recording after a brief moment
    setTimeout(() => {
      startRecording();
    }, 1500);
  };

  /**
   * Start audio recording with error handling
   */
  const startRecording = async () => {
    try {
      // Hide Siri animation and show recording UI
      setShowSiriAnimation(false);
      stopSiriAnimation();

      setIsRecording(true);
      setRecordingDuration(0);

      // Haptic feedback for recording start
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Configure audio mode for recording with high quality settings
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });

      // Create and start recording with high quality configuration
      const { recording: newRecording } = await Audio.Recording.createAsync(
        getRecordingOptions()
      );

      recording.current = newRecording;
      startPulseAnimation();
      startRecordingTimer();
    } catch (error) {
      console.error("Failed to start recording:", error);
      setIsRecording(false);
      setShowSiriAnimation(false);
      stopSiriAnimation();
      Alert.alert(
        "Recording Error",
        "Failed to start recording. Please try again."
      );
    }
  };

  /**
   * Stop recording and process audio
   */
  const stopRecording = async () => {
    try {
      if (!recording.current) return;

      setIsRecording(false);
      stopPulseAnimation();
      stopRecordingTimer();
      setIsProcessing(true);

      // Haptic feedback for recording stop
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Stop and get recording URI
      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();

      // Get recording status for debugging
      const status = await recording.current.getStatusAsync();
      console.log("Recording status:", status);

      recording.current = null;

      if (!uri) {
        throw new Error("No recording URI available");
      }

      console.log("Recording URI:", uri);
      console.log("Pure WAV format: 44.1kHz uncompressed audio");

      // Process the recorded audio
      await processAudioFile(uri);
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setIsProcessing(false);
      Alert.alert(
        "Recording Error",
        "Failed to process recording. Please try again."
      );
    }
  };

  /**
   * Send audio file to REST API and handle response
   */
  const processAudioFile = async (audioUri: string) => {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("audio", {
        uri: audioUri,
        type: "audio/wav",
        name: "audio.wav",
      } as any);

      console.log("Sending audio file to API...");
      console.log("Audio URI:", audioUri);
      console.log("Pure WAV format: 44.1kHz uncompressed audio");

      // Send to speech-to-text API
      const response = await fetch(
        "https://speech-app-774799025602.europe-west1.run.app/speech-to-text",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            // Note: Don't set Content-Type for FormData, let the browser set it with boundary
          },
        }
      );

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      const transcription =
        result?.transcription ||
        result?.text ||
        result?.transcript ||
        "No transcription available";

      setTranscriptionResult(transcription);

      // Generate AI response from transcription (don't show transcription modal)
      if (transcription && transcription !== "No transcription available") {
        await generateAIResponse(transcription);
      } else {
        // Close the modal if no valid transcription
        setTimeout(() => {
          closeVoiceAssistant();
        }, 1500);
      }

      // Haptic feedback for successful processing
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("API processing error:", error);
      Alert.alert(
        "Processing Error",
        "Failed to process your voice input. Please check your internet connection and try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Generate AI response from transcription text
   */
  const generateAIResponse = async (transcriptionText: string) => {
    let textToPlay = "";

    try {
      setIsGeneratingResponse(true);
      console.log("Generating AI response for:", transcriptionText);

      const requestBody = {
        prompt: transcriptionText,
        temperature: 0.7,
        maxOutputTokens: 1000,
        responseType: "text",
      };

      const response = await fetch(
        "https://elevate-backend-hllhni53va-uc.a.run.app/api/generate-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("AI Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI API Error Response:", errorText);
        throw new Error(
          `AI API Error: ${response.status} ${response.statusText}`
        );
      }

      const aiResult = await response.json();
      console.log("AI Response:", aiResult);

      // Extract text from data.generatedText node
      const responseText = aiResult?.data?.generatedText || "";

      // If no text available, use fallback message
      textToPlay = responseText.trim() || "I don't have anything to suggest";

      setAiResponse(textToPlay);
    } catch (error) {
      console.error("AI response generation error:", error);
      Alert.alert(
        "AI Response Error",
        "Failed to generate AI response. Please try again."
      );
      closeVoiceAssistant();
      return; // Exit early on error
    } finally {
      setIsGeneratingResponse(false);
    }

    // Convert AI response to speech with speaker animation (outside try-catch to ensure state is updated)
    try {
      // Small delay to ensure state updates are processed
      setTimeout(async () => {
        await playTextAsAudio(textToPlay);
      }, 100);
    } catch (error) {
      console.error("Text-to-speech error:", error);
      closeVoiceAssistant();
    }
  };

  /**
   * Convert text to speech and play audio with speaker animation
   */
  const playTextAsAudio = async (text: string) => {
    try {
      setIsPlayingAudio(true);
      setShowSpeakerAnimation(true);
      startSpeakerAnimation();

      console.log("Converting text to speech:", text);

      // Configure speech options
      const speechOptions = {
        language: "en-US",
        pitch: 1.0,
        rate: 0.8, // Slightly slower for better comprehension
        voice: undefined, // Use default voice
      };

      // Use Expo Speech to convert text to audio
      Speech.speak(text, {
        ...speechOptions,
        onStart: () => {
          console.log("Speech started");
          // Animation is already started above
        },
        onDone: () => {
          console.log("Speech completed successfully");
          // Clean up and close modal
          setTimeout(() => {
            closeVoiceAssistant();
          }, 500);
        },
        onError: (error) => {
          console.error("Speech error:", error);
          Alert.alert("Audio Error", "Failed to play audio response.");
          closeVoiceAssistant();
        },
        onStopped: () => {
          console.log("Speech was stopped");
          closeVoiceAssistant();
        },
      });

      // Haptic feedback for audio start
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Text-to-speech error:", error);
      Alert.alert("Audio Error", "Failed to play audio response.");
      closeVoiceAssistant();
    }
  };

  /**
   * Close voice assistant modal and reset state
   */
  const closeVoiceAssistant = () => {
    // Stop any ongoing speech
    Speech.stop();

    setIsVoiceModalVisible(false);
    setIsRecording(false);
    setIsProcessing(false);
    setRecordingDuration(0);
    setTranscriptionResult("");
    setShowTranscription(false);
    setShowSiriAnimation(false);
    setShowSpeakerAnimation(false);
    setAiResponse("");
    setIsGeneratingResponse(false);
    setIsPlayingAudio(false);
    stopPulseAnimation();
    stopRecordingTimer();
    stopSiriAnimation();
    stopSpeakerAnimation();

    // Clean up recording if still active
    if (recording.current) {
      recording.current.stopAndUnloadAsync();
      recording.current = null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {/* <Text style={styles.title}>FinBeacon</Text> */}
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 300, height: 100 }}
            />
            <Text style={styles.subtitle}>
              A guiding light in managing thy finances
            </Text>
          </View>

          <TouchableOpacity style={styles.notification}>
            <Feather name="bell" size={20} color="black" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Main Navigation Buttons */}
        <View style={styles.navGroup}>
          <NavButton
            icon="home"
            title="Dashboard"
            subtitle="Your financial overview"
            selected={selectedTab === "dashboard"}
            onPress={() => setSelectedTab("dashboard")}
          />
          <NavButton
            icon="user"
            title="Get Started"
            subtitle="Set up your account"
            selected={selectedTab === "getstarted"}
            onPress={() => {
              setSelectedTab("getstarted");
              router.replace("/(tabs)/onboardingscreens");
            }}
          />
          <NavButton
            icon="book-open"
            title="Learn"
            subtitle="Financial education"
            selected={selectedTab === "learn"}
            onPress={() => {
              setSelectedTab("learn");
              router.replace("/(tabs)/learn");
            }}
          />
          <NavButton
            icon="mic"
            title="Voice Assistant"
            subtitle="Ask questions"
            selected={selectedTab === "voice"}
            onPress={openVoiceAssistant}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <ActionButton label="Check Balance" />
            <ActionButton label="Set Goal" />
          </View>
        </View>
        {/* Financial Health Score Card */}
        <View style={styles.card}>
          <FinancialHealthScore />
        </View>
      </ScrollView>

      {/* Voice Assistant Modal */}
      <Modal
        visible={isVoiceModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeVoiceAssistant}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.voiceModal}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Voice Assistant</Text>
              <TouchableOpacity
                onPress={closeVoiceAssistant}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Recording Status */}
            <View style={styles.recordingStatus}>
              {isProcessing || isGeneratingResponse ? (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="large" color="#4f46e5" />
                  <Text style={styles.statusText}>
                    {isProcessing
                      ? "Processing your voice..."
                      : "Generating AI response..."}
                  </Text>
                </View>
              ) : isPlayingAudio && showSpeakerAnimation ? (
                <View style={styles.speakerContainer}>
                  <Animated.View
                    style={[
                      styles.speakerIndicator,
                      {
                        transform: [
                          {
                            scale: speakerAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.3],
                            }),
                          },
                        ],
                        opacity: speakerAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.6, 1],
                        }),
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={["#22c55e", "#16a34a"]}
                      style={styles.speakerButton}
                    >
                      <Feather name="volume-2" size={32} color="white" />
                    </LinearGradient>
                  </Animated.View>
                  <Text style={styles.speakerText}>Playing response...</Text>
                </View>
              ) : isRecording ? (
                <View style={styles.recordingContainer}>
                  <Animated.View
                    style={[
                      styles.recordingIndicator,
                      { transform: [{ scale: pulseAnimation }] },
                    ]}
                  >
                    <LinearGradient
                      colors={["#ef4444", "#dc2626"]}
                      style={styles.recordingButton}
                    >
                      <Feather name="mic" size={32} color="white" />
                    </LinearGradient>
                  </Animated.View>
                  <Text style={styles.recordingText}>Recording...</Text>
                  <Text style={styles.durationText}>
                    {formatDuration(recordingDuration)}
                  </Text>
                </View>
              ) : (
                <View style={styles.idleContainer}>
                  <TouchableOpacity
                    onPress={startRecording}
                    style={styles.micButton}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#4f46e5", "#6366f1"]}
                      style={styles.micButtonGradient}
                    >
                      <Feather name="mic" size={32} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                  <Text style={styles.instructionText}>
                    Tap the microphone to start recording
                  </Text>
                  <Text style={styles.promptText}>
                    "Explain your investment details as much as possible"
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {isRecording && (
                <TouchableOpacity
                  onPress={stopRecording}
                  style={styles.stopButton}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#ef4444", "#dc2626"]}
                    style={styles.stopButtonGradient}
                  >
                    <Feather name="square" size={20} color="white" />
                    <Text style={styles.stopButtonText}>Stop Recording</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {isPlayingAudio && showSpeakerAnimation && (
                <TouchableOpacity
                  onPress={() => {
                    Speech.stop();
                    closeVoiceAssistant();
                  }}
                  style={styles.stopButton}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#f59e0b", "#d97706"]}
                    style={styles.stopButtonGradient}
                  >
                    <Feather name="pause" size={20} color="white" />
                    <Text style={styles.stopButtonText}>Stop Audio</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {!isRecording &&
                !isProcessing &&
                !isGeneratingResponse &&
                !isPlayingAudio && (
                  <TouchableOpacity
                    onPress={closeVoiceAssistant}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
            </View>

            {/* Recording Tips */}
            {!isRecording &&
              !isProcessing &&
              !isGeneratingResponse &&
              !isPlayingAudio && (
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsTitle}>💡 Recording Tips:</Text>
                  <Text style={styles.tipText}>
                    • Speak clearly and at normal pace
                  </Text>
                  <Text style={styles.tipText}>
                    • Minimize background noise
                  </Text>
                  <Text style={styles.tipText}>
                    • Be specific about your investment goals
                  </Text>
                </View>
              )}
          </View>
        </View>
      </Modal>

      {/* Siri-like Full Screen Animation */}
      <Modal
        visible={showSiriAnimation}
        animationType="fade"
        transparent={true}
        onRequestClose={closeVoiceAssistant}
      >
        <BlurView intensity={100} tint="dark" style={styles.siriOverlay}>
          <View style={styles.siriContainer}>
            {/* Animated wave circles */}
            {[...Array(5)].map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.siriWave,
                  {
                    transform: [
                      {
                        scale: siriWaveAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8 + index * 0.1, 1.2 + index * 0.15],
                        }),
                      },
                    ],
                    opacity: siriWaveAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.8 - index * 0.1],
                    }),
                  },
                  {
                    backgroundColor: index % 2 === 0 ? "#4f46e5" : "#6366f1",
                  },
                ]}
              />
            ))}

            {/* Central microphone icon */}
            <View style={styles.siriCenterIcon}>
              <LinearGradient
                colors={["#4f46e5", "#8b5cf6"]}
                style={styles.siriMicButton}
              >
                <Feather name="mic" size={40} color="white" />
              </LinearGradient>
            </View>

            {/* Instruction text */}
            <View style={styles.siriTextContainer}>
              <Text style={styles.siriMainText}>
                "Explain your investment details as much as possible"
              </Text>
              <Text style={styles.siriSubText}>
                Recording will start automatically...
              </Text>
            </View>

            {/* Cancel button */}
            <TouchableOpacity
              onPress={closeVoiceAssistant}
              style={styles.siriCancelButton}
            >
              <Text style={styles.siriCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

// Navigation Button Component
type NavButtonProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  selected?: boolean;
  onPress?: () => void;
};

function NavButton({
  icon,
  title,
  subtitle,
  selected = false,
  onPress,
}: NavButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.navButton, selected && styles.highlightButton]}
    >
      <View style={styles.navContent}>
        <View style={[styles.iconWrapper, selected && styles.iconHighlight]}>
          <Feather name={icon} size={20} color={selected ? "#fff" : "#000"} />
        </View>
        <View style={styles.navText}>
          <Text style={[styles.navTitle, selected && { color: "#fff" }]}>
            {title}
          </Text>
          <Text style={[styles.navSubtitle, selected && { color: "#eee" }]}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Quick Action Button
type ActionButtonProps = {
  label: string;
};

function ActionButton({ label }: ActionButtonProps) {
  return (
    <TouchableOpacity style={styles.actionButton}>
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  notification: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },
  navGroup: {
    marginBottom: 32,
  },
  navButton: {
    flexDirection: "row",
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    alignItems: "center",
  },
  highlightButton: {
    backgroundColor: "#4f46e5",
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ddd",
    marginRight: 14,
  },
  iconHighlight: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  navText: {
    flex: 1,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  navSubtitle: {
    fontSize: 12,
    color: "gray",
  },
  quickActions: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  quickTitle: {
    fontSize: 13,
    color: "gray",
    marginBottom: 10,
    fontWeight: "bold",
  },
  quickGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 16,
    marginTop: 16,
  },

  // Voice Assistant Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  voiceModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  recordingStatus: {
    alignItems: "center",
    marginBottom: 32,
    minHeight: 200,
    justifyContent: "center",
  },
  processingContainer: {
    alignItems: "center",
    gap: 16,
  },
  statusText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  recordingContainer: {
    alignItems: "center",
    gap: 12,
  },
  speakerContainer: {
    alignItems: "center",
    gap: 12,
  },
  speakerIndicator: {
    marginBottom: 8,
  },
  speakerButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#22c55e",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  speakerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#22c55e",
  },
  recordingIndicator: {
    marginBottom: 8,
  },
  recordingButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ef4444",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  recordingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ef4444",
  },
  durationText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    fontFamily: "monospace",
  },
  idleContainer: {
    alignItems: "center",
    gap: 16,
  },
  micButton: {
    marginBottom: 8,
  },
  micButtonGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  instructionText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
  },
  promptText: {
    fontSize: 14,
    color: "#4f46e5",
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 16,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  stopButton: {
    alignSelf: "center",
  },
  stopButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  stopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: "#f3f4f6",
  },
  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "500",
  },
  tipsContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4f46e5",
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },

  // Siri-like Animation Styles
  siriOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  siriContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  siriWave: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "transparent",
  },
  siriCenterIcon: {
    position: "absolute",
    zIndex: 10,
  },
  siriMicButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  siriTextContainer: {
    position: "absolute",
    bottom: 200,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  siriMainText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 28,
  },
  siriSubText: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.8,
    textAlign: "center",
    fontStyle: "italic",
  },
  siriCancelButton: {
    position: "absolute",
    bottom: 100,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  siriCancelText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});
