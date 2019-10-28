# OpenTok Serverless

A set of JavaScript functions for Azure that act as a full-featured OpenTok Server.

## Capabilities

Below are the currently supported operations.

<details><summary>Get Session</summary>

GET/POST: `/api/GetSession`

#### Parameters

| Name | Type | Req? (Y/N) | Description
| --- | --- | --- | --- 
| sessionName | string | Y | Unqiue name to associate with this session
| mediaMode | string | N | Media settings the session should use. Defaults to `routed`
| archiveMode | string | N | Archive settings for the session. Defaults to `manual`
| location | string | N | Optional location hint

</details>

---

<details><summary>Get Token</summary>

### Get Token

POST: `/api/GetToken`

#### Parameters

| Name | Type | Req? (Y/N) | Description
| --- | --- | --- | --- 
| sessionId | string | Y | Unqiue name to associate with this session
| userName | string | Y | Name to display for user

</details>

## To Implement

Below are capabilities that are planned:

- [ ] Session Monitoring Callback to:
    - [ ] Update # of connected users
- [ ] Start Archive
- [ ] Stop Archive
