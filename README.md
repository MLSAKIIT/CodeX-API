## CodeX API
### Execute Code and fetch output

#### `POST` /

This endpoint allows you to execute your script and fetch output results.

### What are the Input Parameters for execute api call?

| Parameter  | Description                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| "code"     | Should contain the script that needs to be executed                                                                           |
| "language" | Language that the script is written in for example: java, cpp, etc. (Check language as a payload down below in next question) |
| "input"    | In case the script requires any kind of input for execution, leave empty if no input required                                 |

### What are the languages that are supported for execution?

Whichever language you might mention in the language field, it would be automatically executed with the latest version of it's compiler.
| Languages | Language as a payload |
|-----------|-----------------------|
| Java | java |
| Python | py |
| C++ | cpp |
| C | c |
| GoLang | go |
| C# | cs |
| NodeJS | js |

#### `GET` /list

This endpoint allows you to list all languages supported and their versions.

```json
{
  "timeStamp": 1672440064864,
  "status": 200,
  "supportedLanguages": [
    {
      "language": "java",
      "info": "openjdk 11.0.17 2022-10-18\nOpenJDK Runtime Environment (build 11.0.17+8-post-Ubuntu-1ubuntu218.04)\nOpenJDK 64-Bit Server VM (build 11.0.17+8-post-Ubuntu-1ubuntu218.04, mixed mode, sharing)\n"
    },
    {
      "language": "cpp",
      "info": "g++ (Ubuntu 7.5.0-3ubuntu1~18.04) 7.5.0\nCopyright (C) 2017 Free Software Foundation, Inc.\nThis is free software; see the source for copying conditions.  There is NO\nwarranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.\n\n"
    },
    {
      "language": "py",
      "info": "Python 3.6.9\n"
    },
    {
      "language": "c",
      "info": "gcc (Ubuntu 7.5.0-3ubuntu1~18.04) 7.5.0\nCopyright (C) 2017 Free Software Foundation, Inc.\nThis is free software; see the source for copying conditions.  There is NO\nwarranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.\n\n"
    },
    {
      "language": "js",
      "info": "v16.13.2\n"
    },
    {
      "language": "go",
      "info": "go version go1.10.4 linux/amd64\n"
    },
    {
      "language": "cs",
      "info": "Mono C# compiler version 4.6.2.0\n"
    }
  ]
}
```
### How to build and deploy
#### Prerequisites
```bash
docker buildx create --name builder0 --use
docker buildx inspect --bootstrap
```
#### Build command
```bash
docker buildx build \
--platform linux/amd64 \
-t codex-api:amd64 \
-f ./Dockerfile \
--build-arg AUTH_TOKEN=MLSA_Advent_of_Code_2024 \
--load \
./
```
#### Deploy with Docker compose
```bash
docker compose up -d
```

## TODO
- [ ] Add more languages support
- [ ] Upgrade to latest versions of compilers
- [ ] Update Dockerfile