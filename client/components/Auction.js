import styles from "../styles/Auction.module.css"
import Picture from "./Picture";

const Auction = () => {
    return ( 
    <div className={styles.auction}>
        <Picture/>
    </div> 
    );
}
 
export default Auction;