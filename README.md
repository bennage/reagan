# Reagan

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