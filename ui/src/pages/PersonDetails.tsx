import React from "react";
import NavBar from "../components/NavBar";
import { LINK_PATHS } from "../constants/paths";

interface PersonDetailsProps {}

const PersonDetails: React.FC<PersonDetailsProps> = (
  props: PersonDetailsProps
): JSX.Element => {
  return (
    <>
      <NavBar active={LINK_PATHS.personDetails} />
    </>
  );
};

export default PersonDetails;
