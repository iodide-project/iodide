const template = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="<%= APP_PATH_STRING %>iodide.<%= APP_VERSION_STRING %>.css">
</head>
<body>
<div id='eval-container'></div>
<script src='<%= APP_PATH_STRING %>iodide.<%= APP_VERSION_STRING %>.js'></script>
</body>
</html>`

module.exports = template
