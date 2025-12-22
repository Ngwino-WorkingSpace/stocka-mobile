import { StyleSheet } from 'react-native';
import {View, Text} from 'react-native';
import LandingScreen from '../../Pages/Landing.jsx';
import WelcomeScreen from '../../Pages/Welcome.jsx';

export default function MainScreen() {
  return(
          <>
          <WelcomeScreen/>
           </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
