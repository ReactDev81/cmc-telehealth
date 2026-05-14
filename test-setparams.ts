import { useNavigation } from 'expo-router';

export function Test() {
  const navigation = useNavigation();
  // @ts-ignore
  navigation.setParams({ consultation_type: undefined, filter_type: undefined, id: undefined });
}
