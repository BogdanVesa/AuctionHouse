import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from '../styles/Login.module.css';
import { text } from 'dom-helpers';
import { useState } from 'react';
import Axios from 'axios';
import {useRouter} from 'next/router';

const Register = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [confirmed, setConfirmed] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();


    const registerUser = (e) =>{
        e.preventDefault();
        const validateStatus = validateData(email, username, password, confirmed); 
        if( validateStatus === 0){
            Axios.post('http://localhost:3001/auth/register',{
                email : email,
                username : username,
                password : password 
            }).then((response =>{
                router.push('/login');
            })).catch(err => {
                alert(err.response.data.message);
                console.log(err);
            });
        }
        else if(validateStatus === 1){
            alert("Email was incorrect");
        }
        else if(validateStatus === 2){
            alert("Username must be longer than 5 characters");
        }
        else if(validateStatus === 3){
            alert("Password must be longer than 5 characters");
        }
        else{
            alert("Password and confirm password doesn't match");
        }
    }
    const validateData = (email,username,password,confirmed) =>{
        if(!email || email.length < 5 || !(email.includes('@')))
            return 1;
        if(!username ||username.length < 5)
            return 2;
        if(!password  || password.length < 5)  
            return 3 ; 
        if(!confirmed || password !== confirmed)
            return 4;
        return 0;
    }

    return (  
    <div className={styles.align_center}>
        <div className={styles.login}>
        <Form onSubmit={registerUser}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className = {styles.label}>Email</Form.Label>
                <Form.Control type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value) }/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label className = {styles.label}>Username</Form.Label>
                <Form.Control type="text" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value) }/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className = {styles.label}>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value) }/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicConfirmed">
                <Form.Label className = {styles.label}>Confirmed password</Form.Label>
                <Form.Control type="password" placeholder="Confirm password" value={confirmed} onChange={(e)=>setConfirmed(e.target.value) }/>
            </Form.Group>
            <Button variant="primary" type="submit" >
                Submit
            </Button>
        </Form>
        </div>
    </div>
    );
}
 
export default Register;
