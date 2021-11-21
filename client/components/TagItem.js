import { Form } from "react-bootstrap";

const TagItem = ({name}) => {
    
    return ( 
        <div>
            <Form.Check 
            type='checkbox'
            label={name}
            />
        </div>
     );
}
 
export default TagItem;