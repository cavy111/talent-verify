import { Container, Table } from 'react-bootstrap';
import Navbar from '../../components/common/Navbar';
import { getCompanies } from '../../api/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CompanyList = () => {
const [companies, setCompanies] = useState([]);

useEffect(() => {
    const fetchCompanies = async () => {
        try {
            const response = await getCompanies();
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    fetchCompanies();
}, []);
    return (
        <>
        <Navbar/>
        <Container className="mt-4">
            <h1>Companies</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Employee Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.length > 0 ? (
                            companies.map((company)=>(
                                <tr key={company.id}>
                                    <td>{company.name}</td>
                                    <td>{company.employee_count}</td>
                                    <td>
                                        <Link to={`/companies/${company.id}`} className="btn btn-sm btn-info">
                                        View Company
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan={4} className="text-center">
                                    No companies found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
        </Container>
        </>
    )
}

export default CompanyList;