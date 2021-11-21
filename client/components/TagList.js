import styles from "../styles/Tag.module.css"
import TagItem from "./TagItem";

const TagList = ({tagList}) => {
    return ( 
        <div className={styles.tag}>
            {tagList.map((tag)=>(
                <TagItem name = {tag.name} key={tag.TagID}></TagItem>
            ))}
        </div>
     );
}
 
export default TagList;
