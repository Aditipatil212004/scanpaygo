import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function StaffVerifyScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);
  // result = { status: 'VALID'/'INVALID', data: receiptData }

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;

    setScanned(true);

    try {
      const parsed = JSON.parse(data);

      // ✅ basic validation
      if (parsed.receiptId && parsed.amount && parsed.paidAt) {
        setResult({ status: 'VALID', data: parsed });
      } else {
        setResult({ status: 'INVALID', data: null });
      }
    } catch (err) {
      setResult({ status: 'INVALID', data: null });
    }
  };

  const statusBadge = useMemo(() => {
    if (!result) return null;
    if (result.status === 'VALID') return styles.validBadge;
    return styles.invalidBadge;
  }, [result]);

  // ✅ permission loading
  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.centerText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  // ✅ permission denied
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.centerText}>Camera permission denied</Text>
        <TouchableOpacity
          style={styles.scanAgainBtn}
          onPress={requestPermission}
          activeOpacity={0.9}
        >
          <Text style={styles.scanAgainText}>Allow Camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Ionicons name="chevron-back" size={26} color="#052E16" />
        </TouchableOpacity>

        <Text style={styles.title}>Verify Receipt</Text>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace('StaffLogin')}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Scanner */}
      <View style={styles.scannerBox}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'], // ✅ ONLY QR for receipt
          }}
        />

        {/* Overlay Text */}
        <View style={styles.scanOverlay}>
          <Text style={styles.scanOverlayText}>
            Align QR inside the box
          </Text>
        </View>
      </View>

      {/* Result */}
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Verification Result</Text>

        {!result ? (
          <Text style={styles.resultHint}>Scan customer QR receipt</Text>
        ) : (
          <>
            <View style={[styles.badge, statusBadge]}>
              <Ionicons
                name={result.status === 'VALID' ? 'checkmark-circle' : 'close-circle'}
                size={18}
                color="#fff"
              />
              <Text style={styles.badgeText}>{result.status}</Text>
            </View>

            {result.status === 'VALID' && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Receipt: {result.data.receiptId}</Text>
                <Text style={styles.infoText}>Amount: ₹{result.data.amount}</Text>
                <Text style={styles.infoText}>Items: {result.data.itemsCount}</Text>
                <Text style={styles.infoText}>Method: {result.data.method}</Text>
              </View>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.scanAgainBtn}
          onPress={() => {
            setScanned(false);
            setResult(null);
          }}
          activeOpacity={0.9}
        >
          <Ionicons name="scan-outline" size={18} color="#fff" />
          <Text style={styles.scanAgainText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ECFDF5' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: '#052E16',
  },

  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scannerBox: {
    marginHorizontal: 20,
    height: 360,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#16A34A',
    backgroundColor: '#000',
  },

  scanOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  scanOverlayText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },

  resultCard: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    shadowColor: '#16A34A',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },

  resultTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#052E16',
  },

  resultHint: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 12,
    alignSelf: 'flex-start',
  },

  validBadge: { backgroundColor: '#16A34A' },
  invalidBadge: { backgroundColor: '#DC2626' },

  badgeText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
  },

  infoBox: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
    borderRadius: 18,
    padding: 12,
  },

  infoText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#052E16',
    marginBottom: 6,
  },

  scanAgainBtn: {
    marginTop: 14,
    backgroundColor: '#16A34A',
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scanAgainText: {
    marginLeft: 10,
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },

  centerText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 14,
    fontWeight: '800',
    color: '#052E16',
  },
});
