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
    const [balance,setBalance]= useState('');
    const router = useRouter();

    const getUsername = () =>{
        Axios.get("http://localhost:3001/auth/getUserInfo", {headers : {
            "x-access-token": localStorage.getItem('token'),
        }}).then((response =>{
            setUsername(response.data[0].username);
            setBalance(response.data[0].balance);
        })).catch(err => {
            alert(err);
        });
    }

    const toCreatePost = () =>{
        router.push("/createPost");
    }

    const toHome = () =>{
        router.push("/");
    }

    const toHistory=()=>{
        router.push("/history");
    }

    const addBalance =(e)=>{
        e.preventDefault();
        Axios.get('http://localhost:3001/auth/addBalance',{headers : {
            "x-access-token": localStorage.getItem('token'),
        }}).then((response)=>{
            console.log(response.data)
            setBalance(String(response.data));
        }).catch((err)=>{
            alert(err.message);
        })
    }


    useEffect(() => {
        if(localStorage.getItem("token") === undefined || localStorage.getItem("token") === '' ){
            router.push("/login")
        }
        else{
            getUsername();    
        }
      }, [])

    return (
        <div className={styles.navbar}>
            <Container>
        <Row >
            <Col md={8}>      
                <Button variant="success" size="sm" onClick={toHome}>Home</Button>{' '}
                <Button variant="success" size="sm" onClick={toHistory}>Your bids</Button>{' '}
                <Button variant="success" size="sm" onClick={toCreatePost}>Create bid</Button>{' '}
            </Col>
            <Col md={4}>
                {username}
                <div className={styles.nav}>
                <Button variant="success" size="sm" onClick={addBalance}>Balance ${balance}</Button>{' '}
                </div>
            </Col>
        </Row>
        </Container>
        </div>
     );
}
 
export default Navbar;