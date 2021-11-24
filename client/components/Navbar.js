import Button from "react-bootstrap/Button";
import Container  from "react-bootstrap/Container";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import {useState} from "react";
import { useEffect } from "react";
import Axios from 'axios';
import {useRouter} from 'next/router';


const Navbar = () => {
    const mystyle={
        height: "40px",
        backgroundColor: "grey",
    }
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
        <Row style={mystyle}>
            <Col sm={4}>      
                <Button variant="secondary" size="sm" onClick={toHome}>Home</Button>{' '}
                <Button variant="secondary" size="sm">Your bids</Button>{' '}
                <Button variant="secondary" size="sm" onClick={toCreatePost}>Create bid</Button>{' '}
            </Col>
            <Col sm={{ span: 4, offset: 4 }}>
                <h3 style={{textAlign : "right", fontSize : "17px", paddingRight:"10px"}} > {username} Balance: $0.0 </h3>
            </Col>
        </Row>
     );
}
 
export default Navbar;