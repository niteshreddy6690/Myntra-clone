// Import main page Slider  Images

import slide1 from "../../Assets/Images/Slider1.webp";
import slide2 from "../../Assets/Images/slider2.webp";
import slide4 from "../../Assets/Images/slider4.webp";
import slide5 from "../../Assets/Images/slider5.webp";
import slide6 from "../../Assets/Images/Slider2.jpeg";
import slide7 from "../../Assets/Images/slider7.webp";
import slide8 from "../../Assets/Images/WomenSlider0.webp";

// Import Men plage Slide Images

import menSlider1 from "../../Assets/Images/MenSlider1.jpeg";
import menSlider2 from "../../Assets/Images/MenSlider2.webp";

import menSlider3 from "../../Assets/Images/MenSlider3.jpeg";
import menSlider4 from "../../Assets/Images/MenSlider4.webp";

export const menSlider = [
  {
    id: 1,
    to: "/men",
    img: `${menSlider1}`,
  },
  {
    id: 1,
    to: "/men",
    img: `${menSlider2}`,
  },
  {
    id: 1,
    to: "/men-tshirts?brand=Puma",
    img: `${menSlider3}`,
  },
  {
    id: 1,
    to: "/men-tshirts?brand=HRX+by+Hrithik+Roshan",
    img: `${menSlider4}`,
  },
];

export const sliders = [
  // {
  //   id: "1",
  //   to: "/shirts?rawQuery=shirts",
  //   img: `${slide1}`,
  // },
  {
    id: "1",
    to: "/men-casual-shirt",
    img: `${slide4}`,
  },
  {
    id: "2",
    to: "/women-ethnic-wear",
    img: `${slide2}`,
  },

  {
    id: "3",
    to: "/men-tshirts?brand=HRX+by+Hrithik+Roshan",
    img: `${slide5}`,
  },
  {
    id: "4",
    to: "/men-tshirts?brand=WROGN",
    img: `${slide6}`,
  },
  {
    id: "5",
    to: "/women",
    img: `${slide7}`,
  },
];
