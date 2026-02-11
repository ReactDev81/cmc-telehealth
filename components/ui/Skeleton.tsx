import { useEffect } from 'react';
import { DimensionValue } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    variant?: 'rect' | 'circle';
    className?: string;
    style?: any;
}

const Skeleton = ({
    width = '100%',
    height,
    variant = 'rect',
    className = '',
    style
}: SkeletonProps) => {
    const opacity = useSharedValue(0.3);

    // Default heights based on variant
    const defaultHeight = variant === 'circle' ? 48 : 20;
    const finalHeight = height ?? defaultHeight;

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const borderRadius = variant === 'circle' ? 9999 : 8;

    return (
        <Animated.View
            style={[
                { width, height: finalHeight, borderRadius, backgroundColor: '#E2E8F0' },
                animatedStyle,
                style
            ]}
            className={className}
        />
    );
};

export default Skeleton;
