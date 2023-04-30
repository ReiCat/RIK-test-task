import { LINK_PATHS } from "./paths";

export interface menuDataItem {
  path: string;
  name: string;
}

export const menuData: menuDataItem[] = [
  { path: LINK_PATHS.homePage, name: "Home" },
  { path: LINK_PATHS.persons, name: "Persons" },
  { path: LINK_PATHS.companies, name: "Companies" },
];

export default menuData;