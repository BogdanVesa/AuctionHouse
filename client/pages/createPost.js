import Navbar from "../components/Navbar";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subDays } from "date-fns";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Container } from "react-bootstrap";
import TagList from "../components/TagList";
import { useEffect } from "react";
import Axios from "axios";
import styles from "../styles/CreatePost.module.css";
import TagCreateList from "../components/TagCreateList";


const createPost = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [picture, setPicture] = useState('');
    const [file, setFile] = useState('');

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
    
        return currentDate.getTime() < selectedDate.getTime();
      };

    const showTime =(e)=>{
        e.preventDefault();

        console.log(endDate);
    }
    const [tagList,setTagList] = useState([]);
    const [addTag, setAddTag] = useState([]);

    const getTaglist =() =>{
        Axios.get("http://localhost:3001/allTags").then((response =>{
        console.log(response.data);
        setTagList(response.data);
        }));
    }

    const addTagPost =(name)=>{
        if(!addTag.includes(name))
            setAddTag([...addTag, name]);
        // console.log(addTag);
    }

    const removeTagPost=(name)=>{
        if(addTag.includes(name))
        {
            const addTagCopy = [...addTag];
            setAddTag(addTag.filter((t) => {
                return  t !== name
            }))
        }
    }

    const sumbitPost =(e)=>{
        e.preventDefault();
        const s = ""
        if(description.length < 0 || description.length > 300){
            s+= "Description must be between 25 and 300\n"
        }
        if(price <=0){
            s+= "Price must be bigger than 0\n"
        }
        if(addTag.length < 1){
            s+="You must choose atleast a tag\n"
        }
        if(s!=""){
            alert(s);
        }
        else
        {
            const post = {
                description : description,
                price : price,
                endDate : endDate.toISOString(),
                tagList : addTag
            }
            const config = {
                headers : {
                    "x-access-token": localStorage.getItem('token'),
                }
            };
            console.log(post)
            Axios.post("http://localhost:3001/posts/createPost",post,config)
             .then((resolve)=> {
                 alert("post was created successfully")
                 })
                 .catch(err => {
                     // what now?
                     alert(err.response.data.message);
                     console.log(err);
                 });
        }
            
    }
    const handlerImage =(e)=>{
        setPicture(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
    }

    const showPicture =(e)=>{
        e.preventDefault();
        console.log(file);
    }
    useEffect(() => {
        getTaglist();
      }, [])

    return (
        <div>
            <Navbar></Navbar>
            <Container className={styles.create}>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={(e)=>setDescription(e.target.value)} />
                </Form.Group>
                <div className={styles.price}>
                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" placeholder="Price" onChange={(e)=>setPrice(e.target.value)}/>
                </Form.Group>
                </div>
            </Form>
            <div className={styles.alignRow}>
                <TagCreateList tagList={tagList} onAdd={addTagPost} onRemove={removeTagPost}/>
                <div className={styles.picture}>
                    <div>
                        <input type="file" onChange={handlerImage}/>
                        <Button variant="success" size="sm" onClick={showPicture}>Add picture</Button>{' '}
                    </div>
                    <div className={styles.picturePreview}>
                        <img className={styles.showPicture} src={picture}/>
                    </div>
                </div>
                <div className={styles.date}>
                    <div>
                        Ends at:
                        <DatePicker
                        filterDate={d => {
                        return d > subDays(new Date(),1)
                        }}
                        filterTime={filterPassedTime}
                        placeholderText="Select End Date"
                        showTimeSelect
                        timeIntervals={5}
                        dateFormat="dd/MM/yyyy h:mmaa"
                        selected={endDate}
                        startDate={startDate}
                        onChange={date => setEndDate(date)}/>
                    </div>
                    <div>
                        <Button variant="success" size="sm" onClick={sumbitPost}>Submit</Button>{' '}
                    </div>
                </div>
            </div>
            </Container>
        </div>

      );
}
 
export default createPost;