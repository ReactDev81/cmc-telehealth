import { View, Text, Image } from 'react-native'
import Title from "../../components/ui/Title"
import Button from "../../components/ui/Button"
import { ArticleProps } from '../../types/home'

const Article = ({ name, first_point, second_point } : ArticleProps ) => {
    return(
        <View className="p-4 bg-white rounded-xl w-[300px] flex-row items-center justify-between">
            
            {/* Left Content */}
            <View className="flex-1 pr-3">
                <Title text={name} />   
                <View className="flex-row items-center gap-x-1.5 mt-2.5">
                    <Image source={require('../../assets/images/smiling-face.png')} className='w-5 h-5' />
                    <Text className="text-sm text-black-400">{first_point}</Text>
                </View>
                <View className="flex-row items-center gap-x-1.5 mt-1.5">
                    <Image source={require('../../assets/images/smiling-face.png')} className='w-5 h-5' />
                    <Text className="text-sm text-black-400">{second_point}</Text>
                </View>
                <View className='max-w-[160px]'>
                    <Button variant='outline' className='mt-4 px-2'>Book Appointment</Button>
                </View>
            </View>

            {/* Right Image */}
            <Image 
                source={require('../../assets/images/father-son.png')} 
                className="w-32 h-32 absolute right-0 bottom-0"
                resizeMode="contain"
            />
        </View>
    )
}

export default Article