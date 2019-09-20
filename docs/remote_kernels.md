# Remote kernels

## Backend

When a remote chunk is discovered as part of the notebook
evaluation the Iodide frontend will send the full chunk
to the server API and create a remote operation object to
track its evaluation.

Once the remote operation has been created it will be
executed with the backend as defined by the backend chunk argument.

A remote chunk could look like this:

```
%% remote query
data_source = telemetry
output_name = result
filename = user_count_query.json
-----
select count(*) from telemetry.users
```

The backend chosen by the chunk argument will then parse the chunk
content and separate chunk parameters (TOML formatted) from the chunk
snippet (e.g. a SQL query) and store them in the remote operation table
for later reference.

The remote operation will then be executed using its backend and
the resulting response stored in a file with the provided or
calculated file name.

### Domain objects

1. [Remote operation](#remote-operation)

> The object to track the status, notebook, backend, parameters, snippet and resulting file. The parameters are expected to be TOML formatted when submitted and are stored as a single JSONB value.

2. [File](#file)

> The resulting file of a remote operation which is able to be refreshed using the previously stored parameters and snippet or overwritten at the next evaluation of the same remote chunk (even if the parameters or snippet change).

### API endpoints

#### Remote operation

**URL**: `/api/v1/remote-operations/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : Owner of the notebook

**Data constraints**

Provide metadata needed to create remote operation

```json
{
	"metadata": {
		"notebook_id": [int],
		"backend": [unicode]
	}
}
```

Provide content of remote chunk

```json
{
  "content": `
		filename=results.json
		foo = bar
		-----
		SELECT * FROM users;
		`
}
```

##### Success Response

**Code** : `201 CREATED`

When evaluating a remote chunk we send the chunk's content and a bunch of required metadata with a POST request.

**Content example**

```json
{
	"notebook_id": 1234,
	"backend": "query",
	"status": "PENDING",
	"paramters": {
	  "notebook_id": 1234,
	  "backend": "query",
  },
  "filename": "results.json",
  "snippet": "[chunk content]",
  "scheduled_at": "2019-09-16T15:48:55",
  "started_at": "null",
  "ended_at": null,
  "failed_at": null
}
```

##### Error Response

**Code**: `403 Permission Denied`

If the user isn't the owner of the notebook the response will be a 403.

**Code**: `404 File Not Found`

If no notebook can be found given the notebook ID in the metadata the response will be 404.

**Code**: `400 Bad Request`

If the submitted remote chunk can't be parsed, e.g. the parameters aren't correctly formatted TOML, the server will raise a bad request response.
