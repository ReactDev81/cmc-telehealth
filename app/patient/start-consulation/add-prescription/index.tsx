import { View, Text, Button } from "react-native";

const AddPrescription = ({ onClose }: { onClose: () => void }) => {
    return (
        <View>
            <Text>Add Prescription</Text>
            <Button title="Close" onPress={onClose} />
        </View>
    )
};

export default AddPrescription;