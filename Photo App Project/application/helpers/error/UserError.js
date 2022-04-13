class UserError extends Error{
    constructor(message, redirectUrl, status){
        super(message);
        this.redirectUrl = redirectUrl;
        this.status = status;
    }

    getMessage() {
        return this.message;
    }
    getRedirecUrl() {
        return this.redirectUrl;
    }
    getStatus(){
        return this.status;
    }
}

module.exports = UserError;