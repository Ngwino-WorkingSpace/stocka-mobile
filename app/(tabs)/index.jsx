import { StyleSheet } from 'react-native';
import {View, Text} from 'react-native';
import LandingScreen from '../../Pages/Landing.jsx';

export default function MainScreen() {
  return(
    <>
       <LandingScreen/>  
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
