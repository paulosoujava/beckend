const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(cors());

app.use(express.json());

const projects = [];

function myMiddleware(request, response, next){
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`
  
  console.time(logLabel)
    next();
    
   console.timeEnd(logLabel)
}


function validateUUID(request, response, next){
  const { id } = request.params;
  if( !isUuid(id)){
    return response.status(400).json({erro: 'invalid project id'});
  }
  return next();
}

app.use(myMiddleware);
app.use('/projects/:id', validateUUID);

app.get('/project', (request, response) =>{
  const{ name } = request.query;
  const result = name 
  ? projects.filter(p => p.name.includes(name))
  : projects;
  return response.json(result);
});


app.put('/projects/:id', (request, response) =>{
  const {id} = request.params;
  const{ name, job } = request.body;
  const projectIdx = projects.findIndex( p => p.id === id );
  if( projectIdx < 0 ){
    return response.status(400).json({message : "Project not foud"});  
  }
  const project = { id, name, job };
  projects[projectIdx] = project;
  return response.json(project);
});



app.delete('/projects/:id', validateUUID, (request, response) =>{
  const {id} = request.params;
  const projectIdx = projects.findIndex( p => p.id === id );
  if( projectIdx < 0 ){
    return response.status(400).json({message : "Project not foud"});  
  }
  projects.splice(projectIdx, 1);
  return response.status(200).send();
});

app.post('/projects', (request, response) =>{
  const{ name, job } = request.body;
  const project = { id: uuid(), name, job };
  projects.push(project);
  return response.json(projects);
});



app.listen(3333, () => {
  console.log('🎸 Back-end started! 🙌')
});

