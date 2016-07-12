# Instructions


Take a look at the blog post that discusses this app: [Exciting Times in MarkLogic Geospatial](http://developer.marklogic.com/blog/exciting-times-in-marklogic-geospatial)

##Prequisites
You will need:
* An installation of [MarkLogic 8.0-4](https://developer.marklogic.com/products) or later (but must be MarkLogic 8.0-x)

##Setup
1. Clone this repository
2. Open your browser (preferably Chrome) and go to the Red Admin GUI (http://localhost:8001/default.xqy)
3. Select 'App Servers'
4. Select the 'Create HTTP' tab and create a new app server with a name, the root pointing to the file location of the repo (e.g. D:/github/ml-geo-blog-8.0-4/) and a port number (e.g. 1234). You'll want modules to point to your file system. Also, since we're not storing any data in the database, you can use the default database 'Documents' 
5. In your browser, go to that app server port (e.g. http://localhost:1234/default.html) to see the app
