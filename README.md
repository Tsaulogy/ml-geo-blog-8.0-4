# Instructions


Take a look at the blog post that discusses this app: (link here when post is published)

##Prequisites
You will need:
* An installation of [MarkLogic 8.0-4](https://developer.marklogic.com/products) (latest release of MarkLogic 8)

##Setup
1. Clone this repository
2. Open your browser and go to the Red Admin GUI (http://localhost:8001/default.xqy)
3. Select 'Databases'
4. Select the 'Create' tab and create a database
5. Go back to the main page of the Red Admin GUI. Select 'App Servers'
6. Select the 'Create HTTP' tab and create a new app server with the root pointing to the file locaiton of the repo (e.g. D:/github/ml-geo-blog-8.0-4/) and a port number (e.g. 1234)
7. In your browser, go to that app server port (e.g. http://localhost:1234/default.html) to see the app