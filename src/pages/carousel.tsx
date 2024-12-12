import Carousel from "~/components/carousel/carousel";

const Slide: React.FC = () => {
  return <p>This is a slide component</p>;
};

const SlideTwo: React.FC = () => {
  return <p>This is also a slide component</p>;
};

const CarouselTest = () => {
  return (
    <div>
      <Carousel slides={{ slide1: <Slide />, slide2: <SlideTwo />, slide3: <SlideTwo /> }} />
    </div>
  );
};

export default CarouselTest;
