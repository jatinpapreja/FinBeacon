import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import Svg, { Path } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useRouter } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

// Replace this with your actual stack param list
type RootStackParamList = {
  HomeScreen: undefined;
  // add other screens if needed
};

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [extractedIdNumber, setExtractedIdNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // OTP related state
  const [mobileNumber, setMobileNumber] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  
  // Biometric related state
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [biometricScanProgress, setBiometricScanProgress] = useState(0);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [scanAttempt, setScanAttempt] = useState(0);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  const handleNext = () => {
    // Validate step completion before proceeding
    if (currentStep === 0 && !extractedIdNumber) {
      Alert.alert("Complete Step", "Please scan your Aadhar card first");
      return;
    }
    if (currentStep === 1 && !isOTPVerified) {
      Alert.alert("Complete Step", "Please verify your mobile number with OTP first");
      return;
    }
    if (currentStep === 2 && !isBiometricVerified) {
      Alert.alert("Complete Step", "Please complete biometric verification first");
      return;
    }
    
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else if (currentStep === 3) {
      setCurrentStep(0); // Reset to first step or navigate to home
      router.replace("/(tabs)");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const requestCameraPermission = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access to scan your Aadhar card."
        );
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        
        // Take the picture
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        console.log("Photo taken:", photo);
        
        // Create FormData for the API request
        const formData = new FormData();
        formData.append('idDocument', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: 'aadhar.jpg',
        } as any);
        
        // Send to REST API
        const response = await fetch('https://elevate-backend-hllhni53va-uc.a.run.app/api/id-documents/process', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            // Don't set Content-Type header, let the browser set it with boundary
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log("API Response:", result);
          
          // Extract the ID number from the response
          const idNumber = result?.data?.structured_data?.id_number;
          
          if (idNumber) {
            setExtractedIdNumber(idNumber);
            Alert.alert("Success", "Aadhar card scanned and processed successfully!");
          } else {
            Alert.alert("Warning", "Aadhar card scanned but ID number could not be extracted. Please try again.");
          }
        } else {
          const errorText = await response.text();
          console.error("API Error:", errorText);
          Alert.alert("Error", "Failed to process the image. Please try again.");
        }
        
      } catch (error) {
        console.error("Error taking picture or processing:", error);
        Alert.alert("Error", "Failed to capture or process image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Mock OTP Services
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const startOTPTimer = () => {
    setOtpTimer(60);
    const timer = setInterval(() => {
      setOtpTimer((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setIsSendingOTP(true);
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const otp = generateOTP();
      setGeneratedOTP(otp);
      setIsOTPSent(true);
      startOTPTimer();
      
      // Simulate SMS auto-read after a delay
      setTimeout(() => {
        setEnteredOTP(otp);
        Alert.alert("SMS Auto-Read", `OTP automatically filled: ${otp}`);
      }, 3000);
      
      Alert.alert("OTP Sent", `OTP sent to +91-${mobileNumber}\n\nFor demo: ${otp}`);
      
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTP = async () => {
    if (!enteredOTP || enteredOTP.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsVerifyingOTP(true);
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (enteredOTP === generatedOTP) {
        setIsOTPVerified(true);
        Alert.alert("Success", "OTP verified successfully!");
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
      
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const resendOTP = async () => {
    await sendOTP();
  };

  // Mock Biometric Services
  const simulateBiometricScan = async () => {
    if (isBiometricScanning) return;

    try {
      setIsBiometricScanning(true);
      setScanStatus('scanning');
      setBiometricScanProgress(0);
      setScanAttempt((prev: number) => prev + 1);

      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setBiometricScanProgress((prev: number) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      // Wait for scan completion
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate scan result (85% success rate for realistic feel)
      const isSuccessful = Math.random() > 0.15;

      if (isSuccessful) {
        setScanStatus('success');
        setIsBiometricVerified(true);
        
        // Additional delay for success animation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        Alert.alert(
          "Biometric Verified", 
          "Fingerprint authentication successful!\n\nYour identity has been verified securely."
        );
      } else {
        setScanStatus('error');
        
        // Reset progress after error
        setTimeout(() => {
          setBiometricScanProgress(0);
          setScanStatus('idle');
        }, 1500);
        
        Alert.alert(
          "Scan Failed", 
          `Fingerprint not recognized. Please try again.\n\nAttempt ${scanAttempt} of 3`
        );
      }

    } catch (error) {
      setScanStatus('error');
      Alert.alert("Error", "Biometric scanner error. Please try again.");
    } finally {
      setIsBiometricScanning(false);
    }
  };

  const resetBiometricScan = () => {
    setBiometricScanProgress(0);
    setScanStatus('idle');
  };

  // Step progress percentages as numbers (0 to 1)
  const getStepProgress = (step: number) => {
    switch (step) {
      case 0:
        return extractedIdNumber ? 1 : 0;
      case 1:
        return isOTPVerified ? 1 : isOTPSent ? 0.5 : 0;
      case 2:
        return isBiometricVerified ? 1 : isBiometricScanning ? biometricScanProgress / 100 : 0;
      case 3:
        return 1;
      default:
        return 0;
    }
  };

  const progressPercent = [
    getStepProgress(0),
    getStepProgress(1),
    getStepProgress(2),
    getStepProgress(3)
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* === Step 1: Aadhar Scan === */}
        {currentStep === 0 && (
          <View style={styles.section}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepText}>Step 1 of 4</Text>
              <Text style={styles.stepText}>{`${
                progressPercent[0] * 100
              }%`}</Text>
            </View>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressIndicator,
                  { width: `${progressPercent[0] * 100}%` },
                ]}
              />
            </View>

            <View style={styles.centerSection}>
              <LinearGradient
                colors={["#4f46e5", "#6366f1"]}
                style={styles.circleIcon}
              >
                <Icon name="camera" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.heading}>Scan Your Aadhar Card</Text>
              <Text style={styles.subtext}>
                YONO quick onboarding with Aadhar verification
              </Text>
            </View>

            <View style={styles.cameraContainer}>
              {permission?.granted ? (
                <View style={styles.cameraPreview}>
                  <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={cameraType}
                  >
                    <View style={styles.cameraOverlay}>
                      <View style={styles.cardFrame}>
                        <View style={styles.cornerTopLeft} />
                        <View style={styles.cornerTopRight} />
                        <View style={styles.cornerBottomLeft} />
                        <View style={styles.cornerBottomRight} />
                        <Text style={styles.frameText}>
                          Align Aadhar Card within frame
                        </Text>
                      </View>
                    </View>
                  </CameraView>
                </View>
              ) : (
                <View style={styles.cameraPlaceholder}>
                  <Icon name="camera" size={48} color="#4f46e5" />
                  <Text style={styles.placeholderText}>
                    Camera access required
                  </Text>
                  <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestCameraPermission}
                  >
                    <Text style={styles.permissionButtonText}>
                      Enable Camera
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text style={styles.instruction}>
              Place your Aadhar Card in the frame and tap the camera button
            </Text>

            <TouchableOpacity 
              style={[styles.scanButton, isProcessing && styles.disabledButton]}
              onPress={permission?.granted ? takePicture : requestCameraPermission}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={isProcessing ? ["#9ca3af", "#6b7280"] : ["#4f46e5", "#a5b4fc"]}
                style={styles.scanButtonGradient}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#fff" style={styles.iconGap} />
                ) : (
                  <Icon
                    name="camera"
                    size={20}
                    color="#fff"
                    style={styles.iconGap}
                  />
                )}
                <Text style={styles.scanButtonText}>
                  {isProcessing 
                    ? "Processing..." 
                    : permission?.granted 
                      ? "Scan Aadhar Card" 
                      : "Enable Camera"
                  }
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {extractedIdNumber && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Extracted Aadhar Number:</Text>
                <Text style={styles.resultValue}>{extractedIdNumber}</Text>
              </View>
            )}
          </View>
        )}

        {/* === Step 2: OTP Verification === */}
        {currentStep === 1 && (
          <View style={styles.section}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepText}>Step 2 of 4</Text>
              <Text style={styles.stepText}>{`${
                progressPercent[1] * 100
              }%`}</Text>
            </View>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressIndicator,
                  { width: `${progressPercent[1] * 100}%` },
                ]}
              />
            </View>

            <View style={styles.centerSection}>
              <LinearGradient
                colors={["#4f46e5", "#6366f1"]}
                style={styles.circleIcon}
              >
                <Svg
                  width={24}
                  height={24}
                  stroke="white"
                  strokeWidth={2}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                </Svg>
              </LinearGradient>

              <Text style={styles.heading}>OTP Verification</Text>
              <Text style={styles.subtext}>
                Verify your mobile number with OTP
              </Text>
            </View>

            {/* Mobile Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number:</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="Enter 10-digit mobile number"
                  keyboardType="numeric"
                  maxLength={10}
                  editable={!isOTPSent}
                />
              </View>
            </View>

            {/* OTP Input Section */}
            {isOTPSent && (
              <View style={styles.otpSection}>
                <Text style={styles.inputLabel}>Enter OTP:</Text>
                <View style={styles.otpInputContainer}>
                  <TextInput
                    style={styles.otpInput}
                    value={enteredOTP}
                    onChangeText={setEnteredOTP}
                    placeholder="Enter 6-digit OTP"
                    keyboardType="numeric"
                    maxLength={6}
                    editable={!isOTPVerified}
                  />
                  {enteredOTP.length === 6 && !isOTPVerified && (
                    <TouchableOpacity
                      style={styles.verifyButton}
                      onPress={verifyOTP}
                      disabled={isVerifyingOTP}
                    >
                      {isVerifyingOTP ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.verifyButtonText}>Verify</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>

                {/* Timer and Resend */}
                <View style={styles.timerContainer}>
                  {otpTimer > 0 ? (
                    <Text style={styles.timerText}>
                      Resend OTP in {otpTimer}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={resendOTP} disabled={isSendingOTP}>
                      <Text style={styles.resendText}>
                        {isSendingOTP ? "Sending..." : "Resend OTP"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Auto-read notification */}
                <View style={styles.autoReadNotice}>
                  <Icon name="smartphone" size={16} color="#4f46e5" />
                  <Text style={styles.autoReadText}>
                    OTP will be auto-filled from SMS
                  </Text>
                </View>
              </View>
            )}

            {/* OTP Verified Status */}
            {isOTPVerified && (
              <View style={styles.verifiedContainer}>
                <MaterialIcons name="check-circle" size={24} color="#22c55e" />
                <Text style={styles.verifiedText}>Mobile number verified!</Text>
              </View>
            )}

            {/* Send OTP Button */}
            {!isOTPSent ? (
              <TouchableOpacity 
                style={[styles.sendButton, (!mobileNumber || mobileNumber.length !== 10) && styles.disabledButton]}
                onPress={sendOTP}
                disabled={isSendingOTP || !mobileNumber || mobileNumber.length !== 10}
              >
                {isSendingOTP ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" style={styles.iconGap} />
                    <Text style={styles.sendButtonText}>Sending OTP...</Text>
                  </>
                ) : (
                  <>
                    <Svg
                      width={20}
                      height={20}
                      stroke="white"
                      strokeWidth={2}
                      fill="none"
                      viewBox="0 0 24 24"
                      style={styles.iconGap}
                    >
                      <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    </Svg>
                    <Text style={styles.sendButtonText}>Send OTP</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.sentStatusContainer}>
                <MaterialIcons name="sms" size={20} color="#4f46e5" />
                <Text style={styles.sentStatusText}>
                  OTP sent to +91-{mobileNumber}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* === Step 3: Biometric Verification === */}
        {currentStep === 2 && (
          <View style={styles.section}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepText}>Step 3 of 4</Text>
              <Text style={styles.stepText}>{`${
                progressPercent[2] * 100
              }%`}</Text>
            </View>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressIndicator,
                  { width: `${progressPercent[2] * 100}%` },
                ]}
              />
            </View>

            <View style={styles.centerSection}>
              <LinearGradient
                colors={["#4f46e5", "#6366f1"]}
                style={styles.circleIcon}
              >
                <MaterialCommunityIcons
                  name="fingerprint"
                  size={24}
                  color="#fff"
                />
              </LinearGradient>
              <Text style={styles.heading}>Biometric Verification</Text>
              <Text style={styles.subtext}>Quick fingerprint verification</Text>
            </View>

            <View style={styles.fingerprintScanner}>
              <TouchableOpacity 
                onPress={simulateBiometricScan}
                disabled={isBiometricScanning || isBiometricVerified}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    scanStatus === 'success' 
                      ? ["#dcfce7", "#bbf7d0"]
                      : scanStatus === 'error'
                      ? ["#fef2f2", "#fecaca"] 
                      : scanStatus === 'scanning'
                      ? ["#eff6ff", "#dbeafe"]
                      : ["#eef2ff", "#c7d2fe"]
                  }
                  style={[
                    styles.fingerprintCircle,
                    scanStatus === 'scanning' && styles.scanningCircle,
                    scanStatus === 'success' && styles.successCircle,
                    scanStatus === 'error' && styles.errorCircle,
                  ]}
                >
                  {isBiometricScanning ? (
                    <View style={styles.scanningContainer}>
                      <MaterialCommunityIcons
                        name="fingerprint"
                        size={48}
                        color="#3b82f6"
                      />
                      <View style={styles.progressOverlay}>
                        <Text style={styles.scanningText}>{biometricScanProgress}%</Text>
                      </View>
                    </View>
                  ) : scanStatus === 'success' ? (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={48}
                      color="#22c55e"
                    />
                  ) : scanStatus === 'error' ? (
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={48}
                      color="#ef4444"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="fingerprint"
                      size={48}
                      color="#4f46e5"
                    />
                  )}
                </LinearGradient>
              </TouchableOpacity>
              
              <Text style={styles.instruction}>
                {scanStatus === 'scanning' 
                  ? "Scanning fingerprint... Keep your finger steady"
                  : scanStatus === 'success'
                  ? "Fingerprint verified successfully!"
                  : scanStatus === 'error'
                  ? "Scan failed. Tap to try again"
                  : "Tap the scanner to authenticate with your fingerprint"
                }
              </Text>

              {/* Scan Progress Bar */}
              {isBiometricScanning && (
                <View style={styles.scanProgressContainer}>
                  <View style={styles.scanProgressBackground}>
                    <View 
                      style={[
                        styles.scanProgressFill, 
                        { width: `${biometricScanProgress}%` }
                      ]} 
                    />
                  </View>
                </View>
              )}

              {/* Attempt Counter */}
              {scanAttempt > 0 && !isBiometricVerified && (
                <Text style={styles.attemptText}>
                  Attempt {scanAttempt} of 3
                </Text>
              )}
            </View>

            <TouchableOpacity 
              style={[
                styles.scanButton,
                (isBiometricScanning || isBiometricVerified) && styles.disabledButton
              ]}
              onPress={isBiometricVerified ? resetBiometricScan : simulateBiometricScan}
              disabled={isBiometricScanning}
            >
              <LinearGradient
                colors={
                  isBiometricVerified 
                    ? ["#22c55e", "#16a34a"]
                    : isBiometricScanning 
                    ? ["#9ca3af", "#6b7280"] 
                    : ["#4f46e5", "#a5b4fc"]
                }
                style={styles.scanButtonGradient}
              >
                {isBiometricScanning ? (
                  <>
                    <ActivityIndicator 
                      size="small" 
                      color="#fff" 
                      style={styles.iconGap} 
                    />
                    <Text style={styles.scanButtonText}>Scanning...</Text>
                  </>
                ) : isBiometricVerified ? (
                  <>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#fff"
                      style={styles.iconGap}
                    />
                    <Text style={styles.scanButtonText}>Verified</Text>
                  </>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="fingerprint"
                      size={20}
                      color="#fff"
                      style={styles.iconGap}
                    />
                    <Text style={styles.scanButtonText}>Scan Fingerprint</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Verification Status */}
            {isBiometricVerified && (
              <View style={styles.biometricVerifiedContainer}>
                <MaterialIcons name="verified-user" size={24} color="#22c55e" />
                <Text style={styles.biometricVerifiedText}>
                  Biometric authentication successful!
                </Text>
              </View>
            )}

            <Text style={styles.disclaimer}>
              Secure biometric authentication as per RBI guidelines
            </Text>
          </View>
        )}

        {/* === Step 4: Account Created === */}
        {currentStep === 3 && (
          <View style={styles.section}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepText}>Step 4 of 4</Text>
              <Text style={styles.stepText}>{`${
                progressPercent[3] * 100
              }%`}</Text>
            </View>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressIndicator,
                  { width: `${progressPercent[3] * 100}%` },
                ]}
              />
            </View>

            <View style={styles.centerSection}>
              <LinearGradient
                colors={["#4ade80", "#22c55e"]}
                style={styles.circleIcon}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#fff"
                />
              </LinearGradient>
              <Text style={styles.heading}>Account Created!</Text>
              <Text style={styles.subtext}>
                Welcome to your new banking experience
              </Text>
            </View>

            <View
              style={[
                styles.cardPreview,
                {
                  padding: 20,
                  width: 300,
                  borderRadius: 16,
                  backgroundColor: "#eef2ff",
                  shadowColor: "#4f46e5",
                  shadowOpacity: 0.15,
                  shadowOffset: { width: 0, height: 5 },
                  shadowRadius: 10,
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 18,
                  marginBottom: 12,
                  color: "#3730a3",
                }}
              >
                Account Details
              </Text>

              {[
                "Aadhar Verified",
                "Mobile Verified",
                "Biometric Verified",
                "Account Status: Active",
              ].map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#4f46e5"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ fontSize: 16, color: "#4b5563" }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* === Navigation Buttons === */}
        <View style={styles.navButtons}>
          <TouchableOpacity
            style={[styles.backButton, currentStep === 0 && { opacity: 0.5 }]}
            onPress={handleBack}
            disabled={currentStep === 0}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={["#4f46e5", "#a5b4fc"]}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === 2
                  ? "Complete"
                  : currentStep === 3
                  ? "Done"
                  : "Next"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 40,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  stepText: {
    fontSize: 12,
    color: "#6b7280", // Tailwind's text-muted-foreground
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#e5e7eb", // Tailwind's bg-secondary
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressIndicator: {
    height: "100%",
    backgroundColor: "#4f46e5", // Tailwind's bg-primary
  },
  centerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  circleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827", // Tailwind's text-foreground
    textAlign: "center",
  },
  subtext: {
    fontSize: 14,
    color: "#6b7280", // Tailwind's text-muted-foreground
    textAlign: "center",
    marginTop: 4,
  },
  instruction: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginVertical: 16,
  },
  cardPreview: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 16,
    // Remove fixed width and height or adjust accordingly
    width: 280,
    padding: 16,
    alignItems: "flex-start",
  },
  cameraContainer: {
    alignSelf: "center",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  cameraPreview: {
    width: 280,
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  cardFrame: {
    width: 240,
    height: 140,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#fff",
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#fff",
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#fff",
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#fff",
  },
  frameText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textAlign: "center",
  },
  cameraPlaceholder: {
    width: 280,
    height: 180,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  fingerprintScanner: {
    alignItems: "center",
    marginBottom: 20,
  },
  fingerprintCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#c7d2fe", // Tailwind's border-primary/40
    marginBottom: 12,
  },
  scanButton: {
    marginTop: 12,
  },
  scanButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "#4f46e5",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    transform: [{ scale: 1 }],
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  iconGap: {
    marginRight: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 12,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db", // Tailwind's border-input
    backgroundColor: "#fff",
  },
  backButtonText: {
    fontSize: 14,
    color: "#111827",
  },
  nextButton: {
    flex: 1,
    marginLeft: 12,
  },
  nextButtonGradient: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.6,
  },
  resultContainer: {
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0ea5e9",
    alignSelf: "center",
    width: 280,
  },
  resultLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "600",
    fontFamily: "monospace",
  },
  // OTP Section Styles
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  countryCode: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#374151",
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#374151",
  },
  otpSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  otpInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  otpInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    letterSpacing: 4,
    fontFamily: "monospace",
  },
  verifyButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  timerContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  timerText: {
    fontSize: 12,
    color: "#6b7280",
  },
  resendText: {
    fontSize: 12,
    color: "#4f46e5",
    fontWeight: "500",
  },
  autoReadNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    gap: 8,
  },
  autoReadText: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "500",
  },
  verifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  verifiedText: {
    fontSize: 14,
    color: "#065f46",
    fontWeight: "600",
  },
  sentStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    gap: 8,
  },
  sentStatusText: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "500",
  },
  // Biometric verification styles
  scanningCircle: {
    borderColor: "#3b82f6",
    borderWidth: 3,
  },
  successCircle: {
    borderColor: "#22c55e",
    borderWidth: 3,
  },
  errorCircle: {
    borderColor: "#ef4444",
    borderWidth: 3,
  },
  scanningContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  progressOverlay: {
    position: "absolute",
    bottom: -8,
    alignItems: "center",
  },
  scanningText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#3b82f6",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scanProgressContainer: {
    marginTop: 16,
    width: "100%",
    maxWidth: 200,
    alignSelf: "center",
  },
  scanProgressBackground: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  scanProgressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 3,
  },
  attemptText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  biometricVerifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  biometricVerifiedText: {
    fontSize: 14,
    color: "#065f46",
    fontWeight: "600",
  },
});
