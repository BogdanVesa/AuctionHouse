import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from '../styles/Login.module.css';
import { text } from 'dom-helpers';
import { useState } from 'react';
import Axios from 'axios';
import {useRouter} from 'next/router';
import { useEffect } from "react";
import Link from 'next/link'


const Login = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');

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
                    console.log(localStorage.getItem("token"));
                    setEmail('');
                    setPassword('');
                    router.push('/');
                })).catch(err => {
                    // what now?
                    alert(err.response.data.message);
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
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit" >
                    Submit
                </Button>
                <Link href="/register">Register here</Link>
            </Form>
            </div>
        </div>
     );
}
 
export default Login;