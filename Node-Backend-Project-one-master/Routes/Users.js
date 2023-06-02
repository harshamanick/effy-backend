import express from "express";
import lodash from "lodash";
import { User, ValidateUser, validateExsistingUser } from "../models/Users.js";
export const route = express.Router();

route.get("/get_user_details_by_id/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await User.findById(id);
    if (!result) {
      return res.status(404).send("User not found");
    }
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});

route.post("/new_user", async (req, res) => {
  const { error } = ValidateUser(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  try {
    const userData = lodash.pick(req.body, [
      "email",
      "company_id",
      "first_name",
      "last_name",
      "dob",
      "designation",
      "is_active",
    ]);
    const isExistUser = await User.findOne({ email: userData.email });
    if (isExistUser) {
      return res.status(400).send("User already exists");
    }

    const user = new User(userData);
    const result = await user.save();
    const response = await User.find({ company_id: req?.body?.company_id });

    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});

route.delete("/delete_user", async (req, res) => {
  const userId = req?.query?.id;
  const userData = await User.findOne({ _id: userId });
  const companyId = userData?.company_id;

  try {
    const result = await User.findByIdAndRemove(userId);
    if (!result) {
      return res.status(404).send("User not found");
    }
    const response = await User.find({ company_id: companyId });
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});

route.put("/update_user", async (req, res) => {
  const { error } = validateExsistingUser(req.body);
  const companyId = req?.body?.company_id;
  const requestBody = req?.body;

  if (error) {
    return res.status(400).send(error);
  }

  try {
    const isUserExist = await User.findOne({ _id: req?.body?._id });
    if (!isUserExist) {
      return res.status(404).send("User not found");
    }

    const isExistingEmail = await User.findOne({
      email: req?.body?.email,
      _id: { $ne: req?.body?._id } // Exclude the current user from the query
    });

    if (isExistingEmail) {
      return res.status(400).send("Email already used by another user");
    }

    if (req?.body?.migrate_id) {
      req.body.company_id = req.body.migrate_id;
      delete req.body.migrate_id;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: requestBody._id },
      requestBody,
      { new: true }
    );

    const response = await User.find({ company_id: companyId });
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});
route.get("/get_all_users_by_id", async (req, res) => {
  const company_id = req.query.id;

  try {
    const result = await User.find({ company_id: company_id });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});
export const users = route;
