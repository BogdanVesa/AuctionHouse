import { Container, Form } from "react-bootstrap";

const SearchBar = () => {
    return ( 
        <Container>
        <Form>
            <Form.Control size="lg" type="text" placeholder="Search item..." />
        </Form>
        </Container>
     );
}
 
export default SearchBar;