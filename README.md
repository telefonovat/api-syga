# api-syga

## REST API endpoints

### users/register

Accepts username, email, password

Returns status code and message

### users/login

Accepts username and password

returns status code and JWT wrapped in JSON

### algorithm/execute

Accepts python code
Returns visualization frames in JSON

### users/:username/codes

#### POST
Needs authentication. 
Adds the code to the user's selection
