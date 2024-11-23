import { BranchModel } from "../models/branch.model.js";

export const getABranchByQuery = async (query = {}) => {
  const branch = await BranchModel.findOne(query);
  return branch;
};

export const getBranchesByQuery = async (query = {}) => {
  const branches = await BranchModel.find(query);
  return branches;
};
