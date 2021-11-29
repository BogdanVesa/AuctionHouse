import { Container, Form } from "react-bootstrap";
import { useState } from "react";

const SearchBar = ({searchPost}) => {
    const [post,setPost] = useState('');

    const handler=(e)=>{
        if(e.key === 'Enter'){
            e.preventDefault();
            searchPost(post);
        }
    }
    return ( 
        <Container>
            <Form>
                <Form.Control size="lg" type="text" placeholder="Search item..."
                onChange={(e)=>setPost(e.target.value)} 
                onKeyPress={(e) => handler(e)} />
            </Form>
        </Container>
     );
}
 
export default SearchBar;