import React from "react";
import Alert from "react-bootstrap/Alert";

interface PageNotFoundProps {}

const PageNotFound: React.FC<PageNotFoundProps> = (
  props: PageNotFoundProps
): JSX.Element => {
  return (
    <Alert dismissible variant="danger">
      <Alert.Heading>Page not found!</Alert.Heading>
    </Alert>
  );
};

export default PageNotFound;
