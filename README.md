# HaikuJam
Simple Node + Express + MongoDb App
This app has three APIs
1. localhost:3000/ 
It fetches a incomplete three-line poem(Haiku). And let you add next line in it. If there is no incomplete Haiku in Db then it let you write first line of it.
2. localhost:3000/addLine
Adds your line to the incomplete Haiku and returns another incomplete Haiku.
3. localhost:3000/showDbConfig
It returns some Db statistics.
