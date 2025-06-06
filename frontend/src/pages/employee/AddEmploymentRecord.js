import { Button, Card, Col, Container, Form, Row, Alert } from "react-bootstrap";
import Navbar from "../../components/common/Navbar";
import { Formik, Form as FormikForm } from "formik";
import { createEmploymentRecord } from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { getCompanies, getCompanyDepartments } from "../../api/api";

const EmployementRecordSchema = Yup.object().shape({
    company: Yup.string().required('Company is required'),
    department: Yup.string().required('Department is required'),
    role: Yup.string().required('Role is required'),
    date_started: Yup.date().required('Date started is required'),
    duties: Yup.string().required('Duties are required')

})

const AddEmploymentRecord = () => {
    const {currentUser} = useContext(AuthContext)
    const {id} = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [companies, setCompanies] = useState([])
    const [departments, setDepartments] = useState([])
    const [selectedCompanyId, setSelectedCompanyId] = useState(currentUser.user_type ==='company' ? currentUser.company.id : '')

    useEffect(()=>{
        const fetchCompanies = async() =>{
            try{
                const response = await getCompanies()
                setCompanies(response.data)
            }catch(error){
                console.log('error fetching companies', error)
            }
        }
        fetchCompanies()
    },[])

    const fetchDepartments = async(companyId) =>{
        try{
            const response = await getCompanyDepartments(companyId)
            setDepartments(response.data)
        }catch(error){
            console.log('error fetching departments:',error);
        }
    }

    useEffect(()=>{
        if (selectedCompanyId){
            fetchDepartments(selectedCompanyId)
        }else{
            setDepartments([])
        }
    },[selectedCompanyId])

    const handleSubmit = async(values) => {
        try {
            // values.department = parseInt(values.department || '0', 10)
            const response = await createEmploymentRecord(id, values);
            console.log('Employment record created:', response.data);
            navigate(`/employees/${id}`, {state: {message: 'Employment record added successfully!'}});

        } catch (error) {
            console.error('Error creating employment record:', error);
            setError('Failed to add employment record. Please try again.');
        }
    }

    return(
        <>
        <Navbar />
        <Container>
            <Row className="align-items-center justify-content-center">
                <Col md={6}>
                <Card className="mt-4 mb-4">
                    <Card.Header>
                        <Card.Title className="text-center">Add Employment Record</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Formik
                        initialValues={{
                            company: currentUser.user_type ==='company' ? currentUser.company.id : '',
                            department:'',
                            role:'',
                            date_started:'',
                            date_left:null,
                            duties:'',
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={EmployementRecordSchema}
                        >
                            {({values, setFieldValue, touched, handleBlur, errors, isSubmitting})=>{

                                return (
                                <FormikForm>
                                    {error && <Alert variant='danger'>{error}</Alert>}
                            <Form.Group className="mb-3">
                                <Form.Label>Company</Form.Label>
                                <Form.Select
                                name="company"
                                value={values.company}
                                onChange={(e)=>{
                                    setFieldValue('company',e.target.value)
                                    setFieldValue('department', '')
                                    setSelectedCompanyId(e.target.value)
                                }}
                                disabled={currentUser.user_type === 'company'}
                                onBlur={handleBlur}
                                isInvalid={touched.company && !!errors.company}
                                isValid={touched.company && !errors.company}
                                >
                                    <option value=''>Choose Company</option>
                                    {companies.map(company=>(
                                        <option key={company.id} value={company.id}>{company.name}</option>
                                    ))}
                                </Form.Select>
                                {touched.company && errors.company && (
                                    <div className="text-danger">{errors.company}</div>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Department</Form.Label>
                                <Form.Select
                                name="department"
                                value={values.department}
                                onBlur={handleBlur}
                                onChange={(e)=>setFieldValue('department',e.target.value)}
                                isInvalid={touched.department && !!errors.department}
                                isValid={touched.department && !errors.department}
                                >
                                    <option value=''>Choose Department</option>
                                    {departments.map(department=>(
                                        <option key={department.id} value={department.id}>{department.name}</option>
                                    ))}
                                </Form.Select>
                                {touched.department && errors.department && (
                                    <div className="text-danger">{errors.department}</div>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="Enter role"
                                name="role"
                                isInvalid={touched.role && !!errors.role}
                                isValid={touched.role && !errors.role}
                                value={values.role}
                                onChange={(e)=>setFieldValue('role',e.target.value)}
                                onBlur={handleBlur}

                                />
                                {touched.role && errors.role && (
                                    <div className="text-danger">{errors.role}</div>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Date Started</Form.Label>
                                <Form.Control
                                type="date"
                                value={values.date_started}
                                name="date_started"
                                onBlur={handleBlur}
                                isValid={touched.date_started && !errors.date_started}
                                isInvalid={touched.date_started && !!errors.date_started}
                                onChange={(e)=>setFieldValue('date_started', e.target.value)}
                                />
                                 {touched.date_started && errors.date_started && (
                                    <div className="text-danger">{errors.date_started}</div>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Date Left</Form.Label>
                                <Form.Control
                                type="date"
                                value={values.date_left}
                                name="date_left"
                                onBlur={handleBlur}
                                isValid={touched.date_left && !errors.date_left}
                                isInvalid={touched.date_left && !!errors.date_left}
                                onChange={(e)=>setFieldValue('date_left', e.target.value)}
                                />
                                 {touched.date_left && errors.date_left && (
                                    <div className="text-danger">{errors.date_left}</div>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Duties</Form.Label>
                                <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Printing, packaging, and shipping products"
                                isInvalid={touched.duties && !!errors.duties}
                                isValid={touched.duties && !errors.duties}
                                value={values.duties}
                                onBlur={handleBlur}
                                onChange={(e)=>setFieldValue('duties',e.target.value)}
                                name="duties"
                                />
                                 {touched.duties && errors.duties && (
                                    <div className="text-danger">{errors.duties}</div>
                                )}
                            </Form.Group>
                            <Button disabled={isSubmitting} variant="primary" type="submit">
                                {isSubmitting ? 'Adding' : 'Add Record'}
                            </Button>
                        </FormikForm>
                            )}}
                        </Formik>
                    </Card.Body>
                </Card>                
                </Col>
            </Row>
        </Container>
        </>
    )

}

export default AddEmploymentRecord;