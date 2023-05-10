export class GithubUser {
    static search(username)
    {
        const endpoint = `https://api.github.com/users/${username}`;

        return fetch(endpoint)
            .then( data => data.json())
            .then( ({ login, name, public_repos, followers }) => ({
                login,
                name,
                public_repos,
                followers
            })) 
    }
}

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

    delete(user)
    {
        const FILTEREDENTRIES = this.entries.filter( entry => entry.login !== user.login );

        this.entries = FILTEREDENTRIES;

        this.update();
    }
}

export class FavoriteView extends Favorites
{
    constructor(root)
    {
        super(root);

        this.tbody = this.root.querySelector('table tbody');

        this.update();
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

