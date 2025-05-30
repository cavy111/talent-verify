import Navbar from "../../components/common/Navbar";
import { Alert, Button, Card, Container, Table} from "react-bootstrap";
import { getCompany, getCompanyDepartments } from "../../api/api";
import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const CompanyDetail = () => {
    const { id } = useParams();
    const location = useLocation()
    const [company, setCompany] = useState(null);
    const [departments, setDepartments] = useState([])
    const [message, setMessage] = useState( location?.state?.message || '')    

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await getCompany(id);
                const departmentResponse = await getCompanyDepartments(id)
                setCompany(response.data);
                setDepartments(departmentResponse.data)
            } catch (error) {
                console.error('Error fetching company details:', error);
            }
        };

        fetchCompany();
    }, [id]);

    return(
        <>
        <Navbar />
        <Container className="mt-4">
        <Card>
            <Card.Body>
                <Card.Title>Company Details</Card.Title>
                { company ? (<Table striped bordered hover>
                    <tbody>
                    <tr>
                        <th>Name</th>
                        <td>{company.name}</td>
                        <th>Registration Number</th>
                        <td>{company.registration_number}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>{company.address}</td>
                        <th>Phone</th>
                        <td>{company.phone}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{company.email}</td>
                        <th>Contact Person</th>
                        <td>{company.contact_person}</td>
                    </tr>
                    <tr>
                        <th>Employee Count</th>
                        <td>{company.employee_count}</td>
                        <th>Registration Date</th>
                        <td>{new Date(company.registration_date).toLocaleDateString()}</td>
                    </tr>
                    </tbody>
                </Table>) : (
                    <p>Loading company details...</p>
                )}
            </Card.Body>
        </Card>
        <Alert className="mt-4" variant="success" dismissible show={!!message} onClose={()=>setMessage('')}>{message}</Alert>
        <Card className="mt-4">
            <Card.Header className="align-items-center justify-content-between d-flex">
                <Card.Title>Departments</Card.Title>
                <Link to={`/add-department/${id}`} className="btn btn-primary btn-sm" >Add Department</Link> 
            </Card.Header>
            <Card.Body>
                <ul>
                { departments.map((dep)=>(
                    <li key={dep.id}>{dep.name}</li>
                ))}
                </ul>
            </Card.Body>
        </Card>
        </Container>
        </>
    )
}

export default CompanyDetail;