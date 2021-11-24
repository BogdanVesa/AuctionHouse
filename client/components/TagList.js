import styles from "../styles/Tag.module.css"
import TagItem from "./TagItem";

const TagList = ({tagList, onAdd, onRemove}) => {
    return ( 
        <div className={styles.tag}>
            {tagList.map((tag)=>(
                <TagItem name = {tag.name} key={tag.name} onAdd={onAdd} onRemove={onRemove}></TagItem>
            ))}
        </div>
     );
}
 
export default TagList;
