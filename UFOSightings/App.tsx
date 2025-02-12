import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NavBar from './app/navbar';
import Footer from './app/footer';

export default function App() {
  return (
    <View>
      <NavBar></NavBar>
      {/*Add routing here*/}
      <Footer></Footer>
      <StatusBar style="auto" />
    </View>
  );
}

// add global styles in here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
