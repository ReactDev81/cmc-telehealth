import { useAuth } from '@/context/UserContext';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import MenuItem from '../../components/common/profile/menu-item';
import ProfileEdit from '../../components/common/profile/profile-edit';
import Button from '../../components/ui/Button';
import { menuSections } from '../../json-data/patient/profile';


const Profile = () => {

    const { logout } = useAuth();

    return(
        <ScrollView 
            showsVerticalScrollIndicator={false}
            className='flex-1 p-5 bg-white'
        >
            {/* profile edit */}
            <ProfileEdit />

            {/* menu items */}
            <View className='mt-5'>
                {menuSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} className="mb-6">
                        {section.title && (
                            <Text className="text-lg font-medium text-black px-4 py-3">
                                {section.title}
                            </Text>
                        )}
                        <View className="bg-white">
                            {section.items.map((item, itemIndex) => (
                                <MenuItem
                                    key={item.id}
                                    icon={item.icon}
                                    title={item.title}
                                    description={item.description}
                                    onPress={() => router.push(item.route as any)}
                                    showBorder={itemIndex !== section.items.length - 1}
                                />
                            ))}
                        </View>
                    </View>
                ))}
            </View>

            {/* app version info and logout button */}
            <View className='mt-7 mb-16'>
                <Text className='text-sm text-black-400 text-center'>CMC - v 1.1 (518)</Text>
                <Button 
                    className='mt-7' 
                    onPress={async () => {
                        await logout();
                        router.replace("/auth/login");
                    }}
                >
                    Logout
                </Button>
            </View>

        </ScrollView>
    )
}

export default Profile