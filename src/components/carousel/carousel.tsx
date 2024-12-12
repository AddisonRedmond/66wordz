import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselButton, useDotButton } from "./carousel-button";

import "../../styles/embla.css";

type CarouselProps = {
  slides: Record<string, JSX.Element>;
};

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 10 * 1000 }),
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className="embla rounded-md border-2">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {Object.values(slides).map((slide, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                {slide}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-center gap-x-3 py-2">
          {scrollSnaps.map((_, index) => (
            <CarouselButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              style={{}}
              className={"size-3 rounded-full outline outline-1 outline-zinc-700 duration-150 ease-in-out".concat(
                index === selectedIndex ? " " + "bg-zinc-700" : "",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
