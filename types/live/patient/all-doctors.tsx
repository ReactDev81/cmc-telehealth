 export interface FiltersModalProps {
    visible: boolean;
    onClose: () => void;
    filters: {
      departmentId?: string;
      symptomName?: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<any>>;
}  