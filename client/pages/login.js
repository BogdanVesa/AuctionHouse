import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from '../styles/Login.module.css';
import { text } from 'dom-helpers';
import { useState } from 'react';
import Axios from 'axios';
import {useRouter} from 'next/router';


const Login = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const router = useRouter();

    const loginUser = (e) =>{
            e.preventDefault()
            Axios.post("http://localhost:3001/auth/login",{
                email : email,
                password : password
            }).then((response =>{
                alert(response.data.message);
                console.log(response);

                setEmail('');
                setPassword('');
                // router.push('/');
            })).catch(err => {
                // what now?
                alert(err.response.data.message);
                console.log(err);
            });
       
    }

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
            </Form>
            </div>
        </div>
     );
}
 
export default Login;