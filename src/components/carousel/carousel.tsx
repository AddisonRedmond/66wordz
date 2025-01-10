import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselButton, useDotButton } from "./carousel-button";
import styles from "../../styles/embla.module.css";

import { GameDetails } from "~/utils/types";

type CarouselProps = {
  slides: GameDetails;
  header?: JSX.Element;
};

const Carousel: React.FC<CarouselProps> = ({ slides, ...props }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 10 * 1000 }),
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section
      className={`${styles.embla} m-auto max-w-96 rounded-md bg-white py-4 shadow-md outline outline-1 outline-zinc-200`}
    >
      {props.header}
      <div
        className="grid h-52 max-w-full place-content-center overflow-hidden"
        ref={emblaRef}
      >
        <div className={`${styles.embla__container} max-w-96`}>
          {slides.map((slide, index) => (
            <div className={styles.embla__slide} key={index}>
              <div className={`${styles.embla__slide__number} flex flex-col`}>
                <div className="grid flex-grow place-content-center text-wrap text-center text-sm font-normal">
                  {slide.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </section>
  );
};

export default Carousel;
