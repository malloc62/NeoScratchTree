const treeWidth = 2;
const treeHeight = 120;
const magConst = 150;

const itemWidth = 120; 
const itemHeight = 90;

function genElement(type, area, content, attribs) {
    var elem = document.createElement(type);

    var directAttribs = attribs.direct || {};
    var styleAttribs = attribs.style || {};
    var posAttribs = attribs.pos || {};

    var fullStyle = "";

    Object.keys(posAttribs).forEach(function(attrib) {
        styleAttribs[attrib] = posAttribs[attrib] + 'px';
    });

    Object.keys(styleAttribs).forEach(function(attrib) {
        fullStyle += `${attrib}: ${styleAttribs[attrib]};`
    });

    directAttribs.style = fullStyle;

    Object.keys(directAttribs).forEach(function(attrib) {
        elem.setAttribute(attrib,directAttribs[attrib]);
    });

    elem.textContent = content;

    area.appendChild(elem);

    return elem;
}

function genEntry(posEntry,area,fetchData) {
	var data = fetchData[posEntry.id] || {};

    var x = posEntry.x * magConst;
    var y = posEntry.y * treeHeight;

    var a = genElement(
        "a",
        area,
        '',
        {
            "pos": {
                "left": x,
                "top": y + itemHeight / 2,
            },
            "direct": {
                "href": 'https://scratch.mit.edu/projects/' + posEntry.id
            }
        }
    );

    genElement(
        "img",
        a,
        '',
        {
            "direct": {
                'src': 'https://cdn2.scratch.mit.edu/get_image/project/' + posEntry.id + '_120x90.png'
            }
        }
    );
 
    genElement(
        "div",
        area,
        "",
        {
            "pos": {
                "left": x + (itemWidth / 2),
                "top": y - treeHeight + itemHeight,
                "width": treeWidth,
                "height": treeHeight * 2 - itemHeight
            },
        }
    );


    if (posEntry.offbranch >= 0)
        genElement(
            "div",
            area,
            "",
            {
                "pos": {
                    "left": x + (itemWidth / 2),
                    "top": y + itemHeight,
                    "height": treeWidth,
                    "width": magConst * (posEntry.offbranch)
                },
            }
        );
}

async function genTree() {
    var area = document.querySelector('#area-main');   
    
    var params = new URLSearchParams(window.location.search);
    var treeId = params.get("id");

    var fetchData = await fetch(`https://scratch.mit.edu/projects/${treeId}/remixtree/bare`)
        .then(x => x.json());

    var pos = await main(fetchData);

    pos.forEach(function(posEntry) {
        genEntry(posEntry,area,fetchData);
    });
}

genTree();
