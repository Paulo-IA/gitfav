export class Modal {
    constructor({ type, message, root }) {
        this.modalInfo = { type, message, root }

        this.root = this.modalInfo.root
    } 
}

export class ModalView extends Modal {
    constructor({ type, message, root }) {
        super({ type, message, root })
    }

    listener() {

        if (this.root.querySelector('#std')) {
            this.root.querySelector('#std').onclick = () => {
                this.close()
                return false
            }
        }
    }

    render() {
        const modalWrapper = document.createElement('div')
        modalWrapper.setAttribute('id', 'modal-wrapper')

        const modal = this.createModal()
        modalWrapper.appendChild(modal)

        this.root.appendChild(modalWrapper)

        this.listener()
    }

    createModal() {
        const modal = document.createElement('div')
        modal.setAttribute('id', 'modal')

        const messageElement = this.createMessage()
        modal.appendChild(messageElement)

        const buttonWrapper = this.createButtonWrapper()
        modal.appendChild(buttonWrapper)
        
        return modal
    }

    createMessage() {
        const message = document.createElement('p')
        message.innerHTML = `
            <p>
                <span class="ph ph-warning-circle"></span>
                ${this.modalInfo.message}
            </p>
        `

        return message
    }

    createButtonWrapper() {
        const buttonWrapper = document.createElement('div')
        buttonWrapper.classList.add('modal-button-wrapper')

        if (this.modalInfo.type == 'confirm') {
            buttonWrapper.innerHTML = `
                <button id="std"><span class="ph ph-check-circle"></span>Ok</button>
            `
            
            return buttonWrapper
        }

        buttonWrapper.innerHTML = `
            <button id="confirm" class="confirm"><span class="ph ph-check-circle"></span>Sim, excluir</button>
            <button id="cancel " class="cancel"><span class="ph ph-x-circle"></span>Cancelar</button>
        `
            
        return buttonWrapper
    }

    close() {
        this.root.querySelector('#modal-wrapper').remove()
    }
}