const template = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="<%= EVAL_FRAME_PATH_STRING %>iodide.<%= APP_VERSION_STRING %>.css">
</head>
<body>
<div id='eval-container'></div>
<script src='<%= EVAL_FRAME_PATH_STRING %>iodide.<%= APP_VERSION_STRING %>.js'></script>
</body>
</html>`

module.exports = template
