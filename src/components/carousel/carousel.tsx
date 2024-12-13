import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselButton, useDotButton } from "./carousel-button";

import "../../styles/embla.css";
import { GameDetails } from "~/utils/types";

type CarouselProps = {
  slides: GameDetails;
};

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 10 * 1000 }),
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className="embla m-atuo max-w-96 rounded-md shadow-md outline outline-1 outline-zinc-200">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="embla__container px-2">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number flex flex-col">
                <h3 className="grid h-1/3 place-content-center text-xl">
                  {slide.header}
                </h3>
                <div className="grid flex-grow place-content-center text-sm font-normal">
                  {slide.content}
                </div>
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
