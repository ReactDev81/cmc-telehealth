import { Star, StarHalf } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: number;
    onRatingChange?: (rating: number) => void;
    showRatingText?: boolean;
    className?: string;
    color?: string;
}

const StarRating = ({
    rating,
    maxStars = 5,
    size = 20,
    onRatingChange,
    showRatingText = false,
    className = "",
    color = "#FBBF24" // Primary gold/yellow
}: StarRatingProps) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= maxStars; i++) {
        const isFull = i <= fullStars;
        const isHalf = !isFull && i === fullStars + 1 && hasHalfStar;

        stars.push(
            <TouchableOpacity
                key={i}
                activeOpacity={onRatingChange ? 0.7 : 1}
                onPress={() => onRatingChange?.(i)}
                disabled={!onRatingChange}
            >
                {isFull ? (
                    <Star size={size} color={color} fill={color} />
                ) : isHalf ? (
                    <StarHalf size={size} color={color} fill={color} />
                ) : (
                    <Star size={size} color="#CBD5E1" />
                )}
            </TouchableOpacity>
        );
    }

    return (
        <View className={`flex-row items-center gap-x-1 ${className}`}>
            <View className="flex-row gap-x-0.5">
                {stars}
            </View>
            {showRatingText && (
                <Text className="text-black-400 text-sm font-medium ml-2">
                    {rating.toFixed(1)}
                </Text>
            )}
        </View>
    );
};

export default StarRating;
