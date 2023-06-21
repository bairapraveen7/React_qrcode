
import React from "react";
import { useState } from "react";
import axios from "axios";
import { ReactDOM } from "react";

function Form()
{

    const [val,setimg] = useState('');

    const [data,setdata] = useState({name:"",place:"",mobile:"",doctor:"",disease:""});

    function set(e)
    {
      setdata({...data, [e.target.name]: e.target.value});
    }

    function send()
    {
        axios
        .post('http://localhost:3001/upload',data)
        .then( (res) => { 
              setimg(res.data);
              console.log("hi");
              console.log(res.data);
        }
            )
        .catch(err => {
          console.error(err);
        });
    }

    return (
        <div>
        
    <h1>Register</h1>

    <form>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" onChange={set} required></input><br></br><br></br>

        <label for="place">Place:</label>
        <input type="text" id="place" name="place" onChange={set} required></input><br></br><br></br>

        <label for="mobile">Mobile No:</label>
        <input type="tel" id="mobile" name="mobile" onChange={set} required pattern="[0-9]{10}"></input><br></br><br></br>

        <label for="doctor">Personal Doctor:</label>
        <input type="text" id="doctor" name="doctor" onChange={set} required></input><br></br><br></br>

        <label for="disease">Disease:</label>
        <input type="text" id="disease" name="disease" onChange={set} required></input><br></br><br></br>

        <input type="button" onClick={send} value="Submit"></input>
    </form>
  
     {val && <p>your id is {val}</p>}

        </div>
    );

}

export default Form;

