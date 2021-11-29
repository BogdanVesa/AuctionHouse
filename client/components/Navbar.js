import Button from "react-bootstrap/Button";
import Container  from "react-bootstrap/Container";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import {useState} from "react";
import { useEffect } from "react";
import Axios from 'axios';
import {useRouter} from 'next/router';
import styles from "../styles/Navbar.module.css"


const Navbar = () => {

    const [username, setUsername] = useState("");
    const router = useRouter();

    const getUsername = () =>{
        Axios.get("http://localhost:3001/auth/getUserInfo", {headers : {
            "x-access-token": localStorage.getItem('token'),
        }}).then((response =>{
            setUsername(response.data[0].username);
        })).catch(err => {
            alert(err.response.data.message);
        });
    }

    const toCreatePost = () =>{
        router.push("/createPost");
    }

    const toHome = () =>{
        router.push("/");
    }


    useEffect(() => {
        if(localStorage.getItem("token") === ''){
            router.push("/login")
        }
        getUsername();
      }, [])

    return (
        <div className={styles.navbar}>
            <Container>
        <Row >
            <Col md={8}>      
                <Button variant="success" size="sm" onClick={toHome}>Home</Button>{' '}
                <Button variant="success" size="sm">Your bids</Button>{' '}
                <Button variant="success" size="sm" onClick={toCreatePost}>Create bid</Button>{' '}
            </Col>
            <Col md={4}>
                {username}
                <div className={styles.nav}>
                <Button variant="success" size="sm" onClick={toCreatePost}>Balance $0.0</Button>{' '}
                </div>
            </Col>
        </Row>
        </Container>
        </div>
     );
}
 
export default Navbar;