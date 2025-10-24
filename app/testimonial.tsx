import { View, FlatList } from "react-native"
import { TestimonialProps } from "../types/home";
import Testimonial from "../components/home/testimonial";
import { TestimonialData } from "../json-data/home";


const Testimonials = () => {

    const renderItem = ({item}: {item: TestimonialProps}) => {
        return (
            <Testimonial
                className="max-w-full mb-5"
                image={item.image}
                name={item.name}
                age={item.name}
                city={item.city}
                title={item.title}
                description={item.description}
                review_count={item.review_count}
            />
        );
    };

    return(
        <View className="flex-1 bg-white p-5">
            <FlatList
                data={TestimonialData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}

export default Testimonials