## lengthy samples can be abbreviated with ...

<!-- source: https://github.com/bennage/reagan/blob/master/test/_reference.code#L21-L40 -->

```astar
function A*(start, goal)
    // The set of nodes already evaluated.
    closedSet := {}
    
    ...
    
    // For each node, the total cost of getting from the start node to the goal
    // by passing by that node. That value is partly known, partly heuristic.
    fScore := map with default value of Infinity
    // For the first node, that value is completely heuristic.
    fScore[start] := heuristic_cost_estimate(start, goal)
```