var NB = {}
NB.getData = function(url) {
  var re = new XMLHttpRequest()
  re.open('GET', url, false)
  re.send(null)
  return re.response
}