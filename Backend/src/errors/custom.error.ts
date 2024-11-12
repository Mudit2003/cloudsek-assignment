
export class CustomError extends Error{
    status; 
    constructor(message?: string , name?: string , status?: number){
        super(message || "Server Connection Error");
        this.status = status || 500; 
        this.name = name || "ServerErron"; 
    }
}