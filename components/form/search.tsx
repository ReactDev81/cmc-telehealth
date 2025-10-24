import { View, TextInput, TextInputProps } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchBarProps extends TextInputProps {
    variant?: 'primary' | 'secondary';
}

const SearchBar = ({ variant = 'primary', placeholder, ...props }: SearchBarProps) => {
    const isPrimary = variant === 'primary';
    
    return (
        <View 
            className={`flex-row items-center px-4 py-3 rounded-xl ${
                isPrimary 
                    ? 'bg-transparent border border-white' 
                    : 'bg-white border border-[#929292]'
            }`}
        >
            <Search 
                size={20} 
                color={isPrimary ? '#fff' : '#929292'} 
            />
            <TextInput
                placeholder={placeholder || "Search..."}
                placeholderTextColor={isPrimary ? '#fff' : '#929292'}
                className={`flex-1 ml-3 text-base leading-5 py-1 ${
                    isPrimary ? 'text-white' : 'text-[##929292]'
                }`}
                {...props}
            />
        </View>
    );
};

export default SearchBar;