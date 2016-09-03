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

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque semper libero urna, in rutrum justo elementum et. Pellentesque hendrerit ante ut ultrices varius. Duis egestas volutpat quam, eget egestas augue viverra posuere. Fusce et nisl sapien. Mauris et augue ac risus tristique dignissim at a quam. Fusce nisi lectus, auctor quis egestas at, interdum et ipsum. Integer mattis malesuada nulla nec accumsan. Donec fringilla massa auctor felis dignissim, non vestibulum mauris tincidunt. Nulla congue eleifend nulla sed porta.