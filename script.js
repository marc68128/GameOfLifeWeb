var timer;
var mousedown = false;
var rowCount = 20;
var columnCount = 30;
$("#ColumnNumberInput").val(columnCount);
$("#RowNumberInput").val(rowCount);

var delay = 200;

InitGrid();

$(window).resize(function () {
    InitGrid();
});

$(window).mousedown(function () {
    mousedown = true;
});
$(window).mouseup(function () {
    mousedown = false;
});
$('.cell').mouseenter(function () {
    if (mousedown) {
        console.log($(this));
        ToggleGridState($(this));
    }
});


$('#Toggle').on('click', function () {
    if ($(this).html() == "Start") {
        $(this).html("Stop");
        timer = setInterval(moveNext, delay);
    } else {
        $(this).html("Start");
        clearInterval(timer);
    }
});

$('#GridDiv').on('click', '.cell', function () {
    ToggleGridState($(this));
});

$('#Init').on('click', function () {
    InitGrid();
});

var moveNext = function () {

    $("div[data-next='0']").each(function () {
        console.log("DEAD");
        $(this).css("background-color", "blue");
        $(this).attr("data-alive", 0);
        $(this).attr("data-changed", 1);
        $(this).attr("data-next", 2);
    });

    $("div[data-next='1']").each(function () {
        $(this).css("background-color", "black");
        $(this).attr("data-alive", 1);
        $(this).attr("data-changed", 1);
        $(this).attr("data-next", 2);
    });

    $("div[data-changed='1']").each(function () {
        $(this).attr("data-changed", 0);
        CheckNext($(this));
        CheckNextNeighbors($(this));
    });
};

function InitGrid() {
    rowCount = $("#RowNumberInput").val();;
    columnCount = $("#ColumnNumberInput").val();
    delay = 200;

    var div = $("#GridDiv");
    div.html("");

    var height = div.height();
    var width = div.width();

    var rowHeight = height / rowCount - 2;
    var columnWidth = width / columnCount - 2;

    for (var i = 0; i < rowCount; i++) {
        for (var j = 0; j < columnCount; j++) {
            div.append("<div class='cell' style='height: "
				+ rowHeight
				+ "px; width: "
				+ columnWidth
				+ "px; left: "
				+ ((j * (columnWidth + 2)) + 1)
				+ "px; top: "
				+ ((i * (rowHeight + 2)) + 1)
				+ "px;' data-col='"
				+ j
				+ "' data-row='"
				+ i
				+ "' data-alive='0' data-changed='0' data-next='2'></div>");
        }
    }
}

function CheckNext(cell) {
    var col = parseInt(cell.attr('data-col'));
    var row = parseInt(cell.attr('data-row'));
    var isAlive = parseInt(cell.attr('data-alive')) == 1;

    var aliveNeighbors = 0;
    for (var i = Math.max(row - 1, 0) ; i <= Math.min(row + 1, rowCount - 1) ; i++) {
        for (var j = Math.max(col - 1, 0) ; j <= Math.min(col + 1, columnCount - 1) ; j++) {
            if (i == row && j == col) continue;
            aliveNeighbors += $("div[data-col='" + j + "'][data-row='" + i + "']").attr("data-alive") == 1 ? 1 : 0;
        }
    }

    if (isAlive && aliveNeighbors != 2 && aliveNeighbors != 3)
        cell.attr("data-next", 0);
    else if (!isAlive && aliveNeighbors == 3)
        cell.attr("data-next", 1);
    else
        cell.attr("data-next", 2);
}

function CheckNextNeighbors(cell) {
    var col = parseInt(cell.attr('data-col'));
    var row = parseInt(cell.attr('data-row'));

    for (var i = Math.max(row - 1, 0) ; i <= Math.min(row + 1, rowCount - 1) ; i++) {
        for (var j = Math.max(col - 1, 0) ; j <= Math.min(col + 1, columnCount - 1) ; j++) {
            if (i == row && j == col) continue;
            CheckNext($("div[data-col='" + j + "'][data-row='" + i + "']"));
        }
    }
}

function ToggleGridState(grid) {
    if (grid.attr("data-alive") == 0) {
        grid.css("background-color", "black");
        grid.attr("data-alive", 1);
    } else {
        grid.css("background-color", "blue");
        grid.attr("data-alive", 0);
    }
    CheckNext(grid);
    CheckNextNeighbors(grid);
}