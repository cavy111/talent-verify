import { Card, Col, Container, Row } from "react-bootstrap";
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import { getCompanies } from '../api/api';
import { getEmployees } from '../api/api';


const Dashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [stats, setStats] = useState({
        companies: 0,
        employees: 0,
    });

    useEffect(()=>{
        const fetchStats = async () =>{
            try{
                const companiesResponse = await getCompanies();
                const employeesResponse = await getEmployees();

                setStats({
                    companies: companiesResponse.data.length,
                    employees: employeesResponse.data.length,
                });
            }catch (error) {
                console.error('Error fetching stats:', error);
            }
        }
        fetchStats();
    },[])

    return (
        <>
        <Navbar/>
        <Container className="mt-4">
            <h1>Welcome To Talent Verify</h1>
            <p className="lead">
                {currentUser?.user_type === 'admin' ? 'Manage companies and employee records' : 'Verify employment records and manage your data'}
            </p>

            <Row className="mt-4">
                <Col md={4}>
                    <Card className="text-center mb-3">
                        <Card.Body>
                            <Card.Title>Companies</Card.Title>
                            <Card.Text>
                                {stats.companies}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="text-center mb-3">
                        <Card.Body>
                            <Card.Title>Employees</Card.Title>
                            <Card.Text>
                                {stats.employees}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                <Card className="text-center mb-3">
                    <Card.Body>
                        <Card.Title>Your Role</Card.Title>
                        <Card.Text className="display-6">
                            {currentUser?.user_type === 'admin' && 'Administrator'}
                            {currentUser?.user_type === 'company' && 'Company User'}
                            {currentUser?.user_type === 'verifier' && 'Verifier'}
                        </Card.Text>
                    </Card.Body>
                </Card>
                </Col>

            </Row>

        </Container>
        </>
    )
}

export default Dashboard;