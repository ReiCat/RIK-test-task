import { FunctionComponent } from "react";
import { LINK_PATHS } from "../constants/paths";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

interface ErrorFallbackProps {
  error: any;
  resetErrorBoundary: any;
}

const ErrorFallback: FunctionComponent<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const navigate = useNavigate();
  if (error.isAxiosError) {
    switch (error.response.status) {
      case 403:
        return (
          <Alert dismissible variant="danger">
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>Change this and that and try again.</p>
          </Alert>
        );
      case 503:
        return (
          <Alert dismissible variant="danger">
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>Change this and that and try again.</p>
          </Alert>
        );
    }
  }

  return <>default return</>;
};

export default ErrorFallback;
