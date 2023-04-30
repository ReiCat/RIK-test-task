import { LINK_PATHS } from "./paths";
import HomePage from "../pages/HomePage";
import Persons from "../pages/Persons";
import PersonDetails from "../pages/PersonDetails";
import Companies from "../pages/Companies";
import CompanyDetails from "../pages/CompanyDetails";
import Shareholders from "../pages/Shareholders";
import PageNotFound from "../pages/PageNotFound";

export interface routerItem {
  path: string;
  children?: JSX.Element | null;
}

export const APP_ROUTERS: routerItem[] = [
  {
    path: LINK_PATHS.homePage,
    children: <HomePage />,
  },
  {
    path: LINK_PATHS.persons,
    children: <Persons />,
  },
  {
    path: LINK_PATHS.personDetails,
    children: <PersonDetails />,
  },
  {
    path: LINK_PATHS.companies,
    children: <Companies />,
  },
  {
    path: LINK_PATHS.companyDetails,
    children: <CompanyDetails />,
  },
  {
    path: LINK_PATHS.shareholders,
    children: <Shareholders />,
  },
  {
    path: LINK_PATHS.notFound,
    children: <PageNotFound />,
  },
];
