export class Task{
    constructor(description, isDone,id){
        this.description = description;
        this.isDone = isDone;
        console.log(id);
        if (!id){
            this.id = `f${(+new Date).toString(16)}`;
        }else{
            this.id = id;
        }
    }
}