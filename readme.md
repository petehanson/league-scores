# Installation

1. `npm install`
2. Copy env.template to .env and then update the values with the Google service email and private key for the application you made. Instructions at: 
    - https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    - https://www.npmjs.com/package/google-spreadsheet


# Local Dev

1. `npm run dev`

# Deployment

1. Login to Heroku
2. Make sure Heroku repository is added to your remotes.
3. Push repository to Heroku
4. Update Heroku app with environment variables from your .env file.