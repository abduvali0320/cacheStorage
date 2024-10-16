import React, { useState } from "react";
import { Form, Input, Button, Layout, Checkbox } from "antd";
import { Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import logo from "../assets/img/Login-amico.png";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import axios from "axios";
import { setUser } from "../utils/Tokens";
const { Content } = Layout;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
const StyledForm = styled(Form)`
  width: 55%;
  margin-top: 30px;
  padding: 5px 30px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  gap: 25px;
  align-items: center;
  background-color: white;
  box-shadow: 0 5px 12px 1px #e6e6e6;
`;
const LogoWrapper = styled.figure`
  text-align: center;
  width: 50%;
`;

const InputsSection = styled.section`
  width: 50%;
`;

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\+998\d{9}$/, "Telefon raqam noto'g'ri formatda")
    .required("Telefon raqamni kiriting"),
  password: Yup.string()
    .min(6, "Parolingiz 6-ta dan kam bo'lmasligi kerak")
    .required("Parolni kiriting"),
});

interface FormValues {
  phone: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [remember, setRemembered] = useState(false);
  const [loading, setLoading] = useState(false);
  const initialValues: FormValues = {
    phone: "+998",
    password: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);
    setLoading(true);
    try {
      const res = await axios({
        url: "https://api.sud.gx.uz/api/auth/login",
        method: "POST",
        data: {
          phone: values.phone.slice(1, values.phone.length),
          password: values.password,
          remember_me: remember,
        },
      });
      setUser("user_data", {
        user_name: res.data?.user?.name,
        token: res.data.access_token,
      });
      if (res.status === 200) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Content>
        <FormWrapper>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              isSubmitting,
              errors,
              touched,
              setFieldValue,
            }: FormikProps<FormValues>) => (
              <StyledForm layout="vertical" onFinish={handleSubmit}>
                <LogoWrapper>
                  <img src={logo} width={"100%"} height={"100%"} alt="Logo" />
                </LogoWrapper>
                <InputsSection>
                  <Form.Item
                    label="Telefon raqam"
                    validateStatus={
                      errors.phone && touched.phone ? "error" : ""
                    }
                    help={errors.phone && touched.phone ? errors.phone : ""}
                  >
                    <PhoneInput
                      placeholder="Enter phone number"
                      value={values.phone}
                      onChange={(value) => setFieldValue("phone", value)}
                      style={{
                        border: "1px solid #DCDCDC",
                        padding: "7px 10px",
                        borderRadius: "6px",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Parol"
                    validateStatus={
                      errors.password && touched.password ? "error" : ""
                    }
                    help={
                      errors.password && touched.password ? errors.password : ""
                    }
                  >
                    <Input.Password
                      name="password"
                      placeholder="Parolingizni kiriting"
                      value={values.password}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item label={false}>
                    <Checkbox onChange={(e) => setRemembered(e.target.checked)}>
                      Meni eslab qol
                    </Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isSubmitting}
                      block
                      disabled={loading}
                    >
                      {!loading ? "Tizimga kirish" : ""}
                    </Button>
                  </Form.Item>
                </InputsSection>
              </StyledForm>
            )}
          </Formik>
        </FormWrapper>
      </Content>
    </Layout>
  );
};

export default LoginForm;
