import { ImageSourcePropType } from "react-native";

export type FaqAccordian = {
  id?: string | number;
  title: string;
  description: string | null;
  content?: React.ReactNode;
  icon?: React.ReactNode | string | ImageSourcePropType;
};
