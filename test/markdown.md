# My Test Case

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque semper libero urna, in rutrum justo elementum et. Pellentesque hendrerit ante ut ultrices varius. Duis egestas volutpat quam, eget egestas augue viverra posuere. Fusce et nisl sapien. Mauris et augue ac risus tristique dignissim at a quam. Fusce nisi lectus, auctor quis egestas at, interdum et ipsum. Integer mattis malesuada nulla nec accumsan. Donec fringilla massa auctor felis dignissim, non vestibulum mauris tincidunt. Nulla congue eleifend nulla sed porta.


## Indented sample - the source is not idented
<!-- source: https://github.com/bennage/reagan/blob/master/listFiles.js#L5-L18 -->

```javascript
    function scanFolder(cwd, pattern) {

        return new Promise((resolve, reject) => {

            glob(pattern, { cwd: cwd }, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(files);
            });

        });
    }
```
## Indented source - the sample is not idented

<!-- source: https://github.com/bennage/reagan/blob/master/listFiles.js#L7-L17-->

```javascript
return new Promise((resolve, reject) => {

    glob(pattern, { cwd: cwd }, (err, files) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(files);
    });

});
```

## identifying the language with a comment

<!-- source: https://github.com/bennage/reagan/blob/master/listFiles.js#L7-->

```javascript
    //javascript
    return new Promise((resolve, reject) => {
```


## Allow abbreviations with ...

<!-- source: https://github.com/bennage/reagan/blob/master/listFiles.js#L5-L18 -->

```javascript
    function scanFolder(cwd, pattern) {

        return new Promise((resolve, reject) => {
            ...
        });
    }
```

## Allow abbreviations with ...

<!-- source: https://github.com/bennage/reagan/blob/master/listFiles.js#L5-L18 -->

```javascript
    function ScanFolder(cwd, pattern) {

        return new Promise((resolve, reject) => {
            ...
        });
    }
```

Donec eget commodo nisi. Quisque eu pellentesque erat. Donec aliquet, velit nec ultrices bibendum, mauris erat cursus magna, a porttitor mi leo sit amet nulla. Etiam bibendum blandit lobortis. Vivamus dui mauris, consectetur ut eros volutpat, ultrices vehicula ex. Nunc eu imperdiet sem, non maximus purus. Mauris quis rhoncus elit. Cras dui enim, scelerisque eu neque ac, congue accumsan sem. Pellentesque sollicitudin libero at ex condimentum pretium. Integer ultricies augue nec felis consequat, sit amet cursus libero varius.

Fusce aliquet nisi id commodo condimentum. Mauris faucibus odio nec augue ultricies, sit amet mollis nisl rhoncus. Etiam maximus arcu non metus tincidunt sollicitudin. Integer ac nisi nisi. Etiam eget arcu vel risus eleifend finibus. Pellentesque luctus ipsum metus, vel hendrerit odio egestas quis. Sed a est sit amet mi placerat viverra. Phasellus convallis volutpat risus. Nunc at justo eu nunc vulputate rutrum eget sit amet augue. Proin cursus nec nibh hendrerit tincidunt. Nullam vitae commodo sapien. Suspendisse potenti. Nam justo nibh, bibendum ut scelerisque nec, varius vel tellus. In hac habitasse platea dictumst. Ut mollis venenatis purus, at sagittis turpis maximus at. Ut lacus justo, tristique egestas egestas nec, molestie ut massa.