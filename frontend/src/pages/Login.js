import React, {useState, useContext, use} from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { login } from '../api/auth';
import Navbar from '../components/common/Navbar';

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const Login = () => {
const [error, setError] = useState('');
const navigate = useNavigate();
const { setCurrentUser } = useContext(AuthContext);

const handleSubmit = async (values,{setSubmitting}) => {
    try{
        const userData = await login(values.username, values.password);
        setCurrentUser(userData);
        navigate('/');
    }catch(err){
        setError('Invalid username or password');
    }finally{
        setSubmitting(false);
    }
}

return(
    <>
    <Navbar/>
    < Container className="mt-5">
        <Row className="justify-content-center">
            <Col md={6}>
                <Card>
                    <Card.Header as='h3' className='text-center'>
                    Talent Verify Login
                    </Card.Header>
                    <Card.Body>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        <Formik
                        initialValues={{ username: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleSubmit}
                        >
                            {({isSubmitting}) => (
                                <Form>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <Field
                                        type="text"
                                        name="username"
                                        className="form-control"
                                        id="username"
                                        />
                                        <ErrorMessage name="username" component="div" className="text-danger" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <Field
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        id="password"
                                        />
                                        <ErrorMessage name="password" component="div" className="text-danger" />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                        {isSubmitting ? 'Logging in...' : 'Login'}
                                    </button>

                                </Form>
                            )}
                        </Formik>
                        <br/>
                        Don't have an account? <a href="/register">Register here</a>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
    </>
)

}

export default Login;