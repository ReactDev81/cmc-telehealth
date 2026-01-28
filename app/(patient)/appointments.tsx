import AllPastAppointment from "@/components/patient/appointment/all-past-appointment";
import AllUpcomingAppointment from "@/components/patient/appointment/all-upcoming-appointment";
import Tab, { TabItem } from "@/components/ui/Tab";
import { useAuth } from "@/context/UserContext";
import { useAppointments } from "@/queries/patient/useAppointments";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
export type Appointment = {
  id: string;
  slug: string;
  appointment_date: string;
  appointment_date_formatted: string;
  appointment_time: string;
  appointment_time_formatted: string;
  consultation_type: 'video' | 'in-person';
  consultation_type_label: string;
  status: string;
  status_label: string;
  fee_amount: string;
  call_now: boolean;
  join_url: string;
  video_consultation?: {
    join_url: string;
  };
  notes?: {
    reason?: string;
    symptoms?: string[];
    allergies?: string | null;
    problem?: string;
  };
  doctor: {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    department: string;
    slug: string;
  };
};
type AppointmentResponse = {
  success: boolean;
  filter: 'past' | 'upcoming';
  data: Appointment[];
};
const Appointments = () => {

  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const { token } = useAuth();
  const { data: appointments = [], isLoading, isError } = useAppointments(activeTab, token!);
  const appointmentTabs: TabItem[] = [
    {
      key: "upcoming",
      label: "Upcoming",
      content: isLoading ? (
        <ActivityIndicator />
      ) : (
        <AllUpcomingAppointment
          appointments={appointments}
          isLoading={isLoading}
        />
      ),
    },
    {
      key: "past",
      label: "Past",
      content: isLoading ? (
        <ActivityIndicator />
      ) : (
        <AllPastAppointment appointments={appointments} isLoading={isLoading} />
      ),
    },
  ];
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Failed to load appointments</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white p-5 pb-0">
      <Tab
        tabs={appointmentTabs}
        defaultTab="upcoming"
        onTabChange={(key) => setActiveTab(key as "upcoming" | "past")}
      />
    </View>
  );
};
export default Appointments;