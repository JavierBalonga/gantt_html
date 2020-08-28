function Task(element) {
    let data = element.dataset.data.split(";");
    data[0] = data[0].split(" ");
    data[1] = data[1].split(" ");
    data[0][1] = data[0][1].split(":");
    data[1][1] = data[1][1].split(":");
    this.id = element.id.slice(3);;
    this.startDay = data[0][0];
    this.endDay = data[1][0];
    this.startHour = data[0][1][0] / 24 + data[0][1][1] / 1440 + data[0][1][2] / 86400;
    this.endHour = data[1][1][0] / 24 + data[1][1][1] / 1440 + data[1][1][2] / 86400;
    this.color = data[2];
    this.unitTime = data[3] / 24;
    if (data[4]) {
        this.parents = data[4].split(",");
    }
}

Task.prototype.print = function(event) {
    let startDayElement = daysArray.filter(day => day.textContent == this.startDay)[0];
    let left = startDayElement.offsetLeft + startDayElement.offsetWidth * this.startHour;

    let endDayElement = daysArray.filter(day => day.textContent == this.endDay)[0];
    let width = endDayElement.offsetLeft + endDayElement.offsetWidth * this.endHour - left;

    let element = document.querySelector("#tsk" + this.id);
    element.style.left = `${left}px`;
    element.style.width = `${width}px`;
    if (event.type == "load") {
        element.style.backgroundColor = this.color;
        element.style.opacity = 1;
    }

}

Task.prototype.connectorsPrint = function(event) {
    if (!this.parents) return;
    this.parents.forEach(parent => {
        let connector
        if (event.type == "load") {
            connector = document.querySelector("#connectors polyline").cloneNode();
            connector.id = "C" + parent + "_" + this.id;
            document.getElementById("connectors").appendChild(connector);
        } else {
            connector = document.querySelector("#C" + parent + "_" + this.id);
        }
        let father = document.querySelector("#tsk" + parent);
        let child = document.querySelector("#tsk" + this.id);
    
        let x1 = father.offsetLeft + father.offsetWidth;
        let y1 = father.offsetTop + father.offsetHeight / 2;
        let x2 = child.offsetLeft;
        let y2 = child.offsetTop + child.offsetHeight / 2;
        let x1_2 = x1 + ( x2 - x1 ) / 2;
    
        connector.setAttribute('points', x1+","+y1+" "+x1_2+","+y1+" "+x1_2+","+y2+" "+x2+","+y2)
    });
}

var daysArray = [];
function createDays() {
    let days = document.querySelectorAll(".dayAxis li");
    daysArray = [...days];
}

var tasksArray = [];
function createTasks() {
    let elements = document.querySelectorAll(".tasksList li");
    elements.forEach(el => {
        tasksArray.push(new Task(el));
    });
}

window.addEventListener("load", function(event) {
    createDays();
    createTasks();
    tasksArray.forEach(el => {el.print(event)});
    tasksArray.forEach(el => {el.connectorsPrint(event)});
});

window.addEventListener("resize", function(event) {
    tasksArray.forEach(el => {el.print(event)});
    tasksArray.forEach(el => {el.connectorsPrint(event)});
});
