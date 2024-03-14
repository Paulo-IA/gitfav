export class Modal {
    constructor({ type, message, root }) {
        this.modalInfo = { type, message, root }
    } 
}

export class ModalView extends Modal {
    constructor({ type, message, root }) {
        super({ type, message, root })
    }

    render() {
        // const modal = document.createElement('div')
        // modal.classList.add('modal')
        // this.modalInfo.root.append()

        //change boolean to delete
        console.log(this.modalInfo)
    }
}