import { View } from 'react-native'
import Input from '@/components/form/Input'
import TextArea from '@/components/form/TextArea'
import Button from '@/components/ui/Button'

const NeedHelp = () => {
    return(
        <View className='flex-1 bg-white p-5'>

            <View className="mb-5">
                <Input 
                    label="First Name"
                    autoCapitalize="none"
                />
                <Input 
                    label="Last Name"
                    autoCapitalize="none"
                    containerClassName="mt-5"
                />
                <Input
                    label="Email"
                    autoCapitalize="none"
                    containerClassName="mt-5"
                />
                <TextArea 
                    label="Message"
                    containerClassName="mt-5"
                />
            </View>

            <Button>Send Message</Button>
        </View>
    )
}
export default NeedHelp