import { GithubUser } from "./GithubUser.js"

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
                throw new Error("Usuário não encontrado!")
            }

            this.root.querySelector("input").value = ""
            this.entires = [user, ...this.entires]
            this.update()
            this.save()
        
        } catch(error) {
            alert(error)
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
        this.deleteAllRows()

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
                <td>
                    <img src="https://github.com/${user.login}.png" alt="Imagem de ${user.login}">

                    <div class="infos">
                        <p>${user.name}</p>
                        <p>/${user.login}</p>
                    </div>
                </td>
                <td>${user.public_repos}</td>
                <td>${user.followers}</td>
                <td>
                    <button class="remove" >
                        trashIcon
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
}