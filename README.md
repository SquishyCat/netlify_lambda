# OAuth Secret Hashing Micro-Service Example

This is a microservice build using Netlify Functions (AWS Lambda Functions) that enables hiding the OAuth api secret from client apps. This requires that the OAuth provider, GameSparks for example, pass the client a nonce to use to hash the secret, which is held in environment variables on the Netlify deployment.

## How this works

During the initialization of an OAuth client, a key and secret must be provided to the OAuth service. Secrets being what they are, we don't want that getting out into the wild (ie: inspecting an HTML page). So, we store that secret in environment variables on the Netlify deployment. When we call initialize our client with the OAuth provider, we provide the secret's corresponding key. The service will provide a nonce to the client, which will be passed to this service. We create a hash of the secret with the nonce. Since the OAuth provider is the only one who knows how to decrypt the hash with the nonce, we can safely pass the hashed secret to the client for further passing to the OAuth provider without the client knowing what the secret is.

## How we create this project

### Setup Netlify

Take a look [here](https://www.netlify.com/docs/functions/) for Netlify documentation on their Lambda functions.

Create your deploy, as usual, but you'll also need to create environment variables. Once you've selected your deployment from your Netlify dashboard, select the **Deploys** tab, then click the **Deploy Settings** button. Scroll down to **Build environment variables**. Create 4 new variables.
- API_KEY
    - Value: the API key of your game/app
- API_SECRET
    - Value: the API seret of your game/app
- DEBUG
    - true | false - This will cause debug information to be attached to the JSON output of the hash function
- LAMBDA_ENDPOINT
    - this is the full URL path, not including the endpoint, itself. For instance: https://mygame.netlify.com/.netlify/functions/. The `.js` will append the appropriate function and querystrings. As we may put in more functions, we want this to be generic. Also, .netlify/functions/ is the default location for lambda functions on Netlify.

### netlify.toml
The netlify.toml is a way for us to define the deployment settings for Netlify. These setting will override corresponding settings in the Netlify site. Here is a simple one:
```
[build]
    command = "npm run build"
    publish = "dist"
    functions = "functions"
```
These echo the settings that you might manually set in the web interface of your deployment. **Command** is the build command to run, **publish** is the directory from which to serve your site, and **functions** points to the directory where the compiled lambda functions will be served from.

### netlify-lambda
```
npm install netlify-lambda
```
This tool allows serving and building the lambda functions. Take a look in the `package.json` in the `dev` and `build` scripts to see how we use it, here.

### src/index.js
In this example, this is where we include the OAuth initialization. Here, we're init'ing against GameSparks. Take a look at the `init` function where `initPreview` is called. In particular, look at `onNonce`, which calls a matching function, which, in turn, calles `getHMAC`. `getHMAC` uses a _synchronous_ call to our Lambda Function to retrieve the hash. The reason for this _synchronous_ call is that it is a callback function that needs a return value of the hashed secret to proceed. Not optimal, but whatever.

### ./netlify-lambda/
This is where the source for our lambda functions lives. The code is pretty self explanatory. The only change you really need to make is to adjust the CORS headers so that it's more restrictive.

## Optional, but cool, stuff, here.

### dotenv
```
npm install dotenv
```
This allows us to define environment variables in a file named `.env`. Take a look at `sample.env` for an example. To use it, rename it to `.env` and fill in appropriate values. **Note:** these values will _not_ override existing environment variables. So, this is incredibly handy for moving from environment to environment.

    WARNING: DO NOT check in your .env file or _any_ secrets to a repo...EVER!

