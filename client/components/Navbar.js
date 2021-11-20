import Button from "react-bootstrap/Button";
import Container  from "react-bootstrap/Container";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";

const Navbar = () => {
    const mystyle={
        height: "40px",
        backgroundColor: "grey",
    }
    return (
        <Row style={mystyle}>
            <Col sm={4}>      
                <Button variant="secondary" size="sm">Home</Button>{' '}
                <Button variant="secondary" size="sm">Your bids</Button>{' '}
                <Button variant="secondary" size="sm">Create bid</Button>{' '}
            </Col>
            <Col sm={{ span: 4, offset: 4 }}>
                <h3 style={{textAlign : "right", fontSize : "17px", paddingRight:"10px"}} >Balance: $0.0 </h3>
            </Col>
        </Row>
     );
}
 
export default Navbar;