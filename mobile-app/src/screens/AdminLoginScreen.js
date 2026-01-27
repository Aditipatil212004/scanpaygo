import { View, Button } from 'react-native';

export default function AdminLoginScreen({ navigation }) {
  return (
    <View style={{ padding:20 }}>
      <Button title="Login" onPress={() => navigation.navigate('AdminDashboard')} />
    </View>
  );
}
