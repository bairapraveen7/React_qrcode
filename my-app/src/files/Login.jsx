import axios from "axios";
import React, { useState } from "react";
import { ReactDOM } from "react";

function Login()
{

    const [data,setdata] = useState({id:""});

    const [srcval,setsrc] = useState("");

    function sett(e)
    {
        setdata({...data, id: e.target.value});
    }


    function send()
    {
        axios
        .post('http://localhost:3001/find',data)
        .then( (res) => {
            
              const base64Data = res.data;
              console.log(base64Data);
              setsrc(base64Data);
              
            })
        .catch(err => {
            console.log(err);
        });
            
    }

    return (
        <div>
    <h1>Login</h1>

    <form>
        <label for="id">ID:</label>
        <input type="text" id="id" name="id" onChange={sett} required></input><br></br>

        <input type="button" onClick={send} value="Login"></input>
    </form>

    {srcval && <img src={srcval} alt="QR Code" />}

        </div>
    );
}

export default Login;