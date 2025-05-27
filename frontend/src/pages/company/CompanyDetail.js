import Navbar from "../../components/common/Navbar";
import { Card, Container, Table} from "react-bootstrap";
import { getCompany } from "../../api/api";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const CompanyDetail = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    console.log(company);
    

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await getCompany(id);
                // console.log(response);
                setCompany(response.data);
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
        </Container>
        </>
    )
}

export default CompanyDetail;