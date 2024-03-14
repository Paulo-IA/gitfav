import { GithubUser } from "./GithubUser.js"
import { ModalView } from "./Modal/index.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)

        this.load()
    }

    load() {
        this.entires = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entires))
    }

    async add(login) {
        try {
            const userExists = this.entires.find(entry => login === entry.login)

            if (!login) { throw new Error("Preencha o campo!") }
            
            if (userExists) { throw new Error("Usuário já Favoritado!") }

            const user = await GithubUser.search(login)

            if (user.login === undefined) {
                let dataModal = {
                    type: "confirm",
                    message: "Usuário não encontrado!",
                    root: this.root
                }

                throw dataModal;
            }

            this.root.querySelector("input").value = ""
            this.entires = [user, ...this.entires]
            this.update()
            this.save()
        
        } catch(error) {
            
            const errorModal = new ModalView(error)
            errorModal.render()
        }
    }

    delete(user) {
        this.entires = this.entires.filter(entry => user.login !== entry.login)

        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector("table tbody")
        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector(".search button")
        addButton.addEventListener('click', () => {
            const { value } = this.root.querySelector(".search input")
            this.add(value)
        })
    }

    update() {
        this.isEntiresEmpty = this.entires.length < 1
        this.deleteAllRows()
        
        if (this.isEntiresEmpty) {
            this.showNotFavoriteYet()
            return
        }

        this.entires.forEach(user => {
            const row = this.createRow(user)

            row.querySelector(".remove").onclick = () => {
                const isOk = confirm("Tem certeza?")

                if (isOk) {
                    this.delete(user)
                }

            }

            this.tbody.append(row)
        })
    }

    createRow(user) {
        const rowElement = document.createElement('tr')

        rowElement.innerHTML = `
            <tr>
                <td class="user">
                    <img src="https://github.com/${user.login}.png" alt="Imagem de ${user.login}">

                    <a href="https://github.com/${user.login}" target="_blank" class="infos">
                        <p>${user.name}</p>
                        <p>/${user.login}</p>
                    </a>
                </td>
                <td>${user.public_repos}</td>
                <td>${user.followers}</td>
                <td>
                    <button class="remove ph ph-trash">
                    </button>
                </td>
            </tr>
        `;

        return rowElement;
    }

    deleteAllRows() {
        this.tbody.querySelectorAll('tr')
            .forEach(tr => {
                tr.remove()
            })
    }

    showNotFavoriteYet() {
        let messageHTML = `
            <tr class="message-container">
                <td class="message-content">
                    <img src="./assets/star.svg" alt="Star">
                    <p>Nenhum favorito ainda</p>
                </td>
            </tr>
        `

        this.tbody.innerHTML = messageHTML
    }
}