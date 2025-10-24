import { FaqAccordian } from "../types/faq" 
import { Clipboard, FileText, Stethoscope } from "lucide-react-native";

export const FaqAccordianData: FaqAccordian[] = [
    {
      id: "medical-records",
      title: "Medical Records",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.",
      icon: <FileText size={16} color="#111827" />,
    },
    {
      id: "lab-tests",
      title: "Lab Tests",
      description: "View and download your lab test reports, filter by date and type.",
      icon: <Clipboard size={16} color="#111827" />,
    },
    {
      id: "appointments",
      title: "Doctor Appointments",
      description: "Check upcoming and past appointments, reschedule or cancel appointments from here.",
      icon: <Stethoscope size={16} color="#111827" />,
    },
  ];