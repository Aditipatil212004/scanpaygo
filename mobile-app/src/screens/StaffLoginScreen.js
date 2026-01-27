import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StaffLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'staff' && password === 'staff123') {
      navigation.replace('StaffVerify');
    } else {
      Alert.alert('Invalid Credentials', 'Username or password incorrect!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <View style={styles.iconBox}>
          <Ionicons name="shield-checkmark-outline" size={30} color="#16A34A" />
        </View>

        <Text style={styles.title}>Staff Login</Text>
        <Text style={styles.subtitle}>
          Login to verify customer receipts
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter staff username"
            placeholderTextColor="#166534"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="#166534"
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.9}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          Demo Login: staff / staff123
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ECFDF5' },
  container: { flex: 1, padding: 20, justifyContent: 'center' },

  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 14,
  },

  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#052E16',
  },

  subtitle: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 18,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    shadowColor: '#16A34A',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: '900',
    color: '#052E16',
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontWeight: '800',
    color: '#052E16',
    backgroundColor: '#F0FDF4',
  },

  loginBtn: {
    marginTop: 18,
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
  },

  loginText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  hint: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
    color: '#166534',
    fontWeight: '800',
  },
});
