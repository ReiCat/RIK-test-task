import React, { FC, useState, useEffect, ChangeEvent } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

import { useFormik } from "formik";
import * as Yup from "yup";
import { updateCompany } from "../services/apiSource";

import CompanyClass from "./data/CompanyClass";

interface EditCompanyFormProps {
  registration_code: number;
  company: CompanyClass;
}

const EditCompanyForm: React.FC<EditCompanyFormProps> = (
  props: EditCompanyFormProps
): JSX.Element => {
  const [company, setCompany] = useState<CompanyClass>(props.company);
  const [companyUpdated, setCompanyUpdated] = useState<boolean>(false);

  useEffect(() => {
    setCompany(props.company);
  }, [props.company]);

  const companyForm = useFormik({
    initialValues: {
      company_name: company?.company_name ? company?.company_name : "",
      registration_code: company?.registration_code
        ? company?.registration_code
        : 0,
      total_capital: company?.total_capital ? company.total_capital : 0,
      created_at: company?.created_at ? company?.created_at : "",
    },
    validationSchema: Yup.object({
      company_name: Yup.string(),
      registration_code: Yup.number(),
      total_capital: Yup.number(),
      created_at: Yup.date(),
    }),
    onSubmit: async (values) => {
      const newCompanyClass: CompanyClass = new CompanyClass();
      newCompanyClass.company_name = values.company_name.trim();
      newCompanyClass.registration_code = values.registration_code;
      newCompanyClass.total_capital = values.total_capital;
      newCompanyClass.created_at = values.created_at;

      updateCompany(props.registration_code, newCompanyClass)
        .then((updatedCompany) => {
          setCompanyUpdated(true);
        })
        .catch((err) => {});
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    companyForm.handleChange(e);
  };

  return (
    <Form noValidate onSubmit={companyForm.handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="company_name">
          <Form.Label>Company name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Company name"
            onChange={handleChange}
            value={companyForm.values.company_name}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="registration_code">
          <Form.Label>Registration code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Registration code"
            onChange={handleChange}
            value={companyForm.values.registration_code}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="total_capital">
          <Form.Label>Total capital</Form.Label>
          <Form.Control
            type="text"
            placeholder="Total capital"
            onChange={handleChange}
            value={companyForm.values.total_capital}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="created_at">
          <Form.Label>Created at</Form.Label>
          <Form.Control
            type="text"
            placeholder="Created at"
            onChange={handleChange}
            value={companyForm.values.created_at}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      {/* <Form.Group className="mb-3">
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
        />
      </Form.Group> */}
      <Button type="submit" variant="primary" size="lg">
        Edit
      </Button>
      {companyUpdated ? (
        <Alert variant="success" className="mt-3">
          <b>Company has been updated!</b>
        </Alert>
      ) : null}
    </Form>
  );
};

export default EditCompanyForm;
