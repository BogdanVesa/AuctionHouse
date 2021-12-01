import styles from "../styles/CreatePost.module.css"
import TagCreateItem from "./TagCreateItem";

const TagCreateList = ({tagList, onAdd, onRemove}) => {
    return (
        <div className={styles.tagList}>
            {tagList.map((tag)=>(
                <TagCreateItem name = {tag.name} key={tag.name} onAdd={onAdd} onRemove={onRemove}/>
            ))}
        </div> 

     );
}
 
export default TagCreateList;