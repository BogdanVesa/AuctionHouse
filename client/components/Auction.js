import styles from "../styles/Auction.module.css"
import Picture from "./Picture";
import format from 'date-fns/format'
import {useRouter} from 'next/router';

const Auction = ({post}) => {
    const router = useRouter();
    const toPost=(e)=>{
        e.preventDefault();
        router.push(`/post/${post.postID}`)

    }


    return ( 
    <div onClick={toPost} className={styles.auction}>
        <Picture postID = {post.postID}/>
        <div className={styles.description}>{post.description}</div> 
        <div className={styles.priceDate}>
            <div>Ends at:</div>
            <div>{format(Date.parse(post.endTime), 'd.MM.Y H:m')}</div> 
            <div>Price: ${post.currentPrice}</div>
            </div>
    </div>
    );
}
 
export default Auction;