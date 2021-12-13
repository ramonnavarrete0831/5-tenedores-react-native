import React from "react";
import { Image } from "react-native-elements";
import Carousel from "react-native-snap-carousel";

export default function CarouselImages(props) {
  const { arrayImages, height, width } = props;

  const rederItem = ({ item }) => {
    return (
      <Image style={{ width: width, height: height }} source={{ uri: item }} />
    );
  };
  return (
    <Carousel
      layout={"default"}
      data={arrayImages}
      sliderWidth={width}
      itemWidth={width}
      renderItem={rederItem}
    />
  );
}
