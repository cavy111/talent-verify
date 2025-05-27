import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Button, Table, Card, Alert } from 'react-bootstrap';
import Navbar from "../../components/common/Navbar";
import { Link, useLocation } from "react-router-dom";
import { Formik, Field } from 'formik';
import { searchEmployees, getEmployees } from '../../api/api';

const EmployeeList = () => {
    const location = useLocation();
    const [message, setMessage] = useState(location.state?.message || '');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        fetchEmployees();
    }, [])

    const fetchEmployees = async() =>{
        try {
            const response = await getEmployees();
            setEmployees(response.data);
        }catch(error){
            console.error('Error fetching employees:', error);
        }finally {
            setLoading(false);
        }
    }

    const handleSearch = async (values) =>{
        try{
            setLoading(true);
            
            // filter out empty values
            const searchParams = Object.fromEntries(
                Object.entries(values).filter(([_,value]) => value !== '')
            )

            const response = await searchEmployees(searchParams);
            setEmployees(response.data);

        }catch(error){
            console.error('Error searching employees:', error);
        }finally{
            setLoading(false);
        }
    }

    return(
        <>
        <Navbar/>
        <Container className="mt-4">
        <Alert show={!!message} variant="success" dismissible onClose={()=>setMessage(null)} className="mt-4">
            {message}
        </Alert>
            <h1>Employee Search</h1>

            <Card className="mb-4">
                <Card.Body>
                    <Formik
                    initialValues={{
                        name: '',
                        employer: '',
                        position: '',
                        department: '',
                        year_started: '',
                        year_left: '',
                    }}
                    onSubmit={handleSearch} 
                    >
                        {({handleSubmit})=>(
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Name</Form.Label>
                                        <Field
                                        name="name"
                                        as={Form.Control}
                                        placeholder="Enter employee name"
                                        />
                                    </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Employer</Form.Label>
                                        <Field
                                        name="employer"
                                        as={Form.Control}
                                        placeholder="Enter employer name"
                                        />
                                    </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Position</Form.Label>
                                        <Field
                                        name="position"
                                        as={Form.Control}
                                        placeholder="Enter position"
                                        />
                                    </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Department</Form.Label>
                                        <Field
                                        name="department"
                                        as={Form.Control}
                                        placeholder="Enter department"
                                        />
                                    </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Year Started</Form.Label>
                                        <Field
                                        type="number"
                                        name="year_started"
                                        as={Form.Control}
                                        placeholder="YYYY"
                                        />
                                    </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Year Left</Form.Label>
                                        <Field
                                        type="number"
                                        name="year_left"
                                        as={Form.Control}
                                        placeholder="YYYY"
                                        />
                                    </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end">
                                    <Button variant="primary" type="submit">
                                        Search
                                    </Button>
                                    <Button variant="secondary" className="ms-2" onClick={fetchEmployees}>
                                        Reset
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Employee ID</th>
                            <th>Current Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length > 0 ? (
                            employees.map((employee)=>(
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.employee_id || 'N/A'}</td>
                                    <td>
                                        {employee.employment_records &&
                                        employee.employment_records > 0 &&
                                        !employee.employment_records[0].date_left
                                        ? `${employee.employment_records[0].role} at ${employee.employment_records[0].company_name}`
                                        : 'Not Currently Employed'
                                        }
                                    </td>
                                    <td>
                                        <Link to={`/employees/${employee.id}`} className="btn btn-sm btn-info">
                                        View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan={4} className="text-center">
                                    No employees found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

        </Container>
        </>
    )

}

export default EmployeeList