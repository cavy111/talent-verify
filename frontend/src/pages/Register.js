import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { register } from '../api/auth';

const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    company: Yup.object().shape({
        name: Yup.string().required('company name is required'),
        email: Yup.string().email('Invalid email')
            .required('Email is required'),
        employee_count: Yup.number()
            .required('Employee count is required')
            .positive('Employee count must be a positive number')
            .integer('Employee count must be an integer'),
    }),
});

const Register = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (values,{setSubmitting}) => {
        try{
            values.company.employee_count = parseInt(values.company.employee_count || '0', 10);
            const userData = await register(values);
            navigate('/login');
        }catch(err){
            setError('Registration failed. Please try again.');
            console.error('Registration error:', err);
        }finally{
            setSubmitting(false);
        }
    }

    return(
        < Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Header as='h3' className='text-center'>
                        Talent Verify Registration
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Formik
                            initialValues={{
                                 username: '', 
                                 password: '',
                                confirmPassword: '',
                                company:{
                                    name: '',
                                    email: '',
                                    employee_count: '',
                                    registration_date:'',
                                    registration_number:'',
                                    address:'',
                                    contact_person:'',
                                    phone:'',
                                } 
                                }}
                            validationSchema={RegisterSchema}
                            onSubmit={handleSubmit}
                            >
                                {({isSubmitting}) => (
                                    <Form>
                                        <h5>User Information</h5>
                                        <hr/>
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
                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                            <Field
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                            id="confirmPassword"
                                            />
                                            <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                        </div>
                                        <h5>Company Information</h5>
                                        <hr/>
                                        <div className="mb-3">
                                            <label htmlFor="companyName" className="form-label">Company Name</label>
                                            <Field
                                            type="text"
                                            name="company.name"
                                            className="form-control"
                                            id="companyName"
                                            />
                                            <ErrorMessage name="company.name" component="div" className="text-danger" />
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='companyEmail'>Company Email</label>
                                            <Field
                                            type='email'
                                            name='company.email'
                                            className='form-control'
                                            id='companyEmail'
                                            />
                                            <ErrorMessage name='company.email' component='div' className='text-danger' />
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='employeeCount'>Employee Count</label>
                                            <Field
                                            type='number'
                                            name='company.employee_count'
                                            className='form-control'
                                            id='employeeCount'
                                            />
                                            <ErrorMessage name='company.employee_count' component='div' className='text-danger' />
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='registrationDate'>Registration Date</label>
                                            <Field
                                            type='date'
                                            name='company.registration_date'
                                            className='form-control'
                                            id='registrationDate'
                                            />
                                            <ErrorMessage name='company.registration_date' component='div' className='text-danger' />
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='registrationNumber'>Registration Number</label>
                                            <Field
                                            type='text'
                                            name='company.registration_number'
                                            className='form-control'
                                            id='registrationNumber'
                                            />
                                            <ErrorMessage name='company.registration_number' component='div' className='text-danger' />
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='address'>Address</label>
                                            <Field
                                            type='text'
                                            name='company.address'
                                            className='form-control'
                                            id='address'
                                            />
                                            <ErrorMessage name='company.address' component='div' className='text-danger' />
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='contactPerson'>Contact Person</label>
                                            <Field
                                            type='text'
                                            name='company.contact_person'
                                            className='form-control'
                                            id='contactPerson'
                                            />
                                            <ErrorMessage name='company.contact_person' component='div' className='text-danger' />
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='phone'>Phone</label>
                                            <Field
                                            type='text'
                                            name='company.phone'
                                            className='form-control'
                                            id='phone'
                                            />
                                            <ErrorMessage name='company.phone' component='div' className='text-danger' />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                            {isSubmitting ? 'Registering...' : 'Register'}
                                        </button>

                                    </Form>
                                )}
                            </Formik>
                            <br/>
                            Already have an account? <a href="/login">Login here</a>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
)

}

export default Register;