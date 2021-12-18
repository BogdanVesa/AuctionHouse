import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from '../styles/Login.module.css';
import { text } from 'dom-helpers';
import { useState } from 'react';
import Axios from 'axios';
import {useRouter} from 'next/router';
import { useEffect } from "react";
import Link from 'next/link';
import Modal from 'react-bootstrap/Modal';
import { Col, Row } from 'react-bootstrap';


const Login = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [show, setShow] = useState(false);
    const [code,setCode] = useState('');

    const router = useRouter();

    const loginUser = (e) =>{
            e.preventDefault()
            const validationError = validateData(email,password);
            if(validationError == "")
            {
                Axios.post("http://localhost:3001/auth/login",{
                    email : email,
                    password : password
                }).then((response =>{
                    localStorage.setItem("token", response.data.token);
                    console.log(response.data);
                    setPassword('');
                    router.push('/');
                })).catch(err => {
                    // what now?
                    if(err.response.data.message === "this account doesn't exist")
                    {
                        Axios.post("http://localhost:3001/auth/checkIfTemp",{
                            email : email,
                        }).then((response)=>{
                            if(response.data === true){
                                setShow(true)
                            }
                            else{
                                alert("this account doesn't exist")
                            }
                        }).catch((err)=>{
                            console.log(err);
                        })
                    }
                    console.log(err);
                });
            }
            else
                alert(validationError);
    }
    const validateData = (email,password) =>{
        const s=""
        if(!email || email.length < 5 || !(email.includes('@')))
            s+="Email was incorrect\n"
        if(!password  || password.length < 5)  
            s+="Password must be longer than 5 characters\n"
       return s;
    }

    const handleShow =(e)=>{
        e.preventDefault();
        setShow(false);
    }
    const verifiyCode=(e)=>{
        e.preventDefault();

        Axios.post("http://localhost:3001/auth/confirm",{
            email: email,
            key : code
        }).then((response)=>{
            console.log(response);
            setShow(false);
        }).catch((err)=>{
            alert(err.response.data.message);
        })
    }

    const resendCode =(e)=>{
        e.preventDefault();

        Axios.post("http://localhost:3001/auth/newKey",{
            email: email,
        }).then((response)=>{
            console.log(response);
        }).catch((err)=>{
            console.log(err);
        })
    }

    useEffect(() => {
        localStorage.setItem("token",'');
      }, [])
    

    return (
        <div className={styles.align_center}>
            <div className={styles.login}>
            <Form onSubmit={loginUser}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className = {styles.label}>Email</Form.Label>
                    <Form.Control type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value) }/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className = {styles.label}>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value) }/>
                </Form.Group>
                <Row>
                    <Col sm={8}>
                <Button variant="primary" type="submit" >
                    Submit
                </Button>
                </Col>
                <Col sm={4}>
                    <div className={styles.right}>
                    <Link href="/register">Register here</Link>
                    </div>
                </Col>
                </Row>
            </Form>
            <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Acount confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    Please enter the confirmation code we sent at your email address
                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Code" value={code} onChange={(e)=>setCode(e.target.value) }/>
                </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={resendCode}>Resend Code</Button>
                <Button onClick={verifiyCode} variant="success">Submit</Button>
                <Button onClick={handleShow} variant='secondary'>Close</Button>
            </Modal.Footer>
            </Modal>
            </div>
        </div>
     );
}
 
export default Login;