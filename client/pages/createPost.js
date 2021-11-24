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


const createPost = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

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
    const printTags = () =>{
        console.log(addTag);
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
    useEffect(() => {
        getTaglist();
      }, [])

    return (
        <div>
            <Navbar></Navbar>
            <Container>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={(e)=>setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" placeholder="Price" onChange={(e)=>setPrice(e.target.value)}/>
                </Form.Group>
            </Form>
            <TagList tagList={tagList} onAdd={addTagPost} onRemove={removeTagPost}/>
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
            <Button variant="secondary" size="sm" onClick={sumbitPost}>Submit</Button>{' '}
            </Container>
        </div>

      );
}
 
export default createPost;