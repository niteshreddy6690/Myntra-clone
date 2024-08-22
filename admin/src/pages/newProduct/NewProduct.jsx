import { useState, useEffect, useRef } from "react";
import "./newProduct.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import Topbar from "../../components/topbar/Topbar";
import { addProduct } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";
import axios from "axios";
import Select from "react-select";
import styled from "styled-components";
import ChevronRightTwoToneIcon from "@mui/icons-material/ChevronRightTwoTone";
import ArrowDropDownTwoToneIcon from "@mui/icons-material/ArrowDropDownTwoTone";
import ArrowRightTwoToneIcon from "@mui/icons-material/ArrowRightTwoTone";

import transparentFolderImage from "../../Assets/png/folder_icon_transparent.png";
import closeIconSvg from "../../Assets/svg/CloseIcon.svg";
import { request } from "../../utils/api/axios";
import Category from "../../components/Category/Category";
import CircularLoader from "../../FramerMotionComponents/CircularLoader";
import { encode } from "blurhash";
import { useNavigation } from "react-router-dom";
import { encodeImageToBlurhash } from "../../utils/BlurhashEncoder";

const MainContainer = styled.div`
  box-sizing: border-box;
  height .d-tree-container {
    list-style: none;
  }
  ul {
    list-style: none;
    margin-block-start: 0px;
    margin-block-end: 16px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 15px;
  }
  li {
    margin: 5px;
  }
  .modify {
    vertical-align: middle;
    height: 25px;
    align-items: center;
    display: flex;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 36px 38px;
  /* box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px; */
  border-radius: 20px;
  text-align: center;
`;
const Image = styled.img`
  width: ${({ isLarge }) => (isLarge ? "150px" : "115px")};
  height: ${({ isLarge }) => (isLarge ? "200px" : "140px")};
  opacity: ${({ isLarge }) => (isLarge ? "1" : ".8")};
  margin: 15px;
  object-fit: cover;
  border-radius: 5px;
`;

const Input = styled.input`
  display: none;
`;
const DraggableDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  margin-top: 20px;
  border: 1.3px dashed #799cd9;
  border-radius: 5px;
  min-width: 450px;
  min-height: 350px;
  width: 650px;
  background-color: #fff;

  label {
    width: 100px;
    margin: 0 0 0 10px;
    cursor: pointer;
  }
  label p {
    margin-top: -20px;
    color: #0a0a0a;
  }
`;

const ImagePreViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
`;
const ImagePreview = styled.div`
  position: relative;

  .closeIcon {
    background: #000;
    border-radius: 5px;
    opacity: 0.8;
    position: absolute;
    z-index: 10;
    right: 20px;
    top: 20px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    :hover {
      opacity: 1;
    }
  }
`;

export const Colors = [
  { name: "Green", hex: "#008000", rgb: "rgb(0, 128, 0)" },
  { name: "Pink", hex: "#FFC0CB", rgb: "rgb(255, 192, 203)" },
  { name: "Blue", hex: "#0000FF", rgb: "rgb(0, 0, 255)" },
  { name: "Red", hex: "#FF0000", rgb: "rgb(255, 0, 0)" },
  { name: "Yellow", hex: "#FFFF00", rgb: "rgb(255, 255, 0)" },
  { name: "Black", hex: "#000000", rgb: "rgb(0, 0, 0)" },
  { name: "Navy Blue", hex: "#000080", rgb: "rgb(0, 0, 128)" },
  { name: "Grey", hex: "#808080", rgb: "rgb(128, 128, 128)" },
  { name: "Purple", hex: "#800080", rgb: "rgb(128, 0, 128)" },
  { name: "Orange", hex: "#FFA500", rgb: "rgb(255, 165, 0)" },
  { name: "Maroon", hex: "#800000", rgb: "rgb(128, 0, 0)" },
  { name: "Beige", hex: "#F5F5DC", rgb: "rgb(245, 245, 220)" },
  { name: "White", hex: "#FFFFFF", rgb: "rgb(255, 255, 255)" },
  { name: "Peach", hex: "#FFE4B5", rgb: "rgb(255, 228, 181)" },
  { name: "Teal", hex: "#008080", rgb: "rgb(0, 128, 128)" },
  { name: "Brown", hex: "#A52A2A", rgb: "rgb(165, 42, 42)" },
  { name: "Turquoise Blue", hex: "#00CED1", rgb: "rgb(0, 206, 209)" },
  { name: "Cream", hex: "#FFFACD", rgb: "rgb(255, 250, 205)" },
  { name: "Mustard", hex: "#FFDB58", rgb: "rgb(255, 219, 88)" },
  { name: "Magenta", hex: "#FF00FF", rgb: "rgb(255, 0, 255)" },
  { name: "Sea Green", hex: "#2E8B57", rgb: "rgb(46, 139, 87)" },
  { name: "Off White", hex: "#F5F5F5", rgb: "rgb(245, 245, 245)" },
  { name: "Olive", hex: "#808000", rgb: "rgb(128, 128, 0)" },
  { name: "Gold", hex: "#FFD700", rgb: "rgb(255, 215, 0)" },
  { name: "Burgundy", hex: "#800020", rgb: "rgb(128, 0, 32)" },
  { name: "Lime Green", hex: "#32CD32", rgb: "rgb(50, 205, 50)" },
  { name: "Multi", hex: "#FFFFFF", rgb: "rgb(255, 255, 255)" }, // Placeholder for multi-color
  { name: "Lavender", hex: "#E6E6FA", rgb: "rgb(230, 230, 250)" },
  { name: "Rust", hex: "#B7410E", rgb: "rgb(183, 65, 14)" },
  { name: "Mauve", hex: "#E0B0FF", rgb: "rgb(224, 176, 255)" },
  { name: "Coral", hex: "#FF7F50", rgb: "rgb(255, 127, 80)" },
  { name: "Coffee Brown", hex: "#A52A2A", rgb: "rgb(165, 42, 42)" },
  { name: "Silver", hex: "#C0C0C0", rgb: "rgb(192, 192, 192)" },
  { name: "Charcoal", hex: "#36454F", rgb: "rgb(54, 69, 79)" },
  { name: "Rose", hex: "#FF007F", rgb: "rgb(255, 0, 127)" },
  { name: "Fluorescent Green", hex: "#00FF3C", rgb: "rgb(0, 255, 60)" },
  { name: "Copper", hex: "#B87333", rgb: "rgb(184, 115, 51)" },
  { name: "Taupe", hex: "#483C32", rgb: "rgb(72, 60, 50)" },
  { name: "Khaki", hex: "#C3B091", rgb: "rgb(195, 176, 145)" },
  { name: "Tan", hex: "#D2B48C", rgb: "rgb(210, 180, 140)" },
  { name: "Grey Melange", hex: "#B8B8B8", rgb: "rgb(184, 184, 184)" },
  { name: "Metallic", hex: "#BABABA", rgb: "rgb(186, 186, 186)" },
  { name: "Nude", hex: "#F3C2C2", rgb: "rgb(243, 194, 194)" },
  { name: "Bronze", hex: "#CD7F32", rgb: "rgb(205, 127, 50)" },
  { name: "Steel", hex: "#738595", rgb: "rgb(115, 133, 149)" },
  { name: "Lilac", hex: "#C8A2C8", rgb: "rgb(200, 162, 200)" },
  { name: "Slate", hex: "#708090", rgb: "rgb(112, 128, 144)" },
  { name: "Aqua Blue", hex: "#00FFFF", rgb: "rgb(0, 255, 255)" },
  { name: "Pearl", hex: "#F0EAD6", rgb: "rgb(240, 234, 214)" },
  { name: "Sky Blue", hex: "#87CEEB", rgb: "rgb(135, 206, 235)" },
  { name: "Lemon Yellow", hex: "#FFF44F", rgb: "rgb(255, 244, 79)" },
  { name: "Champagne", hex: "#F7E7CE", rgb: "rgb(247, 231, 206)" },
  { name: "Rose Gold", hex: "#B76E79", rgb: "rgb(183, 110, 121)" },
  { name: "Chocolate Brown", hex: "#3D1C00", rgb: "rgb(61, 28, 0)" },
  { name: "Ochre", hex: "#CC7722", rgb: "rgb(204, 119, 34)" },
  { name: "Plum Purple", hex: "#8E4585", rgb: "rgb(142, 69, 133)" },
  { name: "Electric Blue", hex: "#7DF9FF", rgb: "rgb(125, 249, 255)" },
  { name: "Emerald Green", hex: "#00C957", rgb: "rgb(0, 201, 87)" },
];

export default function NewProduct() {
  const options = [
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ];

  const GenderOptions = [
    { value: "Men", label: "Men" },
    { value: "Women", label: "Women" },
    { value: "Boys", label: "Boys" },
    { value: "Girls", label: "Girls" },
  ];
  const colorOptions = Colors.map((color) => ({
    value: color.hex,
    label: color.name,
    color: color.hex,
  }));
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: 0,
    }),
    option: (provided, { data }) => ({
      ...provided,
      backgroundColor: null,
      color: "#141414",
    }),
  };

  const initialState = {
    name: "",
    parentId: null,
    parentCategory: null,
  };

  const [inputs, setInputs] = useState({});
  const [category, setCategory] = useState({});
  const [brand, setBrand] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [data, setData] = useState(initialState);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [selectedImageFile, setSelectedImageFiles] = useState(null);
  const [productCreated, setProductCreated] = useState(null);
  const [percent, setPercents] = useState(0);
  const dispatch = useDispatch();
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const handelSort = () => {
    let _previewFiles = [...previewFiles];
    //remove and save the dragged item content
    const draggedItemContent = _previewFiles.splice(dragItem.current, 1)[0];
    //switch the position
    _previewFiles.splice(dragOverItem.current, 0, draggedItemContent);
    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    setPreviewFiles(_previewFiles);
  };

  const handelChange = (e) => {
    const selectedFiles = e.target.files;
    const selectedFileArray = Array.from(selectedFiles);
    const imageArray = selectedFileArray?.map((file) => {
      return {
        file: file,
        imgblob: URL.createObjectURL(file),
        imageType: file.type,
      };
    });

    setPreviewFiles((prev) => prev.concat(imageArray).slice(0, 8));
    e.currentTarget.value = null;
  };

  const storage = getStorage(app);
  // storage = firebase.storage();

  const callCategory = async () => {
    // const res = await request.get(`/category`);
    // if (res) setCategory(res.data);
  };
  const callBrand = async () => {
    const res = await request.get(`/brand`);
    if (res) setBrand(res.data);
  };
  useEffect(() => {
    callCategory();
    callBrand();
  }, [productCreated]);

  const handleClickCategory = (e, categoryId, categoryName) => {
    // e.stopPropagation();
    // setShow(!show);
    setData({ ...data, categoryId, categoryName });
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleColorChange = (values) => {
    const colorName = values?.label.replace(" ", "");
    setSelectedColor(colorName);
  };

  const uploadFiles = async (file) => {
    const retPromise = new Promise(function (resolve, reject) {
      const storageRef = ref(storage, `/Myntra Clone Images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      // promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setLoading(true);
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercents(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (urls) => {
            // setURLs((prevState) => [...prevState, urls]);
            let url = urls.replace(
              "https://firebasestorage.googleapis.com",
              "https://ik.imagekit.io/utywuh2nq"
            );

            // Generate Blurhash for the image
            // const image = new Image();
            // image.src = url;
            // image.onload = async () => {
            //   const canvas = document.createElement("canvas");
            //   const context = canvas.getContext("2d");
            //   canvas.width = image.width;
            //   canvas.height = image.height;
            //   context.drawImage(image, 0, 0, canvas.width, canvas.height);
            //   const imageData = context.getImageData(
            //     0,
            //     0,
            //     canvas.width,
            //     canvas.height
            //   );
            //   const blurhash = encode(
            //     imageData.data,
            //     canvas.width,
            //     canvas.height,
            //     4,
            //     3
            //   );

            //   const data = { url: url, name: file.name, blurhash: blurhash };
            //   resolve(data);
            // };
            const blurhash = await encodeImageToBlurhash(url);
            const data = { url: url, name: file.name, blurHashUrl: blurhash };

            resolve(data);
            //
            // return urls;
          });
        }
      );
    });
    return retPromise;
  };

  const handelUploadFiles = async (e) => {
    e.preventDefault();
    const status = previewFiles?.map((fileImages) =>
      uploadFiles(fileImages.file)
    );
    Promise.all(status)
      .then((imageData) => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setLoading(false);
        }, 2000);
        setSelectedImageFiles(imageData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClick = async (e) => {
    e.preventDefault();
    if (selectedImageFile) {
      const product = {
        ...inputs,
        gender: selectedGender.toLowerCase(),
        images: selectedImageFile,
        color: selectedColor.toLowerCase(),
        categories: data.categoryId,
        size: selectedSize,
      };
      const resp = await addProduct(product, dispatch);
      if (resp.status === 200) {
        setProductCreated(resp);
      } else {
      }
    }
  };

  return (
    <>
      <form className="addProductForm">
        <div className="newProduct">
          <div>
            <h2 className="addProductTitle">Create New Product</h2>
            <div className="addProductItem">
              <label>Brand</label>
              <select
                name="brand"
                value={inputs?.brand}
                onChange={handleChange}
              >
                {brand?.length > 0 &&
                  brand?.map((option, i) => (
                    <option key={i} value={option?.name}>
                      {option.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="addProductItem">
              <label>Description</label>
              <input
                name="description"
                type="text"
                value={inputs?.description}
                placeholder="description..."
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label>Price</label>
              <input
                name="price"
                type="number"
                placeholder="100"
                value={inputs?.price}
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label>Percentage discount</label>
              <input
                name="discountPercentage"
                type="number"
                placeholder="100"
                value={inputs?.discountPercentage}
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label>Gender</label>
              <Select
                defaultValue={selectedGender}
                onChange={(values) => {
                  setSelectedGender(values.value);
                }}
                options={GenderOptions}
              />
            </div>
            <div className="addProductItem">
              <label>Colors</label>
              <Select
                options={colorOptions}
                onChange={handleColorChange}
                getOptionLabel={(option) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        backgroundColor: option.color,
                        width: "20px",
                        height: "20px",
                        marginRight: "10px",
                        borderRadius: "5px",
                      }}
                    ></div>
                    {option.label}
                  </div>
                )}
                getOptionValue={(option) => option.label}
                styles={customStyles}
              />
            </div>
            <div className="addProductItem">
              <label>Size</label>
              <Select
                defaultValue={selectedSize}
                onChange={(values) => {
                  setSelectedSize(values.map((option) => option.value));
                }}
                options={options}
                isMulti
              />
            </div>
            <div className="addProductItem">
              <label>Categories</label>
              <input
                type="text"
                placeholder="jeans"
                value={data?.categoryName}
              />
            </div>
            <div className="addProductItem">
              <label>Stock</label>
              <select name="inStock" onChange={handleChange}>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
            <button onClick={handleClick} className="addProductButton">
              Create New Product
            </button>
          </div>
          <div>
            <div className="addProduct">
              <Wrapper>
                <Container>
                  <h3>Upload Product Images</h3>
                  <p>Select multiple images </p>
                  <DraggableDiv>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handelChange}
                      multiple
                      accept="image/*"
                    />
                    {previewFiles.length > 0 ? (
                      <>
                        {previewFiles?.map((img, i) => (
                          <ImagePreViewWrapper>
                            <ImagePreview
                              key={i}
                              draggable
                              onDragStart={(e) => (dragItem.current = i)}
                              onDragEnter={(e) => (dragOverItem.current = i)}
                              onDragEnd={handelSort}
                            >
                              <Image
                                src={img.imgblob}
                                isLarge={i == 0 ? 1 : 0}
                              />
                              <div
                                onClick={() => {
                                  setPreviewFiles(
                                    previewFiles?.filter((e) => e != img)
                                  );

                                  setSelectedImageFiles(
                                    selectedImageFile?.filter(
                                      (e) => e?.name != img?.file.name
                                    )
                                  );
                                }}
                              >
                                <img className="closeIcon" src={closeIconSvg} />
                              </div>
                            </ImagePreview>
                          </ImagePreViewWrapper>
                        ))}
                        {previewFiles.length < 8 &&
                        previewFiles.length !== 0 ? (
                          <label htmlFor="file-upload">
                            <img
                              src={transparentFolderImage}
                              draggable={false}
                              style={{ width: "100px", height: "100px" }}
                              alt="Upload"
                            />
                            <p>Add {8 - previewFiles.length} more Photo</p>
                          </label>
                        ) : null}
                      </>
                    ) : (
                      <div draggable={false}>
                        <label htmlFor="file-upload">
                          <img
                            src={transparentFolderImage}
                            draggable={false}
                            style={{ width: "100px", height: "100px" }}
                            alt="Upload"
                          />
                          <p>Click here to upload</p>
                        </label>
                      </div>
                    )}
                  </DraggableDiv>
                </Container>
              </Wrapper>
              <div className="upload-button-container">
                {!isLoading && !isSuccess ? (
                  <button
                    onClick={handelUploadFiles}
                    className="upload-file-button"
                  >
                    <p>Upload Now</p>
                  </button>
                ) : null}

                <div className="circularLoader">
                  {isLoading ? <CircularLoader /> : null}
                  {isSuccess ? (
                    <svg
                      className="check"
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : null}
                </div>
                {isLoading || isSuccess ? (
                  <div className="progressbar">
                    <span
                      style={
                        !isSuccess
                          ? { width: `${percent}%` }
                          : { animation: "none", width: "100%" }
                      }
                    ></span>
                  </div>
                ) : null}
              </div>
            </div>

            <Category handleClick={handleClickCategory} data={data} />
          </div>
        </div>
      </form>
    </>
  );
}
