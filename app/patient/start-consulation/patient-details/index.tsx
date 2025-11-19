import { View, Text, Button } from "react-native";

const PatientDetails = ({ onClose }: { onClose: () => void }) => {
    return (
        <View>
            <Text>Patient Details</Text>
            <Button title="Close" onPress={onClose} />
        </View>
    )
}

export default PatientDetails;