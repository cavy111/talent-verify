import { Button, Card, Col, Container, Form, Row, Alert } from "react-bootstrap";
import Navbar from "../../components/common/Navbar";
import { Formik, Form as FormikForm } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import {useEffect, useState } from "react";
import { getEmploymentRecord,updateEmpRecord } from "../../api/api";

const EmployementRecordSchema = Yup.object().shape({
    date_left: Yup.date().required('Date left is required'),
})

const UpdateEmploymentRecord = () => {
    const {employeeId, recordId} = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [empRecord, setEmpRecord] = useState({})

    useEffect(()=>{        
        const fetchEmpRecord = async() =>{
            try {
                const response = await getEmploymentRecord(employeeId,recordId)
                setEmpRecord(response.data)
            } catch (error) {
                console.log('an error occured:',error);
            }
        }
        fetchEmpRecord()
    },[employeeId,recordId])

    const handleSubmit = async(values,{setErrors}) => {
        try {
            console.log(values);
            
            const response = await updateEmpRecord(employeeId, recordId, values);
            console.log('Employment record updated:', response.data);
            navigate(`/employees/${employeeId}`, {state: {message: 'Employment record updated successfully!'}});

        } catch (error) {
            if(error.response && error.response.data){
                setErrors(error.response.data)
            }else{
                console.error('Error updating employment record:', error);
                setError('Failed to update employment record. Please try again.');
            }
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
                        <Card.Title className="text-center">Update Employment Record</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Formik
                        initialValues={{
                            company: empRecord?.company_details?.id || '',
                            department: empRecord?.department_details?.id || '',
                            role:empRecord.role || '',
                            date_started:empRecord.date_started || null,
                            date_left:null,
                            duties:empRecord.duties || '',
                        }}
                        enableReinitialize={true}
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
                                disabled
                                >
                                    <option value={empRecord?.company_details?.id}>{empRecord?.company_details?.name}</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Department</Form.Label>
                                <Form.Select
                                name="department"
                                value={values.department}
                                disabled
                                >
                                    <option value={empRecord?.department_details?.id}>{empRecord?.department_details?.name}</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                type="text"
                                name="role"
                                value={values.role}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Date Started</Form.Label>
                                <Form.Control
                                type="date"
                                value={values.date_started}
                                name="date_started"
                                disabled
                                />
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
                                value={values.duties}
                                disabled
                                name="duties"
                                />
                            </Form.Group>
                            <Button disabled={isSubmitting} variant="primary" type="submit">
                                {isSubmitting ? 'Updating' : 'Update'}
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

export default UpdateEmploymentRecord;