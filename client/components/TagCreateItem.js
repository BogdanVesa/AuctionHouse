import { Form } from "react-bootstrap";
import { useState } from "react";
import styles from "../styles/CreatePost.module.css"

const TagCreateItem = ({name, onAdd, onRemove}) => {
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
        <div className={styles.tagItem}>
            <Form.Check
            checked={state}
            type='checkbox'
            label={name}
            onChange={changeState}
            />
        </div>
     );
}
 
export default TagCreateItem;