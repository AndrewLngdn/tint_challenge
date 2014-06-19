tint_challenge
==============  

This project connects to the Twitter Streaming API to aggregate and count inputed hashtags in real-time using Node.js, MongoDB, Sockets.io. The user creates 'battles' by choosing two hashtags, and the application uses these hashtags to filter Twitter's datastream. 


To run:

MongoDB must be running. If `DATABASE_URL` environment variable isn't set, the server will attempt to connect to `mongodb://localhost:27017`. 



You must define  
`TWITTER_CONSUMER_KEY` `TWITTER_CONSUMER_SECRET`
`TWITTER_ACCESS_TOKEN` `TWITTER_ACCESS_TOKEN_SECRET`  
environment variables to connect to Twitter. 
You can define these and start the server by entering

`$ TWITTER_CONSUMER_KEY=your_key ...other keys... npm start`

or by defining them in a shell startup script. If they are already definded, just run
`npm install`
`npm start`

This would be an interesting addition to Tint as a real-time voting system for displays. A user could start a battle at any public event to poll the crowd. It could also be used personally to measure awareness of brands by counting tags on twitter. A customer could start multiple tag battles over different periods to get a sense of how the numbers change over time.   

An extention of this project could keep more detailed information in the data model, which could be used to plot time-series data to get a better sense of the velocty of tags at any given time after the battle has started. This data could be used to see how long twitter users stay interested in certain tags. 
