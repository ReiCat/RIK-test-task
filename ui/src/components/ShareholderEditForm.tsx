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
  updateCompanyShareholder,
  fetchCompanyShareholders,
} from "../services/apiSource";
import CompanyShareholderClass from "./data/CompanyShareholderClass";
import { SHAREHOLDER_TYPES } from "../constants/enums";
import { LINK_PATHS } from "../constants/paths";
import ShareholderEditClass, {
  ShareholderTypeOptions,
} from "./data/ShareholderEditClass";

interface ShareholderEditFormProps {
  shareholderToEdit: CompanyShareholderClass;
  handleClose: Function;
  addToCompanyShareholders: Function;
}

const ShareholderEditForm: FunctionComponent<ShareholderEditFormProps> = (
  props: ShareholderEditFormProps
): JSX.Element => {
  const [shareholderToEdit, setShareholderToEdit] =
    useState<CompanyShareholderClass>(props.shareholderToEdit);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setShareholderToEdit(props.shareholderToEdit);
  }, [props.shareholderToEdit]);

  const companyEditForm = useFormik({
    initialValues: {
      registration_code: shareholderToEdit.registration_code
        ? shareholderToEdit.registration_code
        : 0,
      shareholder_code: shareholderToEdit.shareholder_code
        ? shareholderToEdit.shareholder_code
        : 0,
      shareholder_type: shareholderToEdit.shareholder_type
        ? shareholderToEdit.shareholder_type
        : SHAREHOLDER_TYPES.INDIVIDUAL,
      capital: shareholderToEdit.shareholder_capital
        ? shareholderToEdit.shareholder_capital
        : 0,
      founder: shareholderToEdit.founder ? shareholderToEdit.founder : false,
    },
    validationSchema: Yup.object({
      registration_code: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(7, "Must be exactly 7 digits")
        .max(7, "Must be exactly 7 digits"),
      shareholder_code: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits"),
      capital: Yup.number().required().min(1, "Must be at least 1 euro"),
      founder: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      const newShareholder: ShareholderEditClass = new ShareholderEditClass();
      newShareholder.registration_code = values.registration_code;
      newShareholder.shareholder_code = values.shareholder_code;
      newShareholder.shareholder_type = values.shareholder_type;
      newShareholder.capital = values.capital;
      newShareholder.founder = values.founder;
      updateCompanyShareholder(newShareholder)
        .then((updatedShareholder) => {
          fetchCompanyShareholders(+updatedShareholder.registration_code)
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
    companyEditForm.handleChange(e);
  };

  return (
    <Form onSubmit={companyEditForm.handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="registration_code">
          <Form.Label>Registration code</Form.Label>
          <Form.Control
            disabled
            type="text"
            placeholder="Registration code"
            onChange={handleChange}
            value={companyEditForm.values.registration_code}
          />
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="shareholder_code">
          <Form.Label>Shareholder code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Shareholder code"
            onChange={handleChange}
            value={companyEditForm.values.shareholder_code}
            isInvalid={!!companyEditForm.errors?.shareholder_code}
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
                  option.value === companyEditForm.values.shareholder_type
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
            value={companyEditForm.values.capital}
            isInvalid={!!companyEditForm.errors?.capital}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group className="mb-3" controlId="founder">
          <Form.Check
            type="checkbox"
            checked={companyEditForm.values.founder}
            label="Founder"
            onChange={handleChange}
          />
        </Form.Group>
      </Row>

      <Button type="submit" variant="primary" size="lg">
        Edit
      </Button>
      {error !== "" ? (
        <Alert className="mt-3">
          <b>{error}</b>
        </Alert>
      ) : null}
    </Form>
  );
};

export default ShareholderEditForm;
