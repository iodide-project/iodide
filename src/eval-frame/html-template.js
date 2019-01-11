const template = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="<%= EVAL_FRAME_ORIGIN %>iodide.<%= APP_VERSION_STRING %>.css">
<base target="_blank" rel="noopener noreferrer">
</head>
<body>
<style id='view-mode-styles'></style>
<div id='eval-container'></div>
<script src='<%= EVAL_FRAME_ORIGIN %>iodide.<%= APP_VERSION_STRING %>.js'></script>
</body>
</html>`;

module.exports = template;
