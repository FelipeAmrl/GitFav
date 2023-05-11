import { GithubUser } from "./GithubUser.js";

export class Favorites 
{
    constructor(root)
    {
        this.root = document.querySelector(root);
        this.load();
    }

    load()
    {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];   
    }

    save()
    {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
    }

    async add(username)
    {
        try
        {
            const USER_EXISTS = this.entries.find(entry => entry.login === username);

            if(USER_EXISTS)
                throw new Error('User already registered!')

            const USER = await GithubUser.search(username);

            if(USER.login === undefined) 
                throw new Error('User not found!');

            this.entries = [USER, ...this.entries];

            this.update();
            this.save();
        } 
        catch(error) 
        {
            alert(error.message);
        }
        
    }

    delete(user)
    {
        const FILTEREDENTRIES = this.entries.filter( entry => entry.login !== user.login );

        this.entries = FILTEREDENTRIES;

        this.update();
        this.save();
    }
}

export class FavoriteView extends Favorites
{
    constructor(root)
    {
        super(root);

        this.tbody = this.root.querySelector('table tbody');

        this.update();
        this.onadd();
    }

    onadd()
    {
        const ADDBUTTON = this.root.querySelector('#addButton');

        ADDBUTTON.onclick = () => {
            const { value } = this.root.querySelector('#search-input');

            this.add(value);
        }
    }

    update()
    {
        this.removeAllTr();

        this.entries.forEach( user => {
            const ROW = this.createRow();

            ROW.querySelector('.user img').src = `https://github.com/${user.login}.png`;
            ROW.querySelector('.user img').alt = `image of ${user.name}`;
            ROW.querySelector('.user p span').textContent = user.name;
            ROW.querySelector('.user p a').textContent = `/${user.login}`;
            ROW.querySelector('.user p a').href = `https://github.com/${user.login}`;
            ROW.querySelector('.repositories').textContent = user.public_repos;
            ROW.querySelector('.followers').textContent = user.followers;

            ROW.querySelector('.action button').onclick = () => {
                const ISOK = confirm("Are you sure about deleting this row?");

                if(ISOK)
                    this.delete(user);
                
             }

            this.tbody.append(ROW);    
        });

    }

    createRow()
    {
        const TR = document.createElement('tr');

        const CONTENT = `
            <td class="user">
                <img src="" alt="">
                <p>
                    <span></span>
                    <a href="" target="_blank"></a>
                </p>
            </td>
            <td class="repositories"></td>
            <td class="followers"></td>
            <td class="action">
                <button>Remove</button>
            </td>
        `

        TR.innerHTML = CONTENT;

        return TR;
    }

    removeAllTr()
    {
        const ROW = this.tbody.querySelectorAll('tr');

        ROW.forEach( tr => tr.remove() );
    }
}

