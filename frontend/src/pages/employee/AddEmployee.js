import { Field, Formik, Form, ErrorMessage } from "formik";
import { Card, Col, Container, Row, Alert } from "react-bootstrap";
import { createEmployee } from "../../api/api";
import Navbar from "../../components/common/Navbar";
import * as Yup from 'yup';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployeeSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
});

const AddEmployee = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(values, {setSubmitting}) => {
        try {
            await createEmployee(values);
            navigate('/employees',{state: { message: 'Employee added successfully!' }});
        }catch (error) {
            console.error('Error adding employee:', error);
            setError('Failed to add employee. Please try again.');
        }finally {
            setSubmitting(false);
        }
    }

    return (
        <>
        <Navbar />
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={6}>
            <Card className="mb-4">
                <Card.Header as='h3' className='text-center'>Add Employee</Card.Header>
                <Card.Body>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Formik
            initialValues={{ 
                name: '',
                employee_id: '', 
            }}
            validationSchema={AddEmployeeSchema}
            onSubmit={handleSubmit}
            >{({ isSubmitting }) => (
                <Form>
                <h5>Employee Information</h5>
                <hr />
                <div className="mb-3">
                <label htmlFor="name">Name</label>
                <Field
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter employee name"
                id="name"
                />
                <ErrorMessage name="name" component="div" className="text-danger" />
                </div>
                <label htmlFor="employee_id">Employee ID</label>
                <Field
                type="text"
                name="employee_id"
                className="form-control"
                placeholder="Enter employee ID"
                id="employee_id"
                />
                <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
                    { isSubmitting ? 'Adding...' : 'Add Employee'}
                </button>
            </Form>
            )}
            
            </Formik>
                </Card.Body>
            </Card>
            </Col>
            </Row>
        </Container>
        </>
    )
}

export default AddEmployee;