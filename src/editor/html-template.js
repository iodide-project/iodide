const template = `<!DOCTYPE html>
<html>
<head>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
<meta name="theme-color" content="#ffffff">
<meta charset="UTF-8">
<title><%= NOTEBOOK_TITLE %> - iodide</title>
<link rel="stylesheet" type="text/css" href="<%= APP_PATH_STRING %>iodide.<%= APP_VERSION_STRING %>.css">
<base target="_blank" rel="noopener noreferrer">
</head>
<body>
<script id="jsmd" type="text/jsmd">
<%= JSMD %>
</script>
<iframe
  id="eval-frame"
  src="<%= EVAL_FRAME_ORIGIN %>/iodide.eval-frame.<%= APP_VERSION_STRING %>.html"
  sandbox="allow-scripts allow-same-origin"
  allowfullscreen="true"
  allowvr="yes"
></iframe>
<script src="<%= APP_PATH_STRING %>iodide.<%= APP_VERSION_STRING %>.js"></script>
</body>
</html>`;

module.exports = template;
