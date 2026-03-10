import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    currentPage: number;
    lastPage: number;
    paginationLength: number;
    paginationTotal: number;
    paginationLabel: string;
    onPageChange: (page: number) => void;
};

const Pagination = ({ 
    currentPage, 
    lastPage, 
    onPageChange, 
    paginationLength, 
    paginationTotal, 
    paginationLabel 
}: Props) => {

    const getPages = () => {
        const range = [];
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(lastPage, currentPage + 1); i++) {
            range.push(i);
        }
        return range;
    };
  
    return (
        <View className="mt-2">

            {/* Results Count Label */}
            <View className="items-center mb-6">
                <View className="bg-gray-100 px-4 py-1.5 rounded-full">
                    <Text className="text-[11px] font-semibold text-black-400 uppercase tracking-widest">
                        Showing {paginationLength} of {paginationTotal} {paginationLabel}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center justify-between bg-primary-100 rounded-2xl p-3 border border-black-200">

                {/* Prev Button */}
                <TouchableOpacity
                    disabled={currentPage === 1}
                    onPress={() => onPageChange(currentPage - 1)}
                    activeOpacity={0.7}
                    className={`w-11 h-11 items-center justify-center rounded-xl bg-white shadow-sm border border-black-200 ${currentPage === 1 ? 'opacity-30' : ''}`}
                >
                    <ChevronLeft size={20} color="#013220" />
                </TouchableOpacity>

                {/* Page Numbers Row */}
                <View className="flex-row items-center gap-x-2">
                    {getPages().map((page) => (
                        <TouchableOpacity
                            key={page}
                            onPress={() => onPageChange(page)}
                            className={`w-9 h-9 items-center justify-center rounded-lg ${page === currentPage ? 'bg-primary' : 'bg-transparent'}`}
                        >
                            <Text className={`text-sm font-bold ${page === currentPage ? "text-white" : "text-black"} `}>
                                {page}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    disabled={currentPage === lastPage}
                    onPress={() => onPageChange(currentPage + 1)}
                    className={`w-11 h-11 items-center justify-center rounded-xl bg-white shadow-sm border border-black-200 ${currentPage === lastPage ? 'opacity-30' : ''}`}
                >
                    <ChevronRight size={20} color="#013220" />
                </TouchableOpacity>

            </View>
        </View>
    );
};  

export default Pagination;