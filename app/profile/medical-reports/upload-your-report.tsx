import { View, Text } from "react-native"
import { useState } from "react"
import Input from "@/components/form/Input"
import DateField from "@/components/form/date"
import FileUploadField from "@/components/form/FileUploadField"
import Button from "@/components/ui/Button"

const UploadYourReport = () => {

    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);

    return(
        <View className="flex-1 bg-white p-5">
            <Input
                label="Name"
            />
            <DateField
                label="Document Date"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                placeholder="DD/MM/YYYY"
                maximumDate={new Date()}
                className="mt-5"
            />
            <FileUploadField
                className="mt-5"
                label="Attach a document"
                onFileSelect={(file) => {
                    if (file) console.log("File selected:", file.name, file.uri);
                    else console.log("No file selected");
                }}
            />
            <Button className="mt-5">Submit</Button> 
            <Text className="text-sm text-black-400 mt-4">Upload your medical documents or images up to 10 files/photos</Text>     
        </View>
    )
}

export default UploadYourReport