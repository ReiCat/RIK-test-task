import React, { FC, useState, useEffect, ChangeEvent } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useFormik } from "formik";
import * as Yup from "yup";

import CompanyClass from "./data/CompanyClass";

interface AddCompanyFormProps {
  company?: CompanyClass;
}

const AddCompanyForm: React.FC<AddCompanyFormProps> = (
  props: AddCompanyFormProps
): JSX.Element => {
  const [company, setCompany] = useState<CompanyClass | undefined>(
    props.company
  );

  const companyForm = useFormik({
    initialValues: {
      company_name: company?.company_name ? company?.company_name : "",
      registration_code: company?.registration_code
        ? company?.registration_code
        : 0,
      shareholder_name: company?.shareholder_name
        ? company.shareholder_name
        : "",
      shareholder_code: company?.shareholder_code
        ? company?.shareholder_code
        : 0,
    },
    validationSchema: Yup.object({
      company_name: Yup.string(),
      registration_code: Yup.number(),
      shareholder_name: Yup.string(),
      shareholder_code: Yup.number(),
    }),
    onSubmit: async (values) => {
      console.log(values);
      // const newOutputStreamSettings: OutputStreamSettingsClass =
      //   props.outputStreamSettings!.clone();
      // newOutputStreamSettings.IP = values.IP;
      // newOutputStreamSettings.PORT = values.PORT;
      // newOutputStreamSettings.enabledDisabled =
      //   values.enabledDisabled === "yes" ? "ON" : "OFF";
      // newOutputStreamSettings._xsrf = getCookie("_xsrf");
      // editOutputStreamSettings(newOutputStreamSettings).then(() => {
      //   setMessage("Settings has been updated");
      // });
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
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="shareholder_name">
          <Form.Label>Shareholder name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Shareholder name"
            onChange={handleChange}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="shareholder_code">
          <Form.Label>Shareholder code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Shareholder code"
            onChange={handleChange}
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
        Add
      </Button>
    </Form>
  );
};

export default AddCompanyForm;
