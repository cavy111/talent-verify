import { useEffect, useState, useContext } from "react";
import { bulkUploadEmployees } from "../api/api";
import Navbar from "../components/common/Navbar";
import { Alert, Button, Card, Container, ProgressBar, Form } from "react-bootstrap";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { getCompanies } from "../api/api";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const BulkUploadShema = Yup.object().shape({
    file: Yup.mixed().required("File is required"),
    companyId: Yup.number().required("Company is required"),
})

const BulkUpload = () =>{
    const [companies, setCompanies] = useState([]);
    const [preview, setPreview] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const {currentUser} = useContext(AuthContext);
    const [errors, setErrors] = useState([])

    useEffect(()=>{
        const fetchCompanies = async () =>{
            try{
                const response = await getCompanies();
                setCompanies(response.data);
            }catch(error){
                console.error('Error fetching companies:', error);
            }finally{
                setIsLoading(false);
            }
        }

        fetchCompanies();
    }, [])

    const handleFileChange = (event, setFieldValue) =>{
        const file = event.currentTarget.files[0];
        setFieldValue("file", file);

        if (!file) {
            setPreview([]);
            return;
        }

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'csv'){
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                preview: 5,
            complete: (results) =>{
                setPreview(results.data);
            }            
        })
        }else if (['xlsx', 'xls'].includes(fileExtension)){
            const reader = new FileReader()
            reader.onload = (e) =>{
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const firstSheetName = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheetName, {header: 1});

                // convert to preview format with headers
                if (jsonData.length > 1){
                    const headers = jsonData[0];
                    const previewData = jsonData.slice(1,6).map((row)=>{
                        const obj = {}
                        headers.forEach((header, index) =>{
                            obj[header] = row[index];
                        })
                        return obj;
                    })
                    setPreview(previewData);
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    const handleSubmit = async (values, {resetForm}) =>{
        setIsLoading(true);
        setMessage(null);

        try{
            const response = await bulkUploadEmployees(values.file, values.companyId);
            if (response.data.created_count && response.data.created_count > 0){
                setMessage({
                    type: 'success',
                    text: `Successfully created ${response.data.created_count} employee records.`
                })
            }
            resetForm();
            setPreview([]);
            setErrors(response.data.errors)
        }catch(error){
            console.error('Error uploading file:', error);
            if (error.response?.data?.error){
                if (Array.isArray(error.response.data.error)){
                    setErrors(error.response.data.error);
                }else{
                    setErrors([error.response.data.error]);
                }
            }else{
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'An error occurred while uploading the file.'
            })
            }
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <>
        <Navbar/>
        <Container className="mt-4">
            <h1>Bulk Upload Employees</h1>
            <p className="lead">Upload employee data from CSV, Excel, or text files</p>

            <Card className="mb-4">
                <Card.Body>
                    <Formik
                        initialValues={{
                            file: null,
                            companyId: currentUser.user_type === 'company' ? currentUser.company.id : '',
                        }}
                        validationSchema={BulkUploadShema}
                        onSubmit={handleSubmit}
                        >
                        {({handleSubmit, setFieldValue, values, errors, touched})=>(
                            <FormikForm onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Company</Form.Label>
                                    <Form.Select
                                        name="companyId"
                                        value={values.companyId}
                                        onChange={(e) => setFieldValue("companyId", e.target.value)}
                                        disabled={currentUser.user_type === 'company'}
                                    >
                                        <option value="">Select a company</option>
                                        {companies.map((company)=>(
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {touched.companyId && errors.companyId && (
                                        <div className="text-danger">{errors.companyId}</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Upload File</Form.Label>
                                    <Form.Control 
                                    type="file"
                                    accept=".csv, .xlsx, .xls"
                                    onChange={(event) => handleFileChange(event, setFieldValue)}
                                    />
                                    <Form.Text className="text-muted">
                                        Supported formats: CSV, Excel (xlsx, xls), Text
                                    </Form.Text>
                                    {touched.file && errors.file && (
                                        <div className="text-danger">{errors.file}</div>
                                    )}
                                </Form.Group>

                                    {isLoading && (
                                        <ProgressBar animated now={100} className="mb-3" />
                                    )}

                                    <Button variant="primary" type="submit" disabled={isLoading}>
                                        {isLoading ? 'Uploading...' : 'Upload'}
                                    </Button>

                            </FormikForm>
                        )}
                        </Formik>
                </Card.Body>
            </Card>

                        {message && (
                            <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
                                {message.text}
                            </Alert>
                        )}

                        { errors && errors.length > 0 && errors.map((error,index) =>(
                            <Alert key={index} variant="danger">{error}</Alert>
                        ))}

                        {preview.length > 0 && (
                            <Card>
                                <Card.Header>Preview (First 5 rows)</Card.Header>
                                <Card.Body style={{ overflowX: 'auto' }}>
                                <table className="table table-sm">
                                <thead>
                                    <tr>
                                        {Object.keys(preview[0]).map((header, index) => (
                                            <th key={index}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, rowIndex)=>(
                                        <tr key={rowIndex}>
                                            {Object.values(row).map((cell, cellIndex) =>(
                                                <td key={cellIndex}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                                </Card.Body>
                            </Card>
                        )}

        </Container>
        </>
    )

}

export default BulkUpload;