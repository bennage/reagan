# Reagan

<a title="By tcm (screenshots from trailer) [Public domain], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File%3ARonald_Reagan_in_The_Bad_Man_(1941).png"><img width="256" alt="Ronald Reagan in The Bad Man (1941)" src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Ronald_Reagan_in_The_Bad_Man_%281941%29.png"/></a>

Reagan is a tool for verifying that code samples embedded in a markdown document are in sync with the GitHub-hosted source files.

```
npm i -g reagan
```

Reagan will scan markdown file for code blocks preceded by a special HTML comments:

```
    <!-- source: http://github.com/your/repo/file.code#L10-L20 -->

    ```language
        some cool snippet
    ```
```

Reagan will compare the code block to the lines identified in the comment.
By default, Reagan will scan the current directory for files with an md extension.

```
  Usage: reagan [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --folder [folder]  the folder to search
    -i, --include [glob]   the pattern to match (defaults to **/*.md)
```