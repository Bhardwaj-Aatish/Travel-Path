onload = function () {
    let curr_data,V,src,dst;

    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const container3=document.getElementById('mynetwork3');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const solve2= document.getElementById('solve2');
    const temptext = document.getElementById('temptext');
    const temptext2 = document.getElementById('temptext2');
    const cities = ['Delhi', 'Mumbai', 'Gujarat', 'Goa', 'Kanpur', 'Jammu', 'Hyderabad', 'Bangalore', 'Gangtok', 'Meghalaya'];
    
  
    // initialise graph options
    const options = {
        edges: {
            labelHighlightBold: true,
            font: {
                // size of weights on edges
                size: 20,
                color: '#cdcdcd',
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf015',
                size: 30,
                // color of houses
                color: '#991133',
                // color:'red',
            }
        }
    };

    // Initialize your network!
    // Network for question graph
    const network = new vis.Network(container);
    network.setOptions(options);
    // Network for result graph
    const network2 = new vis.Network(container2);
    network2.setOptions(options);

    // network for result graph for cost
    const network3=new vis.Network(container3);
    network3.setOptions(options);

    function createData(){
        V = Math.floor(Math.random() * 8) + 3; // Ensures V is between 3 and 10
        V=10;
        src=2;
        let nodes = [];
        for(let i=1;i<=V;i++){
            nodes.push({id:i, label: cities[i-1]})
        }
        // Prepares vis.js style nodes for our data
        nodes = new vis.DataSet(nodes);

        // Creating a tree like underlying graph structure
        let edges = [];
        for(let i=2;i<=V;i++){
            let neigh = i - Math.floor(Math.random()*Math.min(i-1,3)+1); // Picks a neighbour from i-3 to i-1
            edges.push({type: 0, from: i, to: neigh, color: 'orange',label:String(Math.floor(Math.random()*70)+31),title:  String(Math.floor(Math.random()*70)+150)});
        }

        // Randomly adding new edges to graph
        // Type of bus is 0
        // Type of plane is 1
        // type of train is 2
        for(let i=1;i<=V/2;){

            let n1 = Math.floor(Math.random()*V)+1;
            let n2 = Math.floor(Math.random()*V)+1;
            if(n1!==n2){
                if(n1<n2){
                    let tmp = n1;
                    n1 = n2;
                    n2 = tmp;
                }
                // Seeing if an edge between these two vertices already exists
                // And if it does then of which kind
                let works = 0;
                for(let j=0;j<edges.length;j++){
                    if(edges[j]['from']===n1 && edges[j]['to']===n2) {
                        if(edges[j]['type']===0)
                            works = 1;
                        else
                            works = 2;
                    }
                }

                // Adding edges to the graph
                // If works == 0, you can add bus as well as plane(train) between vertices
                // If works == 1, you can only add plane(train) between them
                if(works <= 1) {
                    if (works === 0 && i < V / 4) {
                        // Adding a bus
                        edges.push({
                            type: 0,
                            from: n1,
                            to: n2,
                            color: 'orange',
                            label: String(Math.floor(Math.random() * 70) + 31),
                            title:String(Math.floor(Math.random() * 70) + 150)
                        });
                        // Add a train
                        edges.push({
                            type: 2,
                            from: n1,
                            to: n2,
                            color: 'blue',
                            label: String(Math.floor(Math.random() * 50) + 21),
                            title:String(Math.floor(Math.random() * 70) + 100)
                        });
                    } else {
                        // Adding a plane
                        edges.push({
                            type: 1,
                            from: n1,
                            to: n2,
                            color: 'green',
                            label: String(Math.floor(Math.random() * 50) + 15),
                            title:String(Math.floor(Math.random() * 70) + 1000)
                        });

                        // Add a train
                        edges.push({
                            type: 2,
                            from: n1,
                            to: n2,
                            color: 'blue',
                            label: String(Math.floor(Math.random() * 50) + 21),
                            title:String(Math.floor(Math.random() * 70) + 100)
                        });
                    }
                    i++;
                }
            }
        }

        // Setting the new values of global variables
        // src =  1;
        
        
        // dst = V;
        curr_data = {
            nodes: nodes,
            edges: edges
        };
    }

    genNew.onclick = function () {
        
       document.getElementById("myform").reset();

        // Create new data and display the data
        createData();
        // create our new graph also in which edge is title
        // createDataForPrice();
        network.setData(curr_data);
        temptext2.innerText = 'Find least time path from Source  to Destination';
        temptext.style.display = "inline";
        temptext2.style.display = "inline";
        container2.style.display = "none";
        container3.style.display="none";

    };

    solve.onclick = function () {
        // Create graph from data and set to display
        // src=parseInt(document.getElementById('source').value);
        // src = src+2;
        
        dst=parseInt(document.getElementById('destination').value);
        console.log(dst);
        console.log(typeof(dst));
        temptext.style.display  = "none";
        temptext2.style.display  = "none";
        container3.style.display="none";
        container2.style.display = "inline";
        network2.setData(solveData());
    };

    // solve 2 function for cost graph 
    solve2.onclick= function()
    {
        // src=parseInt(document.getElementById('source').value);
        // src = cities.find(document.getElementById('source').value);
        // src = parseInt(document.getElementById('source').value);
        dst=parseInt(document.getElementById('destination').value);
        temptext.style.display  = "none";
        temptext2.style.display  = "none";
        container3.style.display="inline";
        container2.style.display = "none";
        network3.setData(solveDataUsingTitle());
    }

    

    function djikstra(graph, sz, src) {
        let vis = Array(sz).fill(0);
        let dist = [];
        for(let i=1;i<=sz;i++)
            dist.push([1000000,-1]);
        dist[src][0] = 0;

        for(let i=0;i<sz-1;i++){
            let mn = -1;
            for(let j=0;j<sz;j++){
                if(vis[j]===0){
                    if(mn===-1 || dist[j][0]<dist[mn][0])
                        mn = j;
                }
            }
            vis[mn] = 1;
            for(let j in graph[mn]){
                let edge = graph[mn][j];
                if(vis[edge[0]]===0 && dist[edge[0]][0]>dist[mn][0]+edge[1]){
                    dist[edge[0]][0] = dist[mn][0]+edge[1];
                    dist[edge[0]][1] = mn;
                }
            }
        }
        return dist;
    }

    function createGraph(data){
        let graph = [];
        for(let i=1;i<=V;i++){
            graph.push([]);
        }

        for(let i=0;i<data['edges'].length;i++) {
            let edge = data['edges'][i];
            if(edge['type']===1)
                continue;
            graph[edge['to']-1].push([edge['from']-1,parseInt(edge['label'])]);
            graph[edge['from']-1].push([edge['to']-1,parseInt(edge['label'])]);
        }
        return graph;
    }
    function createGraphUsingtitle(data){
        let graph = [];
        for(let i=1;i<=V;i++){
            graph.push([]);
        }

        for(let i=0;i<data['edges'].length;i++) {
            let edge = data['edges'][i];
            if(edge['type']===1)
                continue;
            graph[edge['to']-1].push([edge['from']-1,parseInt(edge['title'])]);
            graph[edge['from']-1].push([edge['to']-1,parseInt(edge['title'])]);
        }
        return graph;
    }

    function shouldTakePlane(edges, dist1, dist2, mn_dist) {
        let plane = 0;
        let p1=-1, p2=-1;
        for(let pos in edges){
            let edge = edges[pos];
            if(edge['type']===1){
                let to = edge['to']-1;
                let from = edge['from']-1;
                let wght = parseInt(edge['label']);
                if(dist1[to][0]+wght+dist2[from][0] < mn_dist){
                    // dist1 from src to [to](v) 
                    // u-v
                    // dist2 from dst to [from](u)
                    plane = wght;
                    p1 = to;
                    p2 = from;
                    mn_dist = dist1[to][0]+wght+dist2[from][0];
                }
                if(dist2[to][0]+wght+dist1[from][0] < mn_dist){
                    // dist2 from dest to [to](v)
                    // u-v
                    // dist from src to [from](u)
                    plane = wght;
                    p2 = to;
                    p1 = from;
                    mn_dist = dist2[to][0]+wght+dist1[from][0];
                }
            }
        }
        return {plane, p1, p2};
    }
    function shouldTakePlaneUsingTitle(edges, dist1, dist2, mn_dist) {
        let plane = 0;
        let p1=-1, p2=-1;
        for(let pos in edges){
            let edge = edges[pos];
            if(edge['type']===1){
                let to = edge['to']-1;
                let from = edge['from']-1;
                let wght = parseInt(edge['title']);
                if(dist1[to][0]+wght+dist2[from][0] < mn_dist){
                    plane = wght;
                    p1 = to;
                    p2 = from;
                    mn_dist = dist1[to][0]+wght+dist2[from][0];
                }
                if(dist2[to][0]+wght+dist1[from][0] < mn_dist){
                    plane = wght;
                    p2 = to;
                    p1 = from;
                    mn_dist = dist2[to][0]+wght+dist1[from][0];
                }
            }
        }
        return {plane, p1, p2};
    }

    function solveData() {

        const data = curr_data;

        // Creating adjacency list matrix graph from question data
        const graph = createGraph(data);

        // Applying djikstra from src and dst
        let dist1 = djikstra(graph,V,src-1);
        let dist2 = djikstra(graph,V,dst-1);

        // Initialise min_dist to min distance via bus and train  from src to dst
        let mn_dist = dist1[dst-1][0];

        // See if plane should be used
        let {plane, p1, p2} = shouldTakePlane(data['edges'], dist1, dist2, mn_dist);

        let new_edges = [];
        if(plane!==0){
            new_edges.push({arrows: { to: { enabled: true}}, from: p1+1, to: p2+1, color: 'green',label: String(plane)});
            // Using spread operator to push elements of result of pushEdges to new_edges
            new_edges.push(...pushEdges(dist1, p1, false));
            new_edges.push(...pushEdges(dist2, p2, true));
        } else{
            new_edges.push(...pushEdges(dist1, dst-1, false));
        }
        const ans_data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return ans_data;
    }
    function solveDataUsingTitle() {

        const data = curr_data;

        // Creating adjacency list matrix graph from question data
        const graph = createGraphUsingtitle(data);

        // Applying djikstra from src and dst
        let dist1 = djikstra(graph,V,src-1);
        let dist2 = djikstra(graph,V,dst-1);

        // Initialise min_dist to min distance via bus from src to dst
        let mn_dist = dist1[dst-1][0];

        // See if plane should be used
        let {plane, p1, p2} = shouldTakePlaneUsingTitle(data['edges'], dist1, dist2, mn_dist);

        let new_edges = [];
        if(plane!==0){
            new_edges.push({arrows: { to: { enabled: true}}, from: p1+1, to: p2+1, color: 'green',label: String(plane)});
            // Using spread operator to push elements of result of pushEdges to new_edges
            new_edges.push(...pushEdges(dist1, p1, false));
            new_edges.push(...pushEdges(dist2, p2, true));
        } else{
            new_edges.push(...pushEdges(dist1, dst-1, false));
        }
        const ans_data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return ans_data;
    }

    function pushEdges(dist, curr, reverse) {
        let tmp_edges = [];
        while(dist[curr][0]!==0){
            let fm = dist[curr][1];
            if(reverse)
                tmp_edges.push({arrows: { to: { enabled: true}},from: curr+1, to: fm+1, color: 'red', label: String(dist[curr][0] - dist[fm][0])});
            else
                tmp_edges.push({arrows: { to: { enabled: true}},from: fm+1, to: curr+1, color: 'red', label: String(dist[curr][0] - dist[fm][0])});
            curr = fm;
        }
        return tmp_edges;
    }

    // genNew.click();
    container.click();
};
