import React, { useState } from "react";
import Product from "./Product";
import { motion } from "framer-motion";

const Products = () => {
  const products = [
    {
      title: "Crop Prediction",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus repudiandae quam aliquid accusamus ipsam a. Odio, reiciendis alias!",
      live: true,
      case: false,
    },
    {
      title: "Climate Bot",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus repudiandae quam aliquid accusamus ipsam a. Odio, reiciendis alias!",
      live: true,
      case: false,
    },
    {
      title: "Disease Bot",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus repudiandae quam aliquid accusamus ipsam a. Odio, reiciendis alias!",
      live: true,
      case: false,
    },
    {
      title: "Voice Assistance",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus repudiandae quam aliquid accusamus ipsam a. Odio, reiciendis alias!",
      live: true,
      case: true,
    },
  ];

  const images = [
    "https://images.unsplash.com/photo-1505471768190-275e2ad7b3f9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1561969310-fa2e856250ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D",
    "https://images.unsplash.com/photo-1606701587683-c4b1b22c59d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1627276272431-e36f8554da46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM0fHx8ZW58MHx8fHx8",
  ];

  const [position, setPosition] = useState(0);

  const mover = (val) => {
    setPosition(val * 17);
  };

  return (
    <div className="mt-32 relative">
      {products.map((val, index) => (
        <Product key={index} val={val} mover={mover} count={index} />
      ))}

      <div className="w-full h-full absolute top-0 -right-40 pointer-events-none">
        <motion.div
          initial={{ y: position, x: "-50%" }}
          animate={{ y: position + `rem` }}
          transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.6 }}
          className="window absolute w-[26rem] h-[17rem] left-[50%] -translate-x-[50%] overflow-hidden"
        >
          {images.map((img, index) => (
            <motion.div
              key={index}
              animate={{ y: -position + `rem` }}
              transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
              className="w-full h-full"
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Products;
