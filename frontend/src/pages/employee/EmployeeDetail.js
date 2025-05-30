import Navbar from "../../components/common/Navbar";
import { Container, Card, Table, Alert} from "react-bootstrap";
import { getEmployee } from "../../api/api";
import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

const EmployeeDetail = () => {
const location = useLocation()
const [message, setMessage] = useState(location.state?.message || '')
const {id} = useParams();
const [employee, setEmployee] = useState(null);

useEffect(() => {
    const fetchEmployee = async ()=>{
        try {
            const response = await getEmployee(id)
            setEmployee(response.data);
        }catch (error) {
            console.error('Error fetching employee details:', error);
        }
    }
    fetchEmployee();
}, [id]);

    return (
        <>
        <Navbar />
        <Container>
            <Card className="mt-4">
                <Card.Body>
                    <Card.Title>Employee Details</Card.Title>
                    {employee?(<Table striped bordered hover>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td>{employee.name}</td>
                                <th>Employee ID</th>
                                <td>{employee.employee_id}</td>
                            </tr>
                        </tbody>
                    </Table>):(<p>Loading employee details...</p>)}
                </Card.Body>
            </Card>
            <Alert className="mt-4" variant="success" show={!!message} dismissible onClose={()=>setMessage(null)}>{message}</Alert>
            <Card className="mt-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Card.Title className="mb-0">Employment Records</Card.Title>
                    <Link to={`/add-employment-record/${id}`} className="btn btn-primary btn-sm" >Add Employment Record</Link>
                </Card.Header>
                <Card.Body>
                    
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Role</th>
                                <th>Duties</th>
                                <th>Date Joined</th>
                                <th>Date Left</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employee && employee.employment_records && employee.employment_records.length > 0 ? (
                                employee.employment_records.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.company_details.name}</td>
                                        <td>{record.role}</td>
                                        <td>{record.duties}</td>
                                        <td>{new Date(record.date_started).toLocaleDateString()}</td>
                                        <td>{record.date_left ? new Date(record.date_left).toLocaleDateString() : 'Present'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No employment records found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
        
        </>
    );
}

export default EmployeeDetail;