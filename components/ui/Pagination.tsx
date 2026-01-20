import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, lastPage, onPageChange }: Props) => {
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <View className="flex-row justify-center items-center mt-6 gap-x-2">
      {/* Prev */}
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
      >
        <Text className="px-3 py-2 text-gray-700">‹</Text>
      </TouchableOpacity>

      {/* Page numbers */}
      {pages.map((page) => (
        <TouchableOpacity
          key={page}
          onPress={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md ${
            page === currentPage
              ? "bg-blue-600"
              : "bg-gray-200"
          }`}
        >
          <Text
            className={`${
              page === currentPage ? "text-white" : "text-black"
            }`}
          >
            {page}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Next */}
      <TouchableOpacity
        disabled={currentPage === lastPage}
        onPress={() => onPageChange(currentPage + 1)}
      >
        <Text className="px-3 py-2 text-gray-700">›</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
