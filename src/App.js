import React, { useState } from 'react';
import './App.css';
import { Amplify, Storage, API } from 'aws-amplify';
import * as AWS from 'aws-sdk';

Amplify.configure({
  Auth: {
      identityPoolId: 'REMOVED', //REQUIRED - Amazon Cognito Identity Pool ID
      region: 'us-west-2', // REQUIRED - Amazon Cognito Region
  },
  Storage: {
      AWSS3: {
          bucket: 'REMOVED', //REQUIRED -  Amazon S3 bucket name
          region: 'us-west-2', //OPTIONAL -  Amazon service region
      }
  },
  API: {
    endpoints: [
        {
            name: "SendEmail",
            endpoint: "REMOVED"
        }
    ]
}
})

var myConfig = new AWS.Config({region: 'us-west-2', accessKeyId: 'REMOVED', secretAccessKey: 'REMOVED'});


function App() {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  const fileReader = new FileReader();

  const divStyle = {
    padding:'10px',
    margin:'10px',
    textAlign: "center",
    backgroundColor:'#cccccc'
  }

  const handleOnChange = (e) =>  {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

   async function sendEmails(e) {
      console.log(document.getElementById('title').value)
      console.log(document.getElementById('body').value)

      var params = {
        FunctionName: 'frontemail', 
        Payload: JSON.stringify( { title: document.getElementById('title').value, body: document.getElementById('body').value} )
      };

      const result = await (new AWS.Lambda().invoke(params).promise());

      console.log('Success!');
      console.log(result);
  }


  async function handleOnSubmit(e) {
    console.log("here")
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);

      try {
        await Storage.put(file.name, file);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
      
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));


  return (
    <div className="App" style={divStyle}>
      <h1> Upload the CSV file </h1>
      <form >
        <input 
          className="form-control container "
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />
        <br/>
        <button className="btn btn-light"
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>
          
      <br />
      <hr/>
          <p>Enter Email Title <input id="title" style={{margin:"10px"}} >
          </input>
          </p> 

          <hr/>          

          <p>Enter Email Body  <input id="body" style={{margin:"10px"}}> 
          </input>
          </p>

          <button className="btn btn-light"
          onClick={(e) => {
            sendEmails(e);
          }}
        >
          Send
        </button>
          
          <hr/>

    </div>
  );


export default App;