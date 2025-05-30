import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import Navbar from "../../components/common/Navbar"
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik"
import { createCompanyDepartment } from "../../api/api"
import * as Yup from 'yup'
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"

const DepartmentSchema = Yup.object().shape({
    name: Yup.string().required('name is required')
})

const AddCompanyDepartment = () =>{
    const navigate = useNavigate()
    const {id} = useParams()
    const [error, setError] = useState('')

    const handleSubmit = async(values, {setErrors}) => {
        try{
            values.company = id
            await createCompanyDepartment(id,values)
            navigate(`/companies/${id}`,{state:{message: 'Department added successfully'}})
        }catch(error){
            if (error.response && error.response.data){
                setErrors(error.response.data)
            }else{
                console.log('error adding company department', error)
                setError('Error adding department, try again')
            }
        }
    }

    return (
        <>
        <Navbar/>
        <Container>
            <Row className="justify-content-center mt-4">
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title className="text-center">Add Company Department</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Formik
                            initialValues={
                                {
                                    name:''
                                }
                            }
                            validationSchema={DepartmentSchema}
                            onSubmit={handleSubmit}
                            >
                            {({touched, errors, isSubmitting})=>(
                                <FormikForm>
                                <Alert variant="danger" show={!!error}>{error}</Alert>
                                <label htmlFor="name">Name</label>
                            <Field
                            name='name'
                            type='text'
                            placeHolder='Enter department name'
                            className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''} ${touched.name && !errors.name ? 'is-valid' : ''}`}
                            id='name'
                            />
                            <ErrorMessage name="name" component='div' className="invalid-feedback" />
                            <Button className="mt-4" variant="primary" disabled={isSubmitting} type="submit">{isSubmitting ? 'adding...' : 'Add Department'}</Button>
                            </FormikForm>
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

export default AddCompanyDepartment