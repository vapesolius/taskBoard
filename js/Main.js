import {
    Task
} from "./Task.js";

const REMOVE_ACTION = 'remove';
const COMPLETE_ACTION = 'complete';
const ALL = 'all';
const DONE = "done";
const OPEN = 'open';

class Main {
    constructor() {
        this.tasks = [];
        this.searchText = '';
        this.searchStatus = ALL;
        this.addListeners();
        this.loadData();
    }

    addListeners() {
        elem('addTaskButton').addEventListener('click', () => this.onNewTask());
        elem('tasksGroup').addEventListener('click', event => this.onTaskClick(event));
        elem('searchField').addEventListener('keyup', () => this.onSearch());
        elem('descriptionField').addEventListener('keydown', event => {
            if (event.keyCode === 13) {
                this.onNewTask();
            }
        });
        elem('pills-all').addEventListener('click', () => {
            this.searchStatus = ALL;
            this.renderTasks();
        });
        elem('pills-open').addEventListener('click', () => {
            this.searchStatus = OPEN;
            this.renderTasks();
        });
        elem('pills-done').addEventListener('click', () => {
            this.searchStatus = DONE;
            this.renderTasks();
        });
        elem('tasksGroup').addEventListener('keydown', event => {
            if (event.keyCode === 13) {
                this.onTaskEdit(event);
            }
        });

    }

    loadData(){
        this.searchStatus = localStorage.getItem('searchStatus')||ALL;
        if (this.searchStatus == DONE){
            $('#pills-done').tab('show');
        }
        if (this.searchStatus == OPEN){
            $('#pills-open').tab('show');
        }
        this.searchText = localStorage.getItem('searchText')||"";
        if(this.searchText){
            elem('searchField').value = this.searchText;
        }
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks){
            this.tasks = tasks.map(task => new Task(task.description,task.isDone,task.id));
        }
        this.renderTasks();
    }

    onTaskEdit(event){
        
        const id = event.target.dataset.id;
        const targetTask = this.tasks.find(task => task.id == id);
        console.log('edit',id,targetTask.id);
        targetTask.description = event.target.value;
        this.renderTasks();
    }

    onSearch() {
        this.searchText = elem('searchField').value;
        this.renderTasks();
    }

    onNewTask() {
        const description = elem('descriptionField').value;
        if (!description) {
            alert('task description required');
            return;
        }
        this.tasks.push(new Task(description, false));
        this.renderTasks();
    }

    onTaskClick(event) {

        switch (event.target.dataset.action) {
            case REMOVE_ACTION:
                this.removeTask(event.target.dataset.id);
                break;
            case COMPLETE_ACTION:
                this.toggleTaskStatus(event.target.dataset.id);
                break;
        }
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id != id);
        this.renderTasks();
    }

    toggleTaskStatus(id){
        const targetTask = this.tasks.find(task => task.id == id);
        targetTask.isDone = !targetTask.isDone;
        this.renderTasks();
    }

    renderTasks() {
        const group = elem('tasksGroup');
        const filteredTasks = this.tasks.filter(task => this.filterTask(task));
        const elements = filteredTasks.map(task => this.getTaskTemplate(task));
        group.innerHTML = elements.join('');
        this.updateStorage();
    }

    updateStorage(){
        localStorage.setItem('searchStatus',this.searchStatus);
        localStorage.setItem('searchText',this.searchText);
        localStorage.setItem('tasks',JSON.stringify(this.tasks));
    }

    filterTask(task) {
        let isStatusMatch = false;

        switch (this.searchStatus) {
            case ALL:
                isStatusMatch = true;
                break;
            case OPEN:
                isStatusMatch = !task.isDone;
                break;
            case DONE:
                isStatusMatch = task.isDone;
                break;
        }
        return task.description.search(this.searchText) != -1 && isStatusMatch;
    }

    getTaskTemplate(task) {
        return `<div class="list-group-item">
        <input type="text" class="form-control" value="${task.description}" data-id="${task.id}"/>
          
       

        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="${task.id}" data-id="${task.id}" data-action="${COMPLETE_ACTION}" ${task.isDone?'checked':''}/>
          <label class="custom-control-label" for="${task.id}">Done</label>
        </div>
        
        <button class="btn btn-primary" type="button" data-action="${REMOVE_ACTION}" data-id="${task.id}">Remove</button>
      </div>`
    }
}

export const main = new Main();

export function elem(id) {
    return document.getElementById(id);
}