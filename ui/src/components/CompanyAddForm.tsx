import React, { FunctionComponent, useState, ChangeEvent } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { addCompany } from "../services/apiSource";
import CompanyAddClass from "./data/CompanyAddClass";
import { SHAREHOLDER_TYPES } from "../constants/enums";
import { LINK_PATHS } from "../constants/paths";
import { ShareholderTypeOptions } from "./data/ShareholderAddClass";

interface CompanyAddFormProps {}

const CompanyAddForm: FunctionComponent<CompanyAddFormProps> = (
  props: CompanyAddFormProps
): JSX.Element => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const companyAddForm = useFormik({
    initialValues: {
      company_name: "",
      registration_code: "",
      founder_code: "",
      founder_type: SHAREHOLDER_TYPES.INDIVIDUAL,
      founder_capital: "",
      created_at: "",
    },
    validationSchema: Yup.object({
      company_name: Yup.string()
        .required()
        .min(3, "Must be at least 3 symbols")
        .max(100, "Must be at most 100 symbols"),
      registration_code: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(7, "Must be exactly 7 digits")
        .max(7, "Must be exactly 7 digits"),
      founder_code: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits"),
      founder_capital: Yup.number()
        .required()
        .min(2500, "The amount must be at least 2500"),
      created_at: Yup.date()
        .nullable()
        .max(new Date(), "Date of establishment should be earlier than today"),
    }),
    onSubmit: async (values) => {
      const newCompany: CompanyAddClass = new CompanyAddClass();
      newCompany.company_name = values.company_name.trim();
      newCompany.registration_code = values.registration_code;
      newCompany.founder_code = values.founder_code;
      newCompany.founder_type = values.founder_type;
      newCompany.founder_capital = values.founder_capital;
      newCompany.created_at = values.created_at;

      addCompany(newCompany)
        .then((addedCompany: any) => {
          navigate(
            `${LINK_PATHS.companies}/${addedCompany.data.registration_code}`
          );
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
        <Form.Group as={Col} md="6" controlId="company_name">
          <Form.Label>Company name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Company name"
            onChange={handleChange}
            value={companyAddForm.values.company_name}
            isInvalid={!!companyAddForm.errors?.company_name}
          />
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="registration_code">
          <Form.Label>Registration code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Registration code"
            onChange={handleChange}
            value={companyAddForm.values.registration_code}
            isInvalid={!!companyAddForm.errors?.registration_code}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="founder_code">
          <Form.Label>Founder code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Founder code"
            onChange={handleChange}
            value={companyAddForm.values.founder_code}
            isInvalid={!!companyAddForm.errors?.founder_code}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="founder_type">
          <Form.Label>Founder type</Form.Label>
          {ShareholderTypeOptions.map((option, index) => {
            return (
              <Form.Check
                key={index}
                name="founder_type"
                value={option.value}
                type="radio"
                defaultChecked={
                  option.value === companyAddForm.values.founder_type
                }
                label={option.name}
                onChange={handleChange}
              />
            );
          })}
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="founder_capital">
          <Form.Label>Founder capital</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Founder capital"
            onChange={handleChange}
            value={companyAddForm.values.founder_capital}
            isInvalid={!!companyAddForm.errors?.founder_capital}
          />
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="created_at">
          <Form.Label>Date of establishment</Form.Label>
          <Form.Control
            required
            type="date"
            placeholder="Date of establishment"
            onChange={handleChange}
            value={companyAddForm.values.created_at}
            isInvalid={!!companyAddForm.errors?.created_at}
          />
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

export default CompanyAddForm;
