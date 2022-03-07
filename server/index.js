const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
// app.use(bodyParser.json());
const apiKeyAuth = require('api-key-auth');
const api_key = "6aeec49c64bf4614b3d5b021f69373e3"

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "job_queue",
  password: "password",
  port: 5432
});

//create
app.post("/api/v1/jobq", (req, res) => {
  if(api_key == req.body.pat) {
    const job_name  = req.body.job_name;
    const job_status = "in_progress";
  
    pool.query(
      "INSERT INTO job_table (job_name, job_status) VALUES ($1, $2)",
      [job_name, job_status],
      (error, results) => {
        // console.log(results)
        get_job_id(job_name,res)
        if (error) {
          throw error;
        }
        
      })
  } else {
    res.status(403).send('Forbidden');
  }
    
      
  })
  
  async function get_job_id(n,res) {
    if(api_key == req.body.pat) {
      pool.query(
        "SELECT job_id FROM job_table WHERE job_name = $1",
          [n],
          (error, results) => {
            // console.log("gold")
            // console.log(results, results.rows[0].job_id)
            if (error) {
              throw error;
            }
            res.json({
              "job_id": results.rows[0].job_id,
            }); 
            return results.rows[0].job_id
          }
      )
    }  else {
      res.status(403).send('Forbidden');
    }
    
  };

//get 
app.get("/api/v1/jobq", (req, res) => {

    pool.query(
      "SELECT job_id, job_name, job_status, job_updated, created_at FROM job_table ORDER BY created_at ASC",
      [],
      (error, results) => {
        if (error) {
          throw error;
        }
  
        res.status(200).json(results.rows);
      }
    );
  }
    
  );

//get by param
app.get("/api/v1/jobq/:status", (req, res) => {
    const { status } = req.params;
  
    pool.query(
      "SELECT job_id, job_name, job_status, job_updated, created_at FROM job_table WHERE job_status = $1",
      [status],
      (error, results) => {
        if (error) {
          throw error;
        }
  
        res.status(200).json(results.rows);
      }
    );

   
  });

//update  
app.put("/api/v1/jobq/:id", (req, res) => {
  if(api_key == req.body.pat) {
    console.log(req.params,req.body)
    const { id } = req.params;
    const job_status = req.body.job_status;
    const job_updated = new Date().toISOString().replace("T"," ")
  
    pool.query(
      "UPDATE job_table SET job_status = $1, job_updated = $2 WHERE job_id = $3",
      [job_status, job_updated, id],
      (error, results) => {
        if (error) {
          throw error;
        }
  
        res.sendStatus(200);
      }
    );
  }   else {
    res.status(403).send('Forbidden');
  }
    
  });

app.listen(8000, () => {
  console.log(`Server is running.`);
});