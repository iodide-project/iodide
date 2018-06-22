const template = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title><%= NOTEBOOK_TITLE %> - iodide</title>
<link rel="stylesheet" type="text/css" href="<%= APP_PATH_STRING %>iodide.<%= APP_VERSION_STRING %>.css">
</head>
<body>
<script id="jsmd" type="text/jsmd">
<%= JSMD %>
</script>
<div id='page'></div>
<script src='<%= APP_PATH_STRING %>iodide.<%= APP_VERSION_STRING %>.js'></script>
</body>
</html>`;

module.exports = template;
