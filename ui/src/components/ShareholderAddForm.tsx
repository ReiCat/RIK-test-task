import React, {
  FunctionComponent,
  useState,
  useEffect,
  ChangeEvent,
} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
  addCompanyShareholder,
  fetchCompanyShareholders,
} from "../services/apiSource";
import ShareholderAddClass from "./data/ShareholderAddClass";
import CompanyShareholderClass from "./data/CompanyShareholderClass";
import { SHAREHOLDER_TYPES } from "../constants/enums";
import { LINK_PATHS } from "../constants/paths";
import { ShareholderTypeOptions } from "./data/ShareholderAddClass";

interface ShareholderAddFormProps {
  registration_code: string;
  handleClose: Function;
  addToCompanyShareholders: Function;
}

const ShareholderAddForm: FunctionComponent<ShareholderAddFormProps> = (
  props: ShareholderAddFormProps
): JSX.Element => {
  const [registrationCode, setRegistrationCode] = useState<string>(
    props.registration_code
  );
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setRegistrationCode(props.registration_code);
  }, [props.registration_code]);

  const companyAddForm = useFormik({
    initialValues: {
      registration_code: registrationCode ? registrationCode : "",
      shareholder_code: "",
      shareholder_type: SHAREHOLDER_TYPES.INDIVIDUAL,
      capital: "",
      founder: false,
    },
    validationSchema: Yup.object({
      shareholder_code: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits"),
      capital: Yup.number().required().min(1, "Must be at least 1 euro"),
      founder: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      const newShareholder: ShareholderAddClass = new ShareholderAddClass();
      newShareholder.registration_code = values.registration_code;
      newShareholder.shareholder_code = values.shareholder_code;
      newShareholder.shareholder_type = values.shareholder_type;
      newShareholder.capital = values.capital;
      newShareholder.founder = values.founder;
      addCompanyShareholder(newShareholder)
        .then((addedShareholder) => {
          fetchCompanyShareholders(+newShareholder.registration_code)
            .then((shareholders) => {
              props.addToCompanyShareholders(shareholders);
            })
            .catch((err) => {
              setError(err.response.data.message);
            });

          props.handleClose();
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    companyAddForm.handleChange(e);
  };

  return (
    <Form onSubmit={companyAddForm.handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="registration_code">
          <Form.Label>Registration code</Form.Label>
          <Form.Control
            disabled
            type="text"
            placeholder="Registration code"
            onChange={handleChange}
            value={companyAddForm.values.registration_code}
          />
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="shareholder_code">
          <Form.Label>Shareholder code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Shareholder code"
            onChange={handleChange}
            value={companyAddForm.values.shareholder_code}
            isInvalid={!!companyAddForm.errors?.shareholder_code}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="shareholder_type">
          <Form.Label>Shareholder type</Form.Label>
          {ShareholderTypeOptions.map((option, index) => {
            return (
              <Form.Check
                key={index}
                name="shareholder_type"
                value={option.value}
                type="radio"
                defaultChecked={
                  option.value === companyAddForm.values.shareholder_type
                }
                label={option.name}
                onChange={handleChange}
              />
            );
          })}
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="capital">
          <Form.Label>Capital</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Capital"
            onChange={handleChange}
            value={companyAddForm.values.capital}
            isInvalid={!!companyAddForm.errors?.capital}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group className="mb-3" controlId="founder">
          <Form.Check type="checkbox" label="Founder" onChange={handleChange} />
        </Form.Group>
      </Row>

      <Button type="submit" variant="primary" size="lg">
        Add
      </Button>
      {error !== "" ? (
        <Alert className="mt-3">
          <b>{error}</b>
        </Alert>
      ) : null}
    </Form>
  );
};

export default ShareholderAddForm;
