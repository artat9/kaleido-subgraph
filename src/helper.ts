import fs from "fs";
import path from "path";

export const getPostManagerABI = () => {
  return getABI(getCompiledPostManagerPath());
};

export const getVoucherABI = () => {
  return getABI(getCompiledVoucherPath());
};

const getABI = (path: string) => {
  const compiled = JSON.parse(fs.readFileSync(path).toString());
  return compiled.abi;
};

export const getPostManagerAddress = (network: string) => {
  return getAddress(getDeployedPostManagerPath(network));
};

const getAddress = (path: string) => {
  const json = JSON.parse(fs.readFileSync(path).toString());
  return json.address;
};

export const getCompiledPostManagerPath = () =>
  path.join(
    __dirname,
    "..",
    "aurora-core",
    "build",
    "artifacts",
    "contracts",
    "PostManager.sol",
    "PostManager.json"
  );

export const getCompiledVoucherPath = () =>
  path.join(
    __dirname,
    "..",
    "aurora-core",
    "build",
    "artifacts",
    "contracts",
    "token",
    "Voucher.sol",
    "Voucher.json"
  );
export const getDeployedVoucherPath = (network: string) =>
  path.join(
    __dirname,
    "..",
    "aurora-core",
    "deployments",
    "ganache",
    "Voucher.json"
  );

export const getDeployedPostManagerPath = (network: string) =>
  path.join(
    __dirname,
    "..",
    "aurora-core",
    "deployments",
    "ganache",
    "PostManager.json"
  );
