const template = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title><%= NOTEBOOK_TITLE %> - iodide</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" type="text/css" href="<%= CSS_PATH_STRING %>react-table.css">
<link rel="stylesheet" type="text/css" href="<%= CSS_PATH_STRING %>eclipse.css">
<link rel="stylesheet" type="text/css" href="<%= CSS_PATH_STRING %>codemirror.css">
<link rel="stylesheet" type="text/css" href="<%= CSS_PATH_STRING %>page.css">
</head>
<body>
<script id="jsmd" type="text/jsmd">
<%= JSMD %>
</script>
<div id='page'></div>
<script src='<%= APP_PATH_STRING %>iodide.<%= APP_VERSION_STRING %>.js'></script>
</body>
</html>`

module.exports = template