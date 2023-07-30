const Category = require("../models/Category");
const catchAsync = require("../utils/catchAsync");
const slugify = require("slugify");
const mongoose = require("mongoose");
const { resendOtp } = require("./authController");

const createCategory = catchAsync(async (req, res) => {
  console.log("req.body", req.body);
  const { name, namepath, parentId, categoryTypes } = req.body;
  const categoryObject = {
    name: name.toLowerCase(),
    namepath: namepath.toLowerCase(),
    categoryTypes,
  };
  console.log("categoryObject", categoryObject);
  if (parentId) {
    categoryObject.parentId = mongoose.Types.ObjectId(parentId);
  }
  let createdCategory;
  const categories = await Category.find({});

  if (categories.length > 0) {
    let checking = false;
    for (let i = 0; i < categories.length; i++) {
      if (
        categories[i]["name"].toLowerCase() === req.body.name.toLowerCase() &&
        categories[i]["parentId"] == req.body.parentId.trim
      ) {
        checking = true;
        break;
      }
    }
    if (checking == false) {
      createdCategory = await Category.create(categoryObject);
    } else {
      return res.status(200).json({ Message: "category already exist" });
    }
  } else {
    createdCategory = await Category.create(categoryObject);
  }

  //   console.log("category", category);
  res.status(200).send(createdCategory);
  //    await new Category(data).save();\
  //   return await new Category(data).save();
});
// const getCategory = catchAsync(async (req, res) => {});

// Get all category
const getAllCategory = catchAsync(async (req, res) => {
  let parentId = null;
  const categories = await Category.find({});
  if (!categories) return res.json("No cart Found");
  //   const allCategories = nestedCategories(categories);
  res.status(200).send(nestedCategories(categories, parentId));
});

// This is a recursive  Function
function nestedCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId !== null && parentId !== "") {
    // console.log("calling if condition");
    category = categories.filter(
      (cat) => String(cat.parentId) == String(parentId)
    );
  } else {
    // console.log("calling else condition");
    category = categories.filter((cat) => cat.parentId == null);
  }
  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      namepath: cate.namepath,
      parentId: cate.parentId,
      categoryPath: cate?.categoryPath,
      children: nestedCategories(categories, cate._id),
    });
  }
  return categoryList;
}

const getCategory = catchAsync(async (req, res) => {
  const { parentId } = req.body;
  console.log("64af04ad5e254e45e913930a");
  const category = await Category.find({ parentId });
  console.log("category", category);
});

const deleteCategories = async (req, res) => {
  const { id } = req.params;

  const deleteCategory = await Category.findOneAndDelete({
    _id: id,
  });
  if (!deleteCategory) {
    return res.status(404).send({ message: "Category not Exist" });
  }
  res.status(200).send(deleteCategory);
  //   if (deletedCategories.length == ids.length) {
  //     res.status(201).json({ message: "Categories removed" });
  //   } else {
  //     res.status(400).json({ message: "Something went wrong" });
  //   }
};

module.exports = {
  createCategory,
  getAllCategory,
  getCategory,
  deleteCategories,
};
