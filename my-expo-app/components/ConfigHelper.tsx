import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const ConfigHelper: React.FC = () => {
  const [projectId, setProjectId] = useState('');
  const [processorId, setProcessorId] = useState('');
  const [credentialsPath, setCredentialsPath] = useState('');

  const testConnection = async () => {
    try {
      const response = await fetch('https://elevate-backend-hllhni53va-uc.a.run.app:8080/health');
      const data = await response.json();
      
      if (data.status === 'ok') {
        Alert.alert('Success!', 'Backend connection is working');
      } else {
        Alert.alert('Error', 'Backend connection failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Cannot connect to backend. Make sure it\'s running.');
    }
  };

  const generateEnvFile = () => {
    const envContent = `NODE_ENV=development
PORT=3001
GOOGLE_CLOUD_PROJECT_ID=${projectId}
GOOGLE_CLOUD_LOCATION=us
GOOGLE_APPLICATION_CREDENTIALS=${credentialsPath}
DOCUMENT_AI_PROCESSOR_ID=${processorId}
DOCUMENT_AI_PROCESSOR_VERSION=pretrained-bank-statement-parser-v1.0-2020-09-30
VERTEX_AI_MODEL=gemini-1.5-pro
VERTEX_AI_LOCATION=us-central1
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads`;

    Alert.alert(
      'Environment File Content',
      `Copy this to your backend/.env file:\n\n${envContent}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>🔧 GCP Configuration Helper</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Google Cloud Platform Setup</Text>
          
          <Text style={styles.label}>Project ID:</Text>
          <TextInput
            style={styles.input}
            value={projectId}
            onChangeText={setProjectId}
            placeholder="your-gcp-project-id"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Document AI Processor ID:</Text>
          <TextInput
            style={styles.input}
            value={processorId}
            onChangeText={setProcessorId}
            placeholder="your-processor-id"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Service Account Key Path:</Text>
          <TextInput
            style={styles.input}
            value={credentialsPath}
            onChangeText={setCredentialsPath}
            placeholder="./path/to/service-account-key.json"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={generateEnvFile}>
          <Text style={styles.buttonText}>📄 Generate .env File</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.testButton]} onPress={testConnection}>
          <Text style={styles.buttonText}>🧪 Test Backend Connection</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📋 GCP Setup Checklist:</Text>
          <Text style={styles.infoText}>
            ✅ Create GCP project{'\n'}
            ✅ Enable Document AI API{'\n'}
            ✅ Enable Vertex AI API{'\n'}
            ✅ Create Document AI processor{'\n'}
            ✅ Create service account with permissions{'\n'}
            ✅ Download service account key{'\n'}
            ✅ Update backend/.env file{'\n'}
            ✅ Update App.tsx with your local IP
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  testButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1976d2',
  },
});

export default ConfigHelper;
