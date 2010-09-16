/**
 * load, replace css file example taken from
 * http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
**/
/* function used to create a reference to a JS/CSS file */
function createJSCSSFile(filename, filetype)
{
    if (filetype == "js")
    {
	var fileref = document.createElement('script')
	fileref.setAttribute("type", "text/javascript")
	fileref.setAttribute("src", filename)
    }
    else if (filetype == "css")
    {
	var fileref = document.createElement("link")
	fileref.setAttribute("rel", "stylesheet")
	fileref.setAttribute("type", "text/css")
	fileref.setAttribute("href", filename)
    }
    return fileref
}
var loadedFiles={}
/* function used to load a JS/CSS file...*/
function loadJSCSSFile(filename, filetype)
{
    var fileref = createJSCSSFile(filename, filetype)
    if (typeof fileref != "undefined")
    {
	/* we managed to find the file... add it to <head> */
	document.getElementsByTagName("head")[0].appendChild(fileref)
	loadedFiles[filename]=1
    }
}

/* function which loads a JS/CSS file only once */
var filesAdded="" /*list of files already added*/
function checkLoadCSSFile(filename, filetype)
{
    if (filesAdded.indexOf("["+filename+"]") == -1)
    {
	loadJSCSSFile(filename, filetype)
	filesAdded += "["+filename+"]" /*list of files already added*/
	loadedFiles[filename]=1
    }
}

/* function used to replace a JS/CSS file*/
function replaceJSCSSFile(oldFilename, newFilename, filetype)
{
    var targetElement = (filetype == "js") ? 
	"script" : (filetype == "css") ?
	"link" : "none"
    var targetAttr = (filetype == "js") ?
	"src" : (filetype == "css") ?
	"href" : "none"
    var allSuspects = document.getElementsByTagName(targetElement)
    for (var i = allSuspects.length; i >= 0; --i) /*search backwards for element to remove*/
    {
	if (allSuspects[i] &&
	    allSuspects[i].getAttribute(targetAttr) != null &&
	    allSuspects[i].getAttribute(targetAttr).indexOf(oldFilename) != -1)
	{
	    /* found it! */
	    var newElement = createJSCSSFile(newFilename, filetype)
	    allSuspects[i].parentNode.replaceChild(newElement, allSuspects[i])
	    loadedFiles[newFilename] = 1
	    loadedFiles[oldFilename] = 0
	}
    }
}

var currentCSSTheme=""
/*functions to load and swith the main CSS theme*/
function loadCSSTheme(filename)
{
    loadJSCSSFile(filename, "css")
    currentCSSTheme = filename
}

function switchToCSSTheme(filename)
{
    if (currentCSSTheme != "")
    {
	replaceJSCSSFile(currentCSSTheme, filename, "css")
    }
    else
    {
	loadJSCSSFile(filename, "css")
    }
    currentCSSTheme = filename
}