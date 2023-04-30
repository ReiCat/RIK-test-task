import React from "react";
import NavBar from "../components/NavBar";
import { LINK_PATHS } from "../constants/paths";

interface ShareholderProps {}

const Shareholder: React.FC<ShareholderProps> = (
  props: ShareholderProps
): JSX.Element => {
  return (
    <>
      <NavBar active={LINK_PATHS.shareholders} />
    </>
  );
};

export default Shareholder;
