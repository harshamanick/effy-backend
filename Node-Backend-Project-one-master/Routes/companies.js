import express from "express";
import lodash from "lodash";
import {
  Companies,
  ValidateCompany,
  ValidateExistingCompany,
} from "../models/companies.js";
import { User } from "../models/Users.js";
import { getPosition } from "../location/geocodeLocation.js";

const route = express.Router();

route.get("/get_company_details_by_id", async (req, res) => {
  const id = req.query.id;

  try {
    const result = await Companies.find({ _id: id });
    res.status(200).send(result);
  } catch (err) {
    console.log("ERROR", err);
    res.send(500, err);
  }
});
route.post("/new_company", async (req, res) => {
  try {
    const companyData = lodash.pick(req.body, [
      "company_name",
      "company_address_1",
      "company_address_2",
      "pincode",
    ]);
    const location = `${companyData?.company_address_1} ${companyData?.company_address_2} ${companyData?.pincode}`;
    const position = await getPosition(location);
    companyData.position = [position?.latitude, position?.longitude];
    const { error } = ValidateCompany(companyData);
    if (error) {
      return res.status(400).send(error);
    }

    const company = new Companies(companyData);
    const result = await company.save();
    const response = await Companies.find({});
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});
route.delete("/delete_company_by_id", async (req, res) => {
  const companyId = req?.query?.id;
  try {
    const result = await Companies.findByIdAndRemove(companyId);
    const deleteUsers = await User.deleteMany({ company_id: companyId });
    const response = await Companies.find({});
    if (!result) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});
route.put("/update_company_by_id", async (req, res) => {
  let companyData = req?.body;
  const location = `${companyData?.company_address_1} ${companyData?.company_address_2} ${companyData?.pincode}`;
  const position = await getPosition(location);
  companyData.position = [position?.latitude, position?.longitude];
  const { error } = ValidateExistingCompany(companyData);
  if (error) {
    return res.status(400).send(error);
  }

  try {
    const isCompaniesExist = await Companies.findOne({ _id: companyData._id });
    if (!isCompaniesExist) {
      return res.status(404).send("Companies not found");
    }
    const updatedCompany = await Companies.findOneAndUpdate(
      { _id: companyData?._id },
      companyData,
      { new: true }
    );
    res.status(200).send(updatedCompany);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});
route.get("/get_all_companies", async (req, res) => {
  try {
    const companies = await Companies.find({});
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});
export const companies = route;
