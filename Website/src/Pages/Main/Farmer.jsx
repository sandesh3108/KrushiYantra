import {
  Bell,
  Leaf,
  Settings,
  Thermometer,
  Bot,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sun, CloudSun, Moon } from "lucide-react";
import RotatingText from "../../components/Animated/RotatingText";
import { Button, GridDistortion } from "../../components/component";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Farmer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  const botOptions = [
    {
      name: "Crop Prediction",
      image:
        "https://images.unsplash.com/photo-1594771804886-a933bb2d609b?q=80&w=2082&auto=format&fit=crop",
      route: "crop-bot",
    },
    {
      name: t("climate_bot"),
      image:
        "https://images.unsplash.com/photo-1594771804886-a933bb2d609b?q=80&w=2082&auto=format&fit=crop",
      route: "climate-bot",
    },
    {
      name: t("disease_bot"),
      image:
        "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "disease-bot",
    },
    {
      name: t("recommendation_bot"),
      image:
        "https://images.unsplash.com/photo-1656407410275-e63e689bcd90?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "recommendation-bot",
    },
    {
      name: t("voice_assist"),
      image:
        "https://images.unsplash.com/photo-1518931169559-527a99b4074d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "voice-assist",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12)
      return {
        text: t("good_morning"),
        icon: <Sun className="w-6 h-6 text-yellow-500" />,
      };
    if (hour < 18)
      return {
        text: t("good_afternoon"),
        icon: <CloudSun className="w-6 h-6 text-orange-500" />,
      };
    return {
      text: t("good_evening"),
      icon: <Moon className="w-6 h-6 text-blue-500" />,
    };
  };

  const handleBotNavigation = (route) => {
    navigate(route);
  };

  const { text, icon } = getGreeting();

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col w-full h-full lg:flex-row lg:items-center">
        <div className="left w-full h-full lg:w-[55%] relative">
          <div
            className="absolute top-[35%] xl:top-[30%] -translate-y-1/2 px-4 sm:px-6 md:px-10 lg:px-16 text-black z-10"
            style={{ pointerEvents: "none" }}
          >
            <div>
              <Button
                variant="default"
                className="font-extralight bg-zinc-200 backdrop-blur-3xl border border-white"
              >
                {t("agriculture_technology")}
              </Button>
            </div>
            <div>
              <div className="masker">
                <div className="w-fit flex items-baseline">
                  <h1 className="uppercase text-4xl md:text-5xl lg:text-6xl leading-[48px] md:leading-[115px]">
                    {t("revolutionizing")}
                  </h1>
                </div>
              </div>
              <div className="masker">
                <div className="w-fit flex items-baseline">
                  <h1 className="uppercase text-4xl md:text-5xl lg:text-6xl leading-[48px] md:leading-[30px] lg:leading-[25px]">
                    {t("agriculture_through")}
                  </h1>
                </div>
              </div>
              <div className="masker">
                <div className="w-fit flex items-baseline">
                  <RotatingText
                    texts={[
                      t("krushi_yantra"),
                      t("climate_bot"),
                      t("disease_bot"),
                      t("voice_assist"),
                      t("gov_schemes"),
                      t("agriculture"),
                    ]}
                    mainClassName="uppercase text-4xl md:text-5xl lg:text-6xl leading-[48px] md:leading-[95px]"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={3500}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="black"
                className="px-8 py-2 font-semibold rounded-lg"
              >
                {t("get_started")}
              </Button>
            </div>
          </div>
        </div>
        <div className="right w-full h-full lg:h-[90%] lg:w-[43%] px-6 md:px-10 py-6 mb-2 xl:mb-24">
          <div className="img h-full w-full rounded-2xl relative z-0">
            <div className="w-full h-full object-cover rounded-2xl">
              <GridDistortion
                key={currentImage}
                imageSrc={botOptions[currentImage].image}
                grid={10}
                mouse={0.1}
                strength={0.15}
                relaxation={0.9}
                className="custom-class rounded-2xl"
              />
              {/* Go To Button */}
              <div className="absolute bottom-8 left-8 z-10">
                <button
                  className="group flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg hover:bg-[#C7E6A5] transition-all duration-300"
                  onClick={() =>
                    handleBotNavigation(botOptions[currentImage].route)
                  }
                >
                  <span className="font-semibold text-black group-hover:text-white transition-colors duration-300">
                    {t("go_to")} {botOptions[currentImage].name}
                  </span>
                  <ArrowRight className="w-5 h-5 text-black group-hover:text-white transition-colors duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 absolute right-[50%] lg:right-[35%] top-[60%] lg:top-[70%] transform -translate-y-1/2">
          {botOptions.map((bot, index) => (
            <div key={index} className="group relative flex items-center">
              <button
                onClick={() => setCurrentImage(index)}
                className={`w-fit h-12 rounded-full flex gap-2 px-2 font-light ${
                  currentImage === index
                    ? "bg-[#C7E6A5] text-black"
                    : "bg-white text-[#C7E6A5]"
                } shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center font-semibold z-10`}
              >
                <Bot className="w-6 h-6" />
                <h1>{bot.name}</h1>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-full bg-amber-200"></div>
    </div>
  );
};

export default Farmer;
