import { LINK_PATHS } from "./paths";
import PageNotFound from "../pages/PageNotFound";
import HomePage from "../pages/HomePage";
import Companies from "../pages/Companies";
import CompanyDetails from "../pages/CompanyDetails";
import Shareholders from "../pages/Shareholders";
import ShareholderDetails from "../pages/ShareholderDetails";

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
    path: LINK_PATHS.companies,
    children: <Companies />,
  },
  {
    path: LINK_PATHS.companies,
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
