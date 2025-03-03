import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the tabs screen or login screen
  return <Redirect href="/(tabs)" />;
}
