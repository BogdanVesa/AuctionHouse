import { Form } from "react-bootstrap";
import { useState } from "react";

const TagItem = ({name, onAdd, onRemove}) => {
    const[state, setState] = useState(false);
    
    const changeState =()=>{
        
        setState(!state);
        if(state){
            onRemove(name);
        }
        else
        {
            onAdd(name);
        }
    }

    return ( 
        <div>
            <Form.Check 
            checked={state}
            type='checkbox'
            label={name}
            onChange={changeState}
            />
        </div>
     );
}
 
export default TagItem;