import { useFindDoctorData } from "@/queries/patient/useFindDoctorData";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import FilterOptionCard from "./filter-option-card";

interface FiltersModalProps {
    visible: boolean;
    onClose: () => void;
    filters: {
      departmentId?: string;
      symptomDepartmentId?: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
      departmentId?: string;
      symptomDepartmentId?: string;
    }>>;
}  

const FiltersModal = ({ visible, onClose, filters, setFilters }: FiltersModalProps) => {

    const insets = useSafeAreaInsets();
    const { data, isLoading, isError, error } = useFindDoctorData();
    const [activeTab, setActiveTab] = useState<"speciality" | "symptoms">("speciality");
    // const items = Array.isArray(data) ? data : [];

    const items = Array.isArray(data?.data) ? data.data : [];


    const symptoms = items.flatMap((item) =>
        Array.isArray(item.symptoms)
          ? item.symptoms.map((symptom: { name: string; icon: string }) => ({
              ...symptom,
              departmentId: item.id,
            }))
          : []
    );      

    // console.log('data', data);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <SafeAreaView className="absolute top-0 left-0 w-full h-full justify-between bg-white"
                style={{
                    // paddingTop: insets?.top,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                }}
            >

                {/* header */}
                <View className="flex-row item-center justify-between p-5">
                    <View>
                        <Text>Filters</Text>
                    </View>
                    <View>
                    {/* <Pressable onPress={() => setFilters({})}>
                        <Text className="text-danger font-medium">Clear All</Text>
                    </Pressable> */}
                    <Pressable
                        onPress={() => {
                            setFilters({});
                            router.setParams({
                                filter_type: undefined,
                                id: undefined,
                            });
                        }}
                    >
                        <Text className="text-danger font-medium">Clear All</Text>
                    </Pressable>

                    </View>
                </View>

                {/* tab */}
                <View className="flex-row flex-1 border-t border-gray-200">

                    {/* LEFT TABS */}
                    <View className="w-2/6 bg-gray-50 border-r border-gray-200">
                        <Pressable
                            onPress={() => setActiveTab("speciality")}
                            className={`px-4 py-4 ${
                                activeTab === "speciality" ? "bg-white border-l-4 border-primary" : ""
                            }`}
                        >
                            <Text className={`font-medium ${
                                activeTab === "speciality" ? "text-primary" : "text-gray-600"
                            }`}>
                                Speciality
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setActiveTab("symptoms")}
                            className={`px-4 py-4 ${
                                activeTab === "symptoms" ? "bg-white border-l-4 border-primary" : ""
                            }`}
                        >
                            <Text className={`font-medium ${
                                activeTab === "symptoms" ? "text-primary" : "text-gray-600"
                            }`}>
                                Symptoms
                            </Text>
                        </Pressable>

                    </View>

                    {/* RIGHT CONTENT */}
                    <View className="w-4/6 bg-white p-4">

                        {activeTab === "speciality" && (
                            <View className="flex-row flex-wrap justify-between gap-4">

                                {items.map((item) => {
                                    return(
                                        <FilterOptionCard
                                            key={item.id}
                                            id={String(item.id)} // department ID
                                            label={item.department.name}
                                            icon={item.department.icon}
                                            selected={filters.departmentId === String(item.id)}
                                            onPress={(id) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    departmentId: prev.departmentId === id ? undefined : id,
                                                    symptomDepartmentId: undefined, // 🔥 reset symptom
                                                }))
                                            }
                                        />      
                                    )
                                })}
                            </View>
                        )}


{activeTab === "symptoms" && (
  symptoms.length === 0 ? (
    <Text className="text-gray-400 text-center">
      No symptoms available
    </Text>
  ) : (
    <View className="flex-row flex-wrap justify-between gap-4">
      {symptoms.map((symptom, index) => (
        <FilterOptionCard
        key={`${symptom.name}-${index}`}
        id={String(symptom.departmentId)} // ✅ USE departmentId
        label={symptom.name}
        icon={symptom.icon}
        selected={
          filters.symptomDepartmentId ===
          String(symptom.departmentId)
        }
        onPress={(id) =>
          setFilters((prev) => ({
            ...prev,
            symptomDepartmentId:
              prev.symptomDepartmentId === id ? undefined : id,
            departmentId: undefined, // reset speciality
          }))
        }
      />      
      ))}
    </View>
  )
)}

                    </View>

                </View>

                {/* footer */}
                <View className="flex-row item-center px-5 h-14">
                    <View className="w-3/6 h-full flex-row items-center justify-center">
                        <Pressable
                            onPress={onClose}
                        >
                            <Text>Close</Text>
                        </Pressable>
                    </View>
                    <View className="w-3/6 h-full flex-row items-center justify-center">
                        <Pressable
                            onPress={onClose}
                        >
                            <Text className="text-success font-bold tracking-wider">Apply</Text>
                        </Pressable>
                    </View>
                </View>

            </SafeAreaView>

        </Modal>
    );
};

export default FiltersModal;