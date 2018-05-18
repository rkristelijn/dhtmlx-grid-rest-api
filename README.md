# Grid using dhx and socket.io

DHTMLX is a cool GUI framework. If you work with the standard PHP server side connectors, it is very easy to set up. However... it uses XML and only HTTP POST and GET. In my scenario I want to use Node, JSON and REST. Even though the `dataProcessor` has a mode to work in `REST`-mode, I came across the following issues:

* When binding a grid and a form, and the hitting the 'save' button on the form, it sends a PUT twice. You need to first unsubscribe the `dataProcessor` and then manually trigger the event and then resubscribe the events.
* When deleting a row, `dataProcessor` sends a `PUT` instead of a `DELETE`.
* You need to initialize the grid (and not the `dataProcessor`) with data and this bypasses the `dataProcessor`. 
* `dataProcessor` uses AJAX, which is not the latest technology. In itself this is not an issue, but I want to use fetch using newline delimited JSON to enable streaming.

Anyway, this is how far I came until I decided to not use `dataProcessor`. There is (at least) one bug; 

- when a new record is inserted, the grid uses the id of grid, not the id of Mongo, so updates will result in inserts. There should be a callback somewhere in the grid or dataProcessor to put [`mygrid.changeRowId("old_id","new_id");`](https://docs.dhtmlx.com/grid__basic_operations.html#setting_id)

# Setting up

* clone the repo: `git clone https://github.com/rkristelijn/grid-socket-io.git`
* get the node_modules folder: `npm i`
* start the app: `node .`
* point your browser to : `localhost:3000`

# Plan

- [x] Set up DHTMLX app using the [tutorial](https://docs.dhtmlx.com/tutorials__first_app__index.html)
- [x] connect all CRUD methods and get a working app
- [x] Clean up code and write a tutorial to get this far

# Next

- [ ] Implement socket.io / drop using `dataProcessor`, maybe recompile dhtmlx using only the gui elements
- [ ] drop all xml stuff, switch to json
- [ ] create a repo for the data structures so I can update the application dynamically
- [ ] remove icons and replace with glyphicons
