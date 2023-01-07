function genPos(id, fetchData) {
	var queue = [id];    
    
    var queueHead;
   
    var pos = [{
		"id": id,
		"x": '0',
		"y": 0,
		"offbranch": 0,
		"end": fetchData[id].children.length
	}];

    while (queue.length > 0) {
        queueHead = queue[0];

		var lastPosI = pos.findIndex(function(posEntry) {
			return posEntry.id == queueHead;
		});

		var children = fetchData[queueHead].children;
		queue.shift();
		if (!children || children.length == 0) continue;

		var lastPos;
		if (lastPosI > -1) {
			lastPos = pos[lastPosI];
		} else {
			continue;
		}

		children.forEach(function(child, i) {
			queue.push(child);

			pos.push({
				"id": child,
				"x": lastPos.x + '|' + i,
				"y": lastPos.y + 1,
				"offbranch": 0,
				"end": fetchData[child].children.length
			})

		});
	}

    return pos;
}

function sortPos(a,b) {
	var aSplit = [];
	var bSplit = [];

	a[0].split('|').forEach(function(x) {
		aSplit.push(Number(x))
	});
	b[0].split('|').forEach(function(x) {
		bSplit.push(Number(x))
	});

	var h = 0;
	aSplit.forEach(function(x, i) {
		if (h == 0 && x - bSplit[i] != 0) {
			h = x - bSplit[i];
		}
	})

	if (h == 0) {
		return (aSplit.length > bSplit.length) ? 1 : -1;
	}

	return h;
}


async function main(fetchData) {
	var rootId = fetchData['root_id'];

    var pos = genPos(rootId,fetchData);

	var posX = [];

	pos.forEach(function(posEntry) {
		posX.push([posEntry.x, posEntry.end]);
	})

	var posReduc = posX.reduce(function(a, b) {
		if (a.indexOf(b[0]) < 0) a.push(b);
		return a;
	}, []);


    posReduc.sort(sortPos);

	var i = 0;
	posReduc.forEach(function(posEntry, j) {
		posReduc[j] = [posEntry[0], i, posEntry[1]];
		var splitty = posEntry[0].split('|');
		var lastSplitty = splitty.pop();

		if (lastSplitty != '0') {
			i++;
			posReduc[j][1] = i;
		}
	});

	pos.forEach(function(posEntry, j) {
		var i = posReduc.findIndex(function(x) {
			return x[0] == posEntry.x
		});
		if (i != -1) {
			pos[j].x = posReduc[i][1];
			var extended = posReduc[i][0] + '|' + (posReduc[i][2] - 1);
			var indexB = posReduc.findIndex(function(x) {
				return x[0] == extended
			});
			if (indexB > -1) {
				pos[j].offbranch = (posReduc[indexB][1] - posReduc[i][1]);
			}
		}
	})

    return pos;

	var area = document.querySelector('#area-main');    
}
